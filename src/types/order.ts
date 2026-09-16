import type { Plan } from './plan'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'generating'
  | 'ready'
  | 'failed'

export type Quiz = {
  platform: 'tiktok' | 'reels' | 'shorts'
  niche: string
  tone: 'energetic' | 'calm' | 'funny' | 'serious'
  goal: 'followers' | 'sales' | 'engagement'
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
