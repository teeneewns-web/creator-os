import { NextResponse } from 'next/server'
import {
  getOrder,
  markPaid,
  markGenerating,
  markFailed,
  savePlan,
} from '@/lib/orders'
import { generatePlan } from '@/lib/gemini'
import { sendPlanEmail } from '@/lib/emails'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const order = await getOrder(orderId)

    if (!order) {
      return NextResponse.json(
        { ok: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status === 'ready') {
      return NextResponse.json({ ok: true, status: 'ready' })
    }

    if (order.status === 'generating') {
      return NextResponse.json({ ok: true, status: 'generating' })
    }

    if (order.status === 'pending') {
      await markPaid(orderId, 'promptpay')
    }

    await markGenerating(orderId)

    try {
      const plan = await generatePlan(order.quiz)
      const saved = await savePlan(orderId, plan)

      if (saved) {
        sendPlanEmail(saved, plan).catch((err: unknown) =>
          console.error('Email send failed:', err)
        )
      }

      return NextResponse.json({ ok: true, status: 'ready' })
    } catch (genError) {
      const msg =
        genError instanceof Error ? genError.message : 'Unknown error'
      console.error('Gemini error:', genError)
      await markFailed(orderId, msg)
      return NextResponse.json(
        { ok: false, message: 'Plan generation failed', detail: msg },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Confirm failed', error)
    return NextResponse.json(
      { ok: false, message: 'Confirmation failed' },
      { status: 500 }
    )
  }
}