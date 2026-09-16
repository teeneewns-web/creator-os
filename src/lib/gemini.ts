import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'

const BRAND_VOICE = `
BRAND VOICE RULES:
- Direct. Short sentences. Max 20 words each.
- Specific numbers over vague adjectives.
- Playful but not cringe. No hype.
- Never use these words: unlock, unleash, supercharge, elevate, leverage, revolutionary, game-changing, journey, empower, seamless, robust.
- No emoji in hooks. No exclamation marks in CTAs.
- Talk to "you". Never "users" or "creators" in third person.
- Verbs over adjectives.
`.trim()

export async function generatePlan(quiz: Quiz): Promise<Plan> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY missing')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.6-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.9,
    },
  })

  const prompt = buildPrompt(quiz)
  const result = await model.generateContent(prompt)
  const text = result.response.text()

  let parsed: Plan
  try {
    parsed = JSON.parse(text) as Plan
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  if (!parsed.days || parsed.days.length !== 7) {
    throw new Error('AI returned invalid plan structure')
  }

  parsed.generated_at = new Date().toISOString()
  return parsed
}

function buildPrompt(quiz: Quiz): string {
  return `
You are a short-form content strategist. Create a 7-day content plan.

CREATOR PROFILE:
- Platform: ${quiz.platform}
- Niche: ${quiz.niche}
- Tone: ${quiz.tone}
- Primary goal: ${quiz.goal}

${BRAND_VOICE}

OUTPUT FORMAT (strict JSON):
{
  "title": "string - plan name, max 8 words",
  "summary": "string - one sentence describing the week, max 20 words",
  "days": [
    {
      "day": 1,
      "hook": "string - first 3 seconds, must stop the scroll",
      "script": "string - full 30-60 second script, word-for-word",
      "caption": "string - platform caption, max 15 words",
      "hashtags": ["array of 5-7 hashtags without the # symbol"],
      "visual": "string - B-roll or on-screen direction, 1 sentence",
      "posting_time": "string - e.g. '7-9 PM local'"
    }
  ]
}

RULES:
- All 7 days must have unique hooks and angles. No repetition.
- Hooks must be specific to ${quiz.niche}. No generic openers.
- Scripts must match ${quiz.tone} tone.
- Each day uses a different content format: tutorial, personal story, list, hot take, before/after, question, behind-the-scenes.
- Return valid JSON only. No markdown. No explanation. No code fences.
`.trim()
}