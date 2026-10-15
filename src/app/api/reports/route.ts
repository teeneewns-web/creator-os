import { NextResponse } from 'next/server'
import { createReport, type ReportType } from '@/lib/reports'
import { getOrder } from '@/lib/orders'

const VALID_TYPES: ReportType[] = [
  'plan_wrong',
  'email_missing',
  'payment_issue',
  'quality_issue',
  'other',
]

function isValidType(value: unknown): value is ReportType {
  return typeof value === 'string' && VALID_TYPES.includes(value as ReportType)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, type, message } = body ?? {}

    if (typeof order_id !== 'string' || order_id.trim().length === 0) {
      return NextResponse.json(
        { ok: false, message: 'Order ID required' },
        { status: 400 }
      )
    }

    if (!isValidType(type)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid report type' },
        { status: 400 }
      )
    }

    if (
      typeof message !== 'string' ||
      message.trim().length < 5 ||
      message.length > 2000
    ) {
      return NextResponse.json(
        { ok: false, message: 'Message must be 5-2000 characters' },
        { status: 400 }
      )
    }

    // Verify order exists
    const order = await getOrder(order_id)
    if (!order) {
      return NextResponse.json(
        { ok: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    const report = await createReport({
      order_id,
      email: order.email,
      type,
      message: message.trim(),
    })

    console.log(
      `[report] ${report.id} | ${report.type} | order ${order_id}`
    )

    return NextResponse.json({ ok: true, reportId: report.id })
  } catch (error) {
    console.error('Create report failed:', error)
    return NextResponse.json(
      { ok: false, message: 'Failed to submit report' },
      { status: 500 }
    )
  }
}