import type { Plan } from './plan'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'generating'
  | 'ready'
  | 'failed'

export type Platform = 'tiktok' | 'reels' | 'shorts'
export type Tone = 'energetic' | 'calm' | 'funny' | 'serious'
export type Goal = 'followers' | 'sales' | 'engagement'
export type Constraint =
  | 'no_face'
  | 'no_voice'
  | 'phone_only'
  | 'under_30s'
  | 'no_editing'

export type Quiz = {
  platform: Platform
  niche: string
  product: string
  audience: string
  tone: Tone
  goal: Goal
  constraints: Constraint[]
  email: string
}

export type Order = {
  id: string
  email: string
  quiz: Quiz
  plan: Plan | null
  status: OrderStatus
  payment_method: string | null
  amount_usd: number
  amount_thb: number
  lemon_order_id: string | null
  lemon_customer_id: string | null
  payment_proof_url: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}