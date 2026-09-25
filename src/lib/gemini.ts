import Groq from 'groq-sdk'
import type { Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'
import { runQualityGate } from './quality-gate'

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
- If it could apply to any creator (pranks, cats, random comedy), it is WRONG.
- Test: would a stranger reading this know exactly what business this creator runs?
- If NO — rewrite until it passes.
`.trim()

const CTA_RULES = `
CTA RULES:
- Each day uses a DIFFERENT call-to-action phrasing.
- NEVER repeat exact CTA text on 3+ days.
- Vary CTAs: ask a question, soft ask, save/share, product mention, comment prompt.
- If goal is "sales", at least 4 of 7 days must include a soft product CTA (get, try, shop, link in bio, dm us, learn more, book).
- If goal is "followers", 3-5 days may ask to follow — no more than 5.
`.trim()

function describeConstraints(constraints: string[]): string {
  if (!constraints || constraints.length === 0) {
    return 'No specific constraints.'
  }
  const map: Record<string, string> = {
    no_face:
      'NO FACE ON CAMERA. Never suggest: talking head, face-to-camera, direct eye contact, on-camera appearance. Use: hands, product close-ups, B-roll, text-on-screen, screen recording, animation.',
    no_voice:
      'NO VOICEOVER. Text-on-screen with music or ambient audio only.',
    phone_only:
      'PHONE CAMERA ONLY. Do NOT mention tripod, gimbal, ring light, DSLR, microphone, or professional equipment. If stability is needed, say "prop phone on a book" or "hold phone steady".',
    under_30s: 'Every video must be under 30 seconds.',
    no_editing: 'Minimal editing. Simple cuts and text overlays only.',
  }
  return constraints.map((c) => `- ${map[c] || c}`).join('\n')
}

const MAX_ATTEMPTS = 3

export async function generatePlan(quiz: Quiz): Promise<Plan> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY missing')

  const groq = new Groq({ apiKey })
  let lastIssues: string[] = []

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const prompt = buildPrompt(quiz, attempt, lastIssues)

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content:
            'You are a short-form content strategist specialized in converting business goals into niche-specific content plans. You always respond with valid JSON only. No markdown, no explanation, no code fences.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: attempt === 1 ? 0.85 : 0.6,
      max_tokens: 8000,
    })

    const text = completion.choices[0]?.message?.content
    if (!text) {
      lastIssues = ['AI returned empty response']
      continue
    }

    let parsed: Plan
    try {
      parsed = JSON.parse(text) as Plan
    } catch {
      lastIssues = ['AI returned invalid JSON']
      continue
    }

    if (!parsed.days || parsed.days.length !== 7) {
      lastIssues = [`AI returned ${parsed.days?.length ?? 0} days instead of 7`]
      continue
    }

    const report = runQualityGate(parsed, quiz)

    if (report.passed) {
      console.log(`Quality gate passed on attempt ${attempt}`)
      parsed.generated_at = new Date().toISOString()
      return parsed
    }

    console.warn(
      `Quality gate failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
      report.issues
    )
    lastIssues = report.issues
  }

  throw new Error(
    `PLAN_QUALITY_FAILED after ${MAX_ATTEMPTS} attempts: ${lastIssues
      .slice(0, 3)
      .join('; ')}`
  )
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

Specific problems to fix:
${previousIssues.map((i) => `- ${i}`).join('\n')}

You MUST fix these exact issues. Do not repeat them.
`
      : ''

  return `
You are creating a 7-day content plan for a SPECIFIC creator.

═══ CREATOR PROFILE ═══
Niche: ${quiz.niche}
What they sell: ${quiz.product}
Target audience: ${quiz.audience}
Platform: ${quiz.platform}
Tone: ${quiz.tone}
Goal: ${quiz.goal}

Production constraints:
${describeConstraints(quiz.constraints)}

═══ ${NICHE_LOCK} ═══

═══ ${FACT_SAFETY} ═══

═══ ${CTA_RULES} ═══

${retryWarning}

═══ CONTENT JOURNEY BY GOAL ═══

If goal = "sales", structure the week like this:
- Day 1: Pain point / problem the audience faces
- Day 2: Product demonstration / how it works
- Day 3: Common objection or FAQ
- Day 4: Use case / real-world scenario
- Day 5: Educational value tied to the product
- Day 6: Framework, tip, or "how to start"
- Day 7: Soft offer / invitation to try

If goal = "followers":
- Day 1: Introduce the format / what viewers will get
- Day 2: High-value or entertaining post
- Day 3: Repeatable series idea
- Day 4: Pattern interruption / unexpected angle
- Day 5: Transformation, experiment, or journey
- Day 6: Audience participation / question
- Day 7: Behind-the-scenes or community moment

If goal = "engagement":
- Mix: question, poll, hot take, challenge, community ask, contrast, list

═══ OUTPUT FORMAT (strict JSON) ═══
{
  "title": "string — plan name, max 8 words",
  "summary": "string — one sentence, max 20 words",
  "days": [
    {
      "day": 1,
      "hook": "string — first 3 seconds, niche-specific",
      "script": "string — full 30-60 second script, word-for-word",
      "caption": "string — platform caption, max 15 words",
      "hashtags": ["5-7 tags WITHOUT # symbol, no spaces inside tag"],
      "visual": "string — B-roll or on-screen direction, respects constraints",
      "posting_time": "string — e.g. '7-9 PM local'"
    }
  ]
}

═══ FINAL RULES ═══
- Each day must be UNIQUE in hook, angle, and format.
- Every day must connect to the niche, product, or audience.
- Hashtags: 5-7 tags, each tag must be one word or hyphenated, no # symbol.
- Visual direction must respect all constraints.
- Follow the content journey for the goal above.
- Return valid JSON only. No markdown.
`.trim()
}