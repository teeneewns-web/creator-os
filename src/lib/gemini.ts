import { GoogleGenAI } from '@google/genai'
import type { Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'
import { runQualityGate } from './quality-gate'
import { sanitizePlan } from './sanitize'

const FACT_SAFETY = `
FACT SAFETY — HIGHEST PRIORITY:
- NEVER invent personal stories, experiences, or events.
- NEVER say "I once...", "I tried...", "My client...", "My friend...", "Last week I..."
- NEVER invent testimonials, customer names, or case studies.
- NEVER use statistics or numbers the user did not provide.
- If a hook needs a story, use a SUGGESTION: "Try this...", "Here's how...", "Watch what happens when..."
- Only reference facts the user explicitly provided.
`.trim()

const NICHE_LOCK = `
NICHE LOCK — MANDATORY:
- EVERY day (hook, script, caption, visual) MUST reference the niche, product, or audience.
- The content must be USELESS to someone outside this niche.
- Test: would a stranger reading this know exactly what business this creator runs?
- If NO — rewrite until it passes.
`.trim()

const CTA_RULES = `
CTA RULES:
- Each day uses a DIFFERENT call-to-action phrasing.
- NEVER repeat exact CTA text on 3+ days.
- If goal is "sales", at least 4 of 7 days MUST end with a product-related CTA:
  * "Book a call to start your project"
  * "Get a free quote — link in bio"
  * "Message me to see samples"
  * "Visit my profile to book"
  AVOID ending with "Follow" or "Comment" alone on sales-focused days.
- NEVER say "DM us", "our team", "we offer", "we provide". This creator works ALONE.
- Use first-person singular: "I", "me", "my". Never "we" or "us".
- If goal is "followers", 3-5 days may ask to follow — no more than 5.
`.trim()

const BANNED_PHRASES = `
BANNED PHRASES — DO NOT USE:

Personal result claims:
- "my skin feels..." / "my skin looks..." + (less/more/smoother)
- "smoother skin" / "calmer skin" / "clearer skin" / "less red"
- "notice the change" / "see the difference"
- "before and after"
- "after X days/weeks/months of using"
- "I've been using..." / "since I started..."
- "Day X of using..."

Timeline claims:
- "after a week" / "after just one week" / "after 7 days"

Fake offers:
- "free trial" / "free week" / "free checklist" / "limited spots" / "X% off"

Fake team:
- "DM us" / "our team" / "we offer"

INSTEAD, use these patterns:
- "Try this routine and see how it feels"
- "Here's how the product works"
- "Watch the texture"
- "The formula is designed to..."
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

const MAX_ATTEMPTS = 4

type Attempt = {
  plan: Plan
  issues: string[]
}

export async function generatePlan(quiz: Quiz): Promise<Plan> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY missing')

  const ai = new GoogleGenAI({ apiKey })
  const attempts: Attempt[] = []

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = buildPrompt(
      quiz,
      attempt,
      attempts.length > 0 ? attempts[attempts.length - 1].issues : []
    )

    let text: string | undefined
    // Fallback models — ลองทีละตัวถ้าตัวแรกเจอ 503
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash']

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: attempt === 1 ? 0.85 : 0.6,
          },
        })
        text = response.text
        if (text) break
      } catch (err) {
        const is503 =
          err instanceof Error && err.message.includes('503')
        if (is503) {
          console.warn(`Model ${model} unavailable (503), trying next...`)
          await new Promise((r) => setTimeout(r, 2000))
          continue
        }
        console.warn(`Gemini error on attempt ${attempt} with ${model}:`, err)
      }
    }

    if (!text) {
      console.warn(`All models failed on attempt ${attempt}`)
      await new Promise((r) => setTimeout(r, 3000))
      continue
    }

    if (!text) {
      console.warn(`Empty response on attempt ${attempt}`)
      continue
    }

    let parsed: Plan
    try {
      parsed = JSON.parse(text) as Plan
    } catch {
      console.warn(`Invalid JSON on attempt ${attempt}`)
      continue
    }

    if (!parsed.days || parsed.days.length !== 7) {
      console.warn(`Wrong day count on attempt ${attempt}`)
      continue
    }

    const sanitized = sanitizePlan(parsed)
    const report = runQualityGate(sanitized, quiz)

    attempts.push({ plan: sanitized, issues: report.issues })

    if (report.passed) {
      console.log(`Quality gate passed on attempt ${attempt}`)
      sanitized.generated_at = new Date().toISOString()
      return sanitized
    }

    console.warn(
      `Quality gate failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
      report.issues
    )
  }

  // ============================================================
  // BEST EFFORT FALLBACK
  // ถ้าทุก attempt fail → คืน attempt ที่มี issues น้อยสุด
  // ลูกค้าได้ของเสมอ (sanitized แล้ว)
  // ============================================================
  if (attempts.length === 0) {
    // ถ้า AI ทุกตัวล่ม — throw เพื่อให้ลูกค้าเห็น error
    // แต่ส่งข้อความที่เข้าใจได้
    throw new Error(
      'AI_SERVICE_UNAVAILABLE: Please try again in a moment. This is temporary.'
    )
  }

  const best = attempts.reduce((prev, curr) =>
    curr.issues.length < prev.issues.length ? curr : prev
  )

  console.warn(
    `All ${MAX_ATTEMPTS} attempts failed. Returning best effort with ${best.issues.length} issues:`,
    best.issues
  )

  best.plan.generated_at = new Date().toISOString()
  return best.plan
}

function buildPrompt(
  quiz: Quiz,
  attempt: number,
  previousIssues: string[]
): string {
  const retryWarning =
    attempt > 1 && previousIssues.length > 0
      ? `
⚠ PREVIOUS ATTEMPT FAILED ⚠
Fix these exact issues:
${previousIssues.map((i) => `- ${i}`).join('\n')}
`
      : ''

  return `
Create a 7-day content plan for this SPECIFIC creator.

═══ CREATOR PROFILE ═══
Niche: ${quiz.niche}
What they sell: ${quiz.product}
Target audience: ${quiz.audience}
Platform: ${quiz.platform}
Tone: ${quiz.tone}
Goal: ${quiz.goal}

Constraints:
${describeConstraints(quiz.constraints)}

═══ ${NICHE_LOCK} ═══

═══ ${FACT_SAFETY} ═══

═══ ${BANNED_PHRASES} ═══

═══ ${CTA_RULES} ═══

${retryWarning}

═══ CONTENT JOURNEY BY GOAL ═══
If goal = "sales": pain → demo → objection → use case → education → framework → offer
If goal = "followers": intro → value → series → interrupt → journey → participation → BTS
If goal = "engagement": question, poll, hot take, challenge, community, contrast, list

═══ OUTPUT FORMAT (strict JSON) ═══
{
  "title": "string, max 8 words",
  "summary": "string, max 20 words",
  "days": [
    {
      "day": 1,
      "hook": "string, first 3 seconds, niche-specific",
      "script": "string, 30-60 second script",
      "caption": "string, max 15 words",
      "hashtags": ["5-7 tags WITHOUT # symbol"],
      "visual": "string, respects constraints",
      "posting_time": "string, e.g. '7-9 PM local'"
    }
  ]
}

Return valid JSON only. No markdown.
`.trim()
}