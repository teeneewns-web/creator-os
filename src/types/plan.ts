export type DayPlan = {
  day: number
  type: string
  hook: string
  script: string
  caption: string
  hashtags: string[]
  visual: string
  posting_time: string
  posting_tip?: string       // 🆕 คำแนะนำการโพสต์
  sound_suggestion?: string  // 🆕 แนะนำเสียง/เพลง
  text_overlay?: string      // 🆕 แนะนำข้อความบนจอ
}

export type Plan = {
  title: string
  summary: string
  days: DayPlan[]
  generated_at: string
}