import type { Plan } from '@/types/plan'

// ============================================================
// Sanitizer — แทน pattern ที่ผิดอัตโนมัติ ก่อน Quality Gate
// เป็น safety net ที่ deterministic (ไม่ใช่ AI)
// ============================================================

const REPLACEMENTS: { pattern: RegExp; replace: string | ((m: string) => string) }[] = [
  // Personal results about creator's own body
  {
    pattern: /\bmy (skin|hair|body|face|nails)\s+(feels?|looks?|is)\s+(less|more|smoother|clearer|brighter|softer|calmer|healthier)\b/gi,
    replace: 'the formula is designed to help with',
  },
  // "after X days/weeks of using"
  {
    pattern: /\bafter\s+(just\s+)?(a|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(day|week|month)s?\s+(of|using|with|in)\b/gi,
    replace: 'with regular use',
  },
  // "after a week" / "after 7 days"
  {
    pattern: /\bafter\s+(just\s+)?(a|an|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(day|week|month)s?\b/gi,
    replace: 'with regular use',
  },
  // "for X days/weeks"
  {
    pattern: /\bfor\s+(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(day|week|month)s?\b/gi,
    replace: 'over time',
  },
  // "before and after"
  {
    pattern: /\bbefore\s+and\s+after\b/gi,
    replace: 'side by side',
  },
  // "see/notice the change/difference/improvement"
  {
    pattern: /\b(notice|see|look at|check out)\s+the\s+(subtle\s+)?(change|difference|improvement|result|progress)\b/gi,
    replace: 'watch how it works',
  },
  // "I've been using..."
  {
    pattern: /\bi'?ve been (using|doing|trying)\b/gi,
    replace: 'the routine uses',
  },
  // "since I started"
  {
    pattern: /\bsince\s+(i|using|starting)\b/gi,
    replace: 'when you use it',
  },
  // "day X of using"
  {
    pattern: /\bday\s+\d+\s+of\s+(using|doing|trying)\b/gi,
    replace: 'a daily routine with',
  },
  // Fake offers
  { pattern: /\bfree\s+(trial|week|month|access)\b/gi, replace: 'starter' },
  { pattern: /\blimited\s+spots?\b/gi, replace: 'available now' },
  { pattern: /\bspots?\s+(are\s+)?limited\b/gi, replace: 'available now' },
  { pattern: /\bclaim\s+(yours|your)\b/gi, replace: 'get started with' },
  { pattern: /\bmoney[- ]?back\s+guarantee\b/gi, replace: 'simple returns' },
  // Fake team
  { pattern: /\bdm\s+us\b/gi, replace: 'message me' },
  { pattern: /\bour\s+team\b/gi, replace: 'me' },
  { pattern: /\bwe\s+(offer|provide|deliver)\b/gi, replace: 'I offer' },
  { pattern: /\bwe'?re\s+offering\b/gi, replace: "I'm offering" },
  // Extra spaces cleanup
  { pattern: /\s+/g, replace: ' ' },
]

const CLEANUP_PATTERNS: { pattern: RegExp; replace: string }[] = [
  // Fix "a a" duplication
  { pattern: /\ba\s+a\b/g, replace: 'a' },
  { pattern: /\bthe\s+the\b/g, replace: 'the' },
  { pattern: /\s+\./g, replace: '.' },
  { pattern: /\s+,/g, replace: ',' },
  { pattern: /\s+!/g, replace: '!' },
  { pattern: /\s+\?/g, replace: '?' },
]

function sanitizeText(input: string): string {
  let text = input
  for (const { pattern, replace } of REPLACEMENTS) {
    text = text.replace(pattern, replace as string)
  }
  for (const { pattern, replace } of CLEANUP_PATTERNS) {
    text = text.replace(pattern, replace)
  }
  // Capitalize first letter of each sentence
  text = text.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_, p1, p2) => p1 + p2.toUpperCase()
  )
  return text.trim()
}

export function sanitizePlan(plan: Plan): Plan {
  return {
    ...plan,
    title: sanitizeText(plan.title),
    summary: sanitizeText(plan.summary),
    days: plan.days.map((day) => ({
      ...day,
      hook: sanitizeText(day.hook),
      script: sanitizeText(day.script),
      caption: sanitizeText(day.caption),
      visual: sanitizeText(day.visual),
      hashtags: day.hashtags.map((tag) =>
        tag.replace(/^#+/, '').replace(/\s+/g, '').trim()
      ),
    })),
  }
}