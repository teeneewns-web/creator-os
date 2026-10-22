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
    no_face: 'NO FACE ON CAMERA. Never suggest: talking head, face-to-camera, direct eye contact. Use: hands, product close-ups, B-roll, text-on-screen.',
    no_voice: 'NO VOICEOVER. Text-on-screen with music or ambient audio only.',
    phone_only: 'PHONE CAMERA ONLY. Do NOT mention tripod, gimbal, ring light, DSLR, microphone, or professional equipment.',
    under_30s: 'Every video must be under 30 seconds.',
    no_editing: 'Minimal editing. Simple cuts and text overlays only.',
  }
  return constraints.map((c) => `- ${map[c] || c}`).join('\n')
}

// ─── ตั้งค่า Fallback ───
const MAX_ATTEMPTS = 2 
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'] // เปลี่ยนเป็นโมเดลที่เสถียร
const GROQ_MODEL = 'llama-3.3-70b-versatile'

type Attempt = { plan: Plan; issues: string[] }
type GenerateOptions = { previousHooks?: string[]; userFeedback?: string }

// ─── ฟังก์ชันเรียก Groq (Fallback) ───
async function callGroq(prompt: string, attempt: number): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    console.warn('[groq] GROQ_API_KEY missing')
    return null
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You output only valid JSON. No markdown fences, no commentary.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: attempt === 1 ? 0.8 : 0.6,
      }),
    })

    if (!res.ok) {
      console.warn(`[groq] Error ${res.status}`)
      return null
    }
    const data = await res.json()
    return data?.choices?.[0]?.message?.content || null
  } catch (err) {
    console.warn('[groq] Fetch failed', err)
    return null
  }
}

// ─── ฟังก์ชันเรียก Gemini ───
async function callGemini(ai: GoogleGenAI, prompt: string, attempt: number): Promise<string | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: attempt === 1 ? 0.8 : 0.6 },
      })
      if (response.text) return response.text
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[gemini] ${model} failed (${msg.slice(0, 50)}...)`)
      // ไม่ต้องรอนาน ให้สลับไป Groq เลย
    }
  }
  return null
}

export async function generatePlan(
  quiz: Quiz,
  options: GenerateOptions = {}
): Promise<Plan> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) throw new Error('GEMINI_API_KEY missing')

  const ai = new GoogleGenAI({ apiKey: geminiKey })
  const attempts: Attempt[] = []

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = buildPrompt(
      quiz,
      attempt,
      attempts.length > 0 ? attempts[attempts.length - 1].issues : [],
      options
    )

    // 1. ลอง Gemini ก่อน
    let text = await callGemini(ai, prompt, attempt)
    let provider = 'gemini'

    // 2. ถ้า Gemini ล่ม ให้สลับไป Groq ทันที
    if (!text) {
      console.warn(`[gen] Gemini failed. Switching to Groq...`)
      text = await callGroq(prompt, attempt)
      provider = 'groq'
    }

    if (!text) {
      console.warn(`[gen] All providers failed on attempt ${attempt}`)
      continue
    }

    console.log(`[gen] Attempt ${attempt} success via ${provider}`)

    let parsed: Plan
    try {
      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
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
    console.warn(`[gen] Quality gate failed (attempt ${attempt}):`, report.issues)
  }

  if (attempts.length === 0) {
    throw new Error('AI_SERVICE_UNAVAILABLE: Please try again in a moment. This is temporary.')
  }

  const best = attempts.reduce((prev, curr) => curr.issues.length < prev.issues.length ? curr : prev)
  console.warn(`[gen] Returning best effort with ${best.issues.length} issues`)
  best.plan.generated_at = new Date().toISOString()
  return best.plan
}

function buildPrompt(quiz: Quiz, attempt: number, previousIssues: string[], options: GenerateOptions): string {
  const retryWarning = attempt > 1 && previousIssues.length > 0
    ? `\n!! PREVIOUS ATTEMPT FAILED !!\nFix these exact issues:\n${previousIssues.map((i) => `- ${i}`).join('\n')}\n` : ''

  const historyWarning = options.previousHooks && options.previousHooks.length > 0
    ? `\n!! CONTINUITY MODE - DO NOT REPEAT !!\nThe creator purchased a plan before. Here are the hooks you already gave them:\n${options.previousHooks.map((h) => `- "${h}"`).join('\n')}\nYou MUST create completely NEW hooks and angles. Do not rephrase or slightly tweak the old ones.\n` : ''

  const feedbackWarning = options.userFeedback
    ? `\n!! CREATOR FEEDBACK FROM LAST WEEK !!\nThe creator said this about the previous plan:\n"${options.userFeedback}"\nAdjust the style, length, tone, and angle of these new videos based on their feedback.\n` : ''

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
- 7 days, each with unique angle
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
      "type": "string",
      "hook": "string",
      "script": "string",
      "caption": "string",
      "hashtags": ["string"],
      "visual": "string",
      "posting_time": "string",
      "posting_tip": "string",
      "sound_suggestion": "string",
      "text_overlay": "string"
    }
  ]
}

Return only the JSON object. No markdown, no explanation.
`.trim()
}