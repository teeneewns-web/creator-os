export type DayPlan = {
  day: number
  hook: string
  script: string
  caption: string
  hashtags: string[]
  visual: string
  posting_time: string
}

export type Plan = {
  title: string
  summary: string
  days: DayPlan[]
  generated_at: string
}