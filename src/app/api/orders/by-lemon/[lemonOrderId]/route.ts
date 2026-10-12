import { NextResponse } from 'next/server'
import { getOrderByLemonId } from '@/lib/orders'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lemonOrderId: string }> }
) {
  try {
    const { lemonOrderId } = await params
    const order = await getOrderByLemonId(lemonOrderId)

    if (!order) {
      return NextResponse.json(
        { ok: false, message: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, order })
  } catch (error) {
    console.error('Lookup by lemon id failed:', error)
    return NextResponse.json(
      { ok: false, message: 'Failed' },
      { status: 500 }
    )
  }
}