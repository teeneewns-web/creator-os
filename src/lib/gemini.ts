import { GoogleGenAI } from '@google/genai'
import type { Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'
import { runQualityGate } from './quality-gate'
import { sanitizePlan } from './sanitize'

const FACT_SAFETY = `
FACT SAFETY - HIGHEST PRIORITY:
- NEVER invent personal stories, experiences, or events.
- NEVER say "I once...", "I tried...", "My client...", "My friend...", "Last week I..."
- NEVER invent testimonials, customer names, or case studies.
- NEVER use statistics or numbers the user did not provide.
- If a hook needs a story, use a SUGGESTION: "Try this...", "Here's how...", "Watch what happens when..."
- Only reference facts the user explicitly provided.
`.trim()

const NICHE_LOCK = `
NICHE LOCK - MANDATORY:
- EVERY day (hook, script, caption, visual) MUST reference the niche, product, or audience.
- The content must be USELESS to someone outside this niche.
- Test: would a stranger reading this know exactly what business this creator runs?
- If NO - rewrite until it passes.
`.trim()

const CTA_RULES = `
CTA RULES:
- Each day uses a DIFFERENT call-to-action phrasing.
- NEVER repeat exact CTA text on 3+ days.
- If goal is "sales", at least 4 of 7 days MUST end with a product-related CTA:
  * "Book a call to start your project"
  * "Get a free quote - link in bio"
  * "Message me to see samples"
  * "Visit my profile to book"
  AVOID ending with "Follow" or "Comment" alone on sales-focused days.
- NEVER say "DM us", "our team", "we offer", "we provide". This creator works ALONE.
- Use first-person singular: "I", "me", "my". Never "we" or "us".
- If goal is "followers", 3-5 days may ask to follow - no more than 5.
`.trim()

const BANNED_PHRASES = `
BANNED PHRASES - DO NOT USE:
- "my skin feels..." / "my skin looks..." + (less/more/smoother)
- "smoother skin" / "calmer skin" / "clearer skin" / "less red"
- "notice the change" / "see the difference" / "before and after"
- "after X days/weeks/months of using"
- "I've been using..." / "since I started..." / "Day X of using..."
- "after a week" / "after just one week" / "after 7 days"
- "free trial" / "free week" / "free checklist" / "limited spots" / "X% off"
- "DM us" / "our team" / "we offer"
`.trim()

function describeConstraints(constraints: string[]): string {
  if (!constraints || constraints.length === 0) {
    return 'No specific constraints.'
  }
  const map: Record<string, string> = {
    no_face:
      'NO FACE ON CAMERA. Never suggest: talking head, face-to-camera, direct eye contact. Use: hands, product close-ups, B-roll, text-on-screen.',
    no_voice:
      'NO VOICEOVER. Text-on-screen with music or ambient audio only.',
    phone_only:
      'PHONE CAMERA ONLY. Do NOT mention tripod, gimbal, ring light, DSLR, microphone, or professional equipment.',
    under_30s: 'Every video must be under 30 seconds.',
    no_editing: 'Minimal editing. Simple cuts and text overlays only.',
  }
  return constraints.map((c) => `- ${map[c] || c}`).join('\n')
}

const MAX_ATTEMPTS = 2 
const MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
]

type Attempt = {
  plan: Plan
  issues: string[]
}

// 🆕 เพิ่ม options เข้ามารับค่าเก่าและ Feedback
type GenerateOptions = {
  previousHooks?: string[]
  userFeedback?: string
}

export async function generatePlan(
  quiz: Quiz,
  options: GenerateOptions = {}
): Promise<Plan> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY missing')

  const ai = new GoogleGenAI({ apiKey })
  const attempts: Attempt[] = []

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = buildPrompt(
      quiz,
      attempt,
      attempts.length > 0 ? attempts[attempts.length - 1].issues : [],
      options // 🆕 ส่ง options ไปด้วย
    )

    let text: string | undefined

    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: attempt === 1 ? 0.8 : 0.6, 
          },
        })
        text = response.text
        if (text) break
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        const is503 = msg.includes('503')
        const is429 = msg.includes('429')
        
        if (is503 || is429) {
          console.warn(`[gen] Model ${model} busy (${is503 ? '503' : '429'}) - waiting 5s...`)
          await new Promise((r) => setTimeout(r, 5000))
          continue
        }
        console.warn(`[gen] Error on ${model}:`, msg.slice(0, 200))
      }
    }

    if (!text) {
      console.warn(`[gen] All models failed on attempt ${attempt}`)
      await new Promise((r) => setTimeout(r, 5000 * attempt))
      continue
    }

    let parsed: Plan
    try {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
      parsed = JSON.parse(cleaned) as Plan
    } catch {
      console.warn(`[gen] Invalid JSON on attempt ${attempt}`)
      continue
    }

    if (!parsed.days || parsed.days.length !== 7) {
      console.warn(`[gen] Wrong day count on attempt ${attempt}`)
      continue
    }

    const sanitized = sanitizePlan(parsed)
    const report = runQualityGate(sanitized, quiz)

    attempts.push({ plan: sanitized, issues: report.issues })

    if (report.passed) {
      console.log(`[gen] Quality gate passed on attempt ${attempt}`)
      sanitized.generated_at = new Date().toISOString()
      return sanitized
    }

    console.warn(
      `[gen] Quality gate failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
      report.issues
    )
  }

  if (attempts.length === 0) {
    throw new Error(
      'AI_SERVICE_UNAVAILABLE: Please try again in a moment. This is temporary.'
    )
  }

  const best = attempts.reduce((prev, curr) =>
    curr.issues.length < prev.issues.length ? curr : prev
  )

  console.warn(
    `[gen] All ${MAX_ATTEMPTS} attempts failed. Returning best effort with ${best.issues.length} issues:`,
    best.issues
  )

  best.plan.generated_at = new Date().toISOString()
  return best.plan
}

function buildPrompt(
  quiz: Quiz,
  attempt: number,
  previousIssues: string[],
  options: GenerateOptions
): string {
  const retryWarning =
    attempt > 1 && previousIssues.length > 0
      ? `
!! PREVIOUS ATTEMPT FAILED !!
Fix these exact issues:
${previousIssues.map((i) => `- ${i}`).join('\n')}
`
      : ''

  // 🆕 สร้าง Prompt สำหรับ Hook เก่า
  const historyWarning = options.previousHooks && options.previousHooks.length > 0
    ? `
!! CONTINUITY MODE - DO NOT REPEAT !!
The creator has purchased a plan before. Here are the hooks you already gave them:
${options.previousHooks.map((h) => `- "${h}"`).join('\n')}

You MUST create completely NEW hooks and angles. Do not rephrase or slightly tweak the old ones. Approach the topic from a totally different perspective.
`
    : ''

  // 🆕 สร้าง Prompt สำหรับ Feedback
  const feedbackWarning = options.userFeedback
    ? `
!! CREATOR FEEDBACK FROM LAST WEEK !!
The creator said this about the previous plan:
"${options.userFeedback}"

Adjust the style, length, tone, and angle of these new videos based on their feedback. If they said it was too long, make it shorter. If they said it was boring, make it punchier.
`
    : ''

  return `
Create a 7-day content plan for this SPECIFIC creator.

${retryWarning}
${historyWarning}
${feedbackWarning}

${FACT_SAFETY}
${NICHE_LOCK}
${CTA_RULES}
${BANNED_PHRASES}

CREATOR PROFILE:
- Platform: ${quiz.platform}
- Niche: ${quiz.niche}
- Product/Service: ${quiz.product}
- Target Audience: ${quiz.audience}
- Tone: ${quiz.tone}
- Goal: ${quiz.goal}
- Constraints:
${describeConstraints(quiz.constraints)}

STRUCTURE REQUIREMENTS:
- 7 days, each with unique angle - no repetition of hook openings
- If goal = "sales": follow: demo -> objection -> use case -> education -> framework -> offer
- If goal = "followers": intro -> value -> series -> interrupt -> journey -> participation -> BTS
- If goal = "engagement": question, poll, hot take, challenge, community, contrast, list

OUTPUT FORMAT - return ONLY valid JSON matching this exact shape:
{
  "title": "string",
  "summary": "string",
  "days": [
    {
      "day": 1,
      "type": "string (e.g., Hot take, Tutorial, Personal story)",
      "hook": "string",
      "script": "string",
      "caption": "string",
      "hashtags": ["string"],
      "visual": "string",
      "posting_time": "string",
      "posting_tip": "string (1 actionable tip on HOW to film or edit this specific video to maximize retention)",
      "sound_suggestion": "string (audio idea: e.g., 'Trending audio', 'Voiceover only', 'Lo-fi beat')",
      "text_overlay": "string (key 2-4 word phrase to put on screen to stop the scroll)"
    }
  ]
}

Return only the JSON object. No markdown, no explanation.
`.trim()
}