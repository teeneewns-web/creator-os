import type { Order, Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
})

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'COS-'
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

const ORDER_KEY = (id: string) => `creator-os:order:${id}`
const ORDER_INDEX = 'creator-os:orders'

export async function createOrder(quiz: Quiz): Promise<Order> {
  const id = generateOrderId()
  const now = new Date().toISOString()

  const order: Order = {
    id,
    email: quiz.email,
    quiz,
    plan: null,
    status: 'pending',
    payment_method: null,
    amount_usd: 19,
    amount_thb: 690,
    lemon_order_id: null,
    lemon_customer_id: null,
    payment_proof_url: null,
    error_message: null,
    created_at: now,
    updated_at: now,
  }

  await redis.set(ORDER_KEY(id), JSON.stringify(order))
  await redis.lpush(ORDER_INDEX, id)
  await redis.ltrim(ORDER_INDEX, 0, 499)

  return order
}

export async function getOrder(id: string): Promise<Order | null> {
  const raw = await redis.get(ORDER_KEY(id))
  if (!raw) return null
  return JSON.parse(raw) as Order
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const existing = await getOrder(id)
  if (!existing) return null

  const updated = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString(),
  }

  await redis.set(ORDER_KEY(id), JSON.stringify(updated))
  return updated
}

export async function markPaid(
  id: string,
  method: string,
  lemonOrderId?: string
): Promise<Order | null> {
  return updateOrder(id, {
    status: 'paid',
    payment_method: method,
    lemon_order_id: lemonOrderId ?? null,
  })
}

export async function savePlan(
  id: string,
  plan: Plan
): Promise<Order | null> {
  return updateOrder(id, { status: 'ready', plan })
}

export async function markGenerating(id: string): Promise<Order | null> {
  return updateOrder(id, { status: 'generating' })
}

export async function markFailed(
  id: string,
  message: string
): Promise<Order | null> {
  return updateOrder(id, {
    status: 'failed',
    error_message: message,
  })
}

// ─── Lemon order ID → COS order ID mapping ───
const LEMON_MAP_KEY = (lemonId: string) => `creator-os:lemon-map:${lemonId}`
const LEMON_MAP_TTL = 60 * 60 * 24 * 30 // 30 days

export async function saveLemonMapping(
  lemonOrderId: string,
  cosOrderId: string
): Promise<void> {
  await redis.set(
    LEMON_MAP_KEY(lemonOrderId),
    cosOrderId,
    'EX',
    LEMON_MAP_TTL
  )
}

export async function getOrderByLemonId(
  lemonOrderId: string
): Promise<Order | null> {
  const cosId = await redis.get(LEMON_MAP_KEY(lemonOrderId))
  if (!cosId) return null
  return getOrder(cosId)
}

// ─── ค้นหา Order เก่าจาก Email (สำหรับ Pre-fill) ───
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const normalizedEmail = email.trim().toLowerCase()
  // ดึง ID ทั้งหมดจาก Index
  const ids = await redis.lrange(ORDER_INDEX, 0, 99) // เอาแค่ 100 รายการล่าสุดพอ
  const orders: Order[] = []

  for (const id of ids) {
    const raw = await redis.get(ORDER_KEY(id))
    if (raw) {
      const order = JSON.parse(raw) as Order
      if (order.email.toLowerCase() === normalizedEmail) {
        orders.push(order)
      }
    }
  }
  
  // เรียงจากใหม่ไปเก่า
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}