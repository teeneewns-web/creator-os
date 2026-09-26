import type { Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'

export type QualityReport = {
  passed: boolean
  issues: string[]
}

const FABRICATION_PATTERNS: RegExp[] = [
  /\bI once\b/i,
  /\bI tried\b/i,
  /\bI filmed\b/i,
  /\bI shot\b/i,
  /\bI remember\b/i,
  /\bmy roommate\b/i,
  /\bmy client\b/i,
  /\bmy customer\b/i,
  /\bone of my clients\b/i,
  /\bmy friend\b/i,
  /\blast week I\b/i,
  /\byesterday I\b/i,
  /\bwhen I was\b/i,
]

const STAT_PATTERNS: RegExp[] = [
  /\b\d+%/,
  /\b\d+ (customers|clients|followers|people|moms|kg|lbs|pounds|users|subscribers)\b/i,
]

const NAMED_PERSON_PATTERN =
  /\b(Sarah|John|Emily|Mike|Jessica|David|Amanda|Chris|Rachel|Tom|Alex|Emma)\b/

const OFFER_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bfree (trial|week|access|month|session)\b/i, label: 'free offer' },
  { pattern: /\b(limited|only) \d+ spots?\b/i, label: 'limited spots claim' },
  { pattern: /\bspots? (are )?limited\b/i, label: 'limited spots claim' },
  { pattern: /\b\d+% off\b/i, label: 'discount claim' },
  { pattern: /\b(money[- ]?back|refund) guarantee\b/i, label: 'money-back guarantee' },
  { pattern: /\b(we|our team) (offer|provide|deliver)\b/i, label: 'team claim' },
  { pattern: /\bDM us\b/i, label: '"DM us" — implies team' },
  { pattern: /\bwe'?re offering\b/i, label: 'offer claim' },
  { pattern: /\bclaim (yours|your)\b/i, label: 'claim offer' },
  { pattern: /\bbook (a |your )?(call|session|spot)\b/i, label: 'booking offer' },
]

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'for', 'with', 'from', 'that', 'this',
  'your', 'you', 'their', 'them', 'they', 'will', 'can', 'are', 'was',
  'who', 'what', 'when', 'where', 'how', 'want', 'like', 'into', 'over',
  'about', 'make', 'made', 'get', 'got', 'use', 'used', 'have', 'has',
  'not', 'but', 'all', 'some', 'any', 'more', 'most', 'other', 'than',
  'then', 'than', 'our', 'out', 'off', 'only', 'just', 'also', 'been',
])

function extractKeywords(text: string, minLen = 4): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= minLen && !STOP_WORDS.has(w))
}

function checkFabrication(plan: Plan, quiz: Quiz): string[] {
  const issues: string[] = []
  const source = `${quiz.niche} ${quiz.product} ${quiz.audience}`.toLowerCase()

  for (const day of plan.days) {
    const text = `${day.hook} ${day.script} ${day.caption}`

    for (const pat of FABRICATION_PATTERNS) {
      const match = text.match(pat)
      if (match) {
        const key = match[0].toLowerCase().replace(/[^a-z]/g, '')
        const inSource = source.replace(/[^a-z]/g, '').includes(key.slice(0, 4))
        if (!inSource) {
          issues.push(
            `Day ${day.day}: fabricated personal story — "${match[0]}"`
          )
        }
      }
    }

    for (const pat of STAT_PATTERNS) {
      const match = text.match(pat)
      if (match) {
        const inSource = source.includes(match[0].toLowerCase())
        if (!inSource) {
          issues.push(
            `Day ${day.day}: fabricated statistic — "${match[0]}"`
          )
        }
      }
    }

    const named = text.match(NAMED_PERSON_PATTERN)
    if (named) {
      issues.push(`Day ${day.day}: fabricated person name — "${named[0]}"`)
    }
  }

  return issues
}

function checkNicheRelevance(plan: Plan, quiz: Quiz): string[] {
  const issues: string[] = []
  const nicheKeys = extractKeywords(quiz.niche, 4)
  const productKeys = extractKeywords(quiz.product, 4)
  const audienceKeys = extractKeywords(quiz.audience, 4)
  const allKeys = [...new Set([...nicheKeys, ...productKeys, ...audienceKeys])]

  if (allKeys.length === 0) return issues

  for (const day of plan.days) {
    const text = `${day.hook} ${day.script} ${day.caption} ${day.visual}`.toLowerCase()
    const hits = allKeys.filter((k) => text.includes(k))

    if (hits.length === 0) {
      issues.push(
        `Day ${day.day}: content does not reference niche, product, or audience (keywords: ${allKeys.slice(0, 4).join(', ')})`
      )
    }
  }

  return issues
}

function checkConstraints(plan: Plan, quiz: Quiz): string[] {
  const issues: string[] = []
  const constraints = quiz.constraints || []

  if (constraints.includes('no_face')) {
    const facePhrases = [
      'talking head',
      'face to camera',
      'face on camera',
      'direct eye contact',
      'on-camera',
      'on camera',
      'looking at the camera',
      'speaking to camera',
      'talking to camera',
    ]
    for (const day of plan.days) {
      const text = `${day.visual} ${day.script}`.toLowerCase()
      for (const phrase of facePhrases) {
        if (text.includes(phrase)) {
          issues.push(
            `Day ${day.day}: violates no_face constraint — "${phrase}"`
          )
        }
      }
    }
  }

  if (constraints.includes('no_voice')) {
    for (const day of plan.days) {
      const visual = day.visual.toLowerCase()
      if (
        visual.includes('voiceover') &&
        !visual.includes('no voiceover') &&
        !visual.includes('without voiceover') &&
        !visual.includes('text only')
      ) {
        issues.push(
          `Day ${day.day}: violates no_voice constraint — voiceover required`
        )
      }
    }
  }

  if (constraints.includes('phone_only')) {
    const equipment = [
      'tripod',
      'gimbal',
      'ring light',
      'dslr',
      'mirrorless',
      'professional camera',
      'external microphone',
      'lighting rig',
      'green screen',
    ]
    for (const day of plan.days) {
      const text = `${day.visual} ${day.script}`.toLowerCase()
      for (const eq of equipment) {
        if (text.includes(eq)) {
          issues.push(
            `Day ${day.day}: violates phone_only — mentions "${eq}"`
          )
        }
      }
    }
  }

  return issues
}

function checkGoalAlignment(plan: Plan, quiz: Quiz): string[] {
  const issues: string[] = []

  if (quiz.goal === 'sales') {
    const productWords = extractKeywords(quiz.product, 5)
    let salesDays = 0
    for (const day of plan.days) {
      const text = `${day.caption} ${day.script}`.toLowerCase()
      const mentionsProduct = productWords.some((w) => text.includes(w))
      const hasSalesCta =
        /\b(get|try|shop|buy|order|download|sign up|learn more|check out|link in bio|dm us|dm me|click|book|claim|grab|start)\b/i.test(
          day.script
        )
      if (mentionsProduct || hasSalesCta) salesDays++
    }
    if (salesDays < 4) {
      issues.push(
        `Goal is "sales" but only ${salesDays}/7 days include a product CTA (min 4)`
      )
    }
  }

  if (quiz.goal === 'followers') {
    let followDays = 0
    for (const day of plan.days) {
      if (/\b(follow|tap follow|hit follow)\b/i.test(day.script)) followDays++
    }
    if (followDays < 3) {
      issues.push(
        `Goal is "followers" but only ${followDays}/7 days ask to follow (min 3)`
      )
    }
    if (followDays > 5) {
      issues.push(
        `Goal is "followers" but ${followDays}/7 days ask to follow — too repetitive (max 5)`
      )
    }
  }

  return issues
}

function checkRepetition(plan: Plan): string[] {
  const issues: string[] = []

  const hookStarts = new Map<string, number[]>()
  for (const day of plan.days) {
    const key = day.hook.toLowerCase().split(/\s+/).slice(0, 4).join(' ')
    const existing = hookStarts.get(key) || []
    existing.push(day.day)
    hookStarts.set(key, existing)
  }
  for (const [key, days] of hookStarts.entries()) {
    if (days.length > 1) {
      issues.push(
        `Days ${days.join(', ')} have similar hooks starting with "${key}"`
      )
    }
  }

  const followPattern =
    /\b(follow me|follow for|follow to|follow if|follow and|tap follow|hit follow)\b/gi
  const followCount = plan.days.filter((d) => followPattern.test(d.script))
    .length
  if (followCount >= 6) {
    issues.push(
      `"Follow" CTA repeated in ${followCount}/7 days — too repetitive`
    )
  }

  return issues
}

function checkHashtagDiversity(plan: Plan): string[] {
  const issues: string[] = []
  const allTags = new Set<string>()

  for (const day of plan.days) {
    for (const tag of day.hashtags) {
      allTags.add(tag.toLowerCase())
    }
  }

  if (allTags.size < 10) {
    issues.push(
      `Only ${allTags.size} unique hashtags across 7 days — needs at least 10 for variety`
    )
  }

  return issues
}

function checkPostingTimeDiversity(plan: Plan): string[] {
  const issues: string[] = []
  const times = new Set(
    plan.days.map((d) => d.posting_time.toLowerCase().trim())
  )

  if (times.size < 2) {
    issues.push(
      `All 7 days use the same posting time — vary at least 2 time slots`
    )
  }

  return issues
}

function checkOfferSafety(plan: Plan, quiz: Quiz): string[] {
  const issues: string[] = []
  const source = `${quiz.niche} ${quiz.product} ${quiz.audience}`.toLowerCase()

  for (const day of plan.days) {
    const text = `${day.hook} ${day.script} ${day.caption} ${day.visual}`
    for (const { pattern, label } of OFFER_PATTERNS) {
      const match = text.match(pattern)
      if (match) {
        const matchText = match[0].toLowerCase()
        // ถ้าคำนี้ปรากฏใน quiz ที่ user ให้มา → ไม่ผิด
        if (!source.includes(matchText)) {
          issues.push(
            `Day ${day.day}: fabricated ${label} — "${match[0]}"`
          )
        }
      }
    }
  }

  return issues
}

function checkFormat(plan: Plan): string[] {
  const issues: string[] = []

  if (!Array.isArray(plan.days) || plan.days.length !== 7) {
    issues.push(`Expected 7 days, got ${plan.days?.length ?? 0}`)
    return issues
  }

  for (const day of plan.days) {
    if (!day.hook?.trim()) issues.push(`Day ${day.day}: missing hook`)
    if (!day.script?.trim()) issues.push(`Day ${day.day}: missing script`)
    if (!day.caption?.trim()) issues.push(`Day ${day.day}: missing caption`)
    if (!day.visual?.trim()) issues.push(`Day ${day.day}: missing visual`)
    if (!day.posting_time?.trim())
      issues.push(`Day ${day.day}: missing posting_time`)

    if (!Array.isArray(day.hashtags) || day.hashtags.length < 5) {
      issues.push(`Day ${day.day}: needs 5+ hashtags`)
    } else {
      for (const tag of day.hashtags) {
        if (tag.includes('#') || tag.includes(' ') || !tag.trim()) {
          issues.push(`Day ${day.day}: invalid hashtag format — "${tag}"`)
        }
      }
    }
  }

  return issues
}

export function runQualityGate(plan: Plan, quiz: Quiz): QualityReport {
  const issues: string[] = [
    ...checkFabrication(plan, quiz),
    ...checkNicheRelevance(plan, quiz),
    ...checkConstraints(plan, quiz),
    ...checkGoalAlignment(plan, quiz),
    ...checkOfferSafety(plan, quiz),
    ...checkHashtagDiversity(plan),
    ...checkPostingTimeDiversity(plan),
    ...checkRepetition(plan),
    ...checkFormat(plan),
  ]

  return {
    passed: issues.length === 0,
    issues,
  }
}