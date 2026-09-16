import type { Order, Quiz } from '@/types/order'
import type { Plan } from '@/types/plan'
import { promises as fs } from 'fs'
import path from 'path'
import { supabase, isSupabaseConfigured } from './supabase'

// ============================================================
// Dual mode: mock (local) + Supabase (production)
// ============================================================

const USE_MOCK = process.env.USE_MOCK === 'true'
const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json')

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'COS-'
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

// ---------- MOCK helpers ----------

async function readMockOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8')
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

async function writeMockOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

// ---------- Public API ----------

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

  if (USE_MOCK) {
    const orders = await readMockOrders()
    orders.push(order)
    await writeMockOrders(orders)
    return order
  }

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: order.id,
      email: order.email,
      quiz: order.quiz,
      status: order.status,
    })
    .select()
    .single()

  if (error) throw new Error(`createOrder: ${error.message}`)
  return data as Order
}

export async function getOrder(id: string): Promise<Order | null> {
  if (USE_MOCK) {
    const orders = await readMockOrders()
    return orders.find((o) => o.id === id) ?? null
  }

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`getOrder: ${error.message}`)
  return (data as Order) ?? null
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  if (USE_MOCK) {
    const orders = await readMockOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) return null
    orders[idx] = {
      ...orders[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    await writeMockOrders(orders)
    return orders[idx]
  }

  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) throw new Error(`updateOrder: ${error.message}`)
  return (data as Order) ?? null
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