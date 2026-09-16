import { NextResponse } from 'next/server'
import { getOrder } from '@/lib/orders'

export async function GET(
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
    return NextResponse.json({ ok: true, order })
  } catch (error) {
    console.error('Get order failed', error)
    return NextResponse.json(
      { ok: false, message: 'Failed to load order' },
      { status: 500 }
    )
  }
}