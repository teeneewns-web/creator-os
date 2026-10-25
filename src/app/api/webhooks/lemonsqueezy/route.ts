import { NextResponse, after } from 'next/server'
import { verifyWebhookSignature } from '@/lib/lemonsqueezy'
import {
  getOrder,
  markPaid,
  markGenerating,
  savePlan,
  markFailed,
  saveLemonMapping,
} from '@/lib/orders'
import { generatePlan } from '@/lib/gemini'
import { sendPlanEmail } from '@/lib/emails'
import type { Quiz } from '@/types/order'

export const maxDuration = 300 // 5 นาที (Fluid Compute)

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || ''

    if (!secret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET missing')
      return NextResponse.json(
        { ok: false, message: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { ok: false, message: 'Invalid signature' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload?.meta?.event_name

    if (eventName !== 'order_created') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const orderId = payload?.meta?.custom_data?.order_id
    if (!orderId) {
      console.error('No order_id in custom_data')
      return NextResponse.json(
        { ok: false, message: 'Missing order_id' },
        { status: 400 }
      )
    }

    const order = await getOrder(orderId)
    if (!order) {
      console.error(`Order ${orderId} not found`)
      return NextResponse.json(
        { ok: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status === 'ready' || order.status === 'generating') {
      return NextResponse.json({ ok: true, status: order.status })
    }

    const lemonOrderId = payload?.data?.id ? String(payload.data.id) : undefined

    if (lemonOrderId) {
      await saveLemonMapping(lemonOrderId, orderId)
    }

    await markPaid(orderId, 'lemonsqueezy', lemonOrderId)

    // รันแบบ Background แต่ใช้ after()
    after(
      processOrder(orderId, order.quiz).catch((err) => {
        console.error(`Background generation failed for ${orderId}:`, err)
      })
    )

    return NextResponse.json({ ok: true, status: 'processing' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { ok: false, message: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function processOrder(orderId: string, quiz: Quiz) {
  try {
    await markGenerating(orderId)
    const plan = await generatePlan(quiz)
    const saved = await savePlan(orderId, plan)

    if (saved) {
      try {
        // 🌟 สำคัญ: ใช้ await เพื่อรอให้ส่งอีเมลเสร็จก่อน ไม่ให้ Vercel ตัดการทำงาน
        await sendPlanEmail(saved, plan)
        console.log(`[email] Plan email sent for ${orderId}`)
      } catch (err) {
        console.error(`[email] Failed to send for ${orderId}:`, err)
      }
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Generation failed for ${orderId}:`, msg)
    await markFailed(orderId, msg)
  }
}