import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/orders'
import type { Quiz } from '@/types/order'

function isValidQuiz(value: unknown): value is Quiz {
  if (!value || typeof value !== 'object') return false
  const q = value as Partial<Quiz>
  return Boolean(
    q.platform &&
    ['tiktok', 'reels', 'shorts'].includes(q.platform) &&
    typeof q.niche === 'string' &&
    q.niche.trim().length > 0 &&
    typeof q.product === 'string' &&
    q.product.trim().length > 0 &&
    typeof q.audience === 'string' &&
    q.audience.trim().length > 0 &&
    q.tone &&
    ['energetic', 'calm', 'funny', 'serious'].includes(q.tone) &&
    q.goal &&
    ['followers', 'sales', 'engagement'].includes(q.goal) &&
    Array.isArray(q.constraints) &&
    typeof q.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q.email)
  )
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!isValidQuiz(body)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid quiz data' },
        { status: 400 }
      )
    }

    const order = await createOrder(body)
    return NextResponse.json({ ok: true, orderId: order.id })
  } catch (error) {
    console.error('Create order failed', error)
    return NextResponse.json(
      { ok: false, message: 'Failed to create order' },
      { status: 500 }
    )
  }
}