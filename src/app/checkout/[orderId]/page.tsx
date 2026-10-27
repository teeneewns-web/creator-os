'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { buildCheckoutUrl } from '@/lib/lemonsqueezy'

type Order = {
  id: string
  email: string
  status: string
  amount_usd: number
  quiz: { niche: string }
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setOrder(data.order)
        else setError(data.message || 'Not found')
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load order')
        setLoading(false)
      })
  }, [orderId])

  function handleCardCheckout() {
    if (!order) return
    setError('')
    setRedirecting(true)
    const url = buildCheckoutUrl(order.id)
    window.location.href = url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[#E8E1D6] border-t-[#D97757] spinner" />
          <div className="text-sm text-[#A39B8F]">Loading checkout...</div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="font-serif text-2xl mb-2">Order not found</h1>
          <p className="text-[#6B6259]">{error || 'Please start over.'}</p>
          <Link
            href="/start"
            className="inline-block mt-6 text-[#D97757] font-medium hover:underline"
          >
            Start a new plan →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-[#E8E1D6] bg-[#FAF7F2]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#1A1614] flex items-center justify-center text-[#FAF7F2] text-xs font-semibold">
              C
            </div>
            <span className="font-medium tracking-tight text-[15px] text-[#1A1614]">
              Creator OS
            </span>
          </Link>
          <div className="text-xs font-mono text-[#A39B8F]">{order.id}</div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
          Step 2 of 2
        </div>

        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">
            Complete
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic text-[#6B6259]">
                your order.
              </span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.3em] bg-[#FBF0E9] -z-0"
              />
            </span>
          </h1>
          <p className="text-[#6B6259]">
            Plan emailed to{' '}
            <span className="text-[#1A1614] font-medium">{order.email}</span>
          </p>
        </div>

        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 mb-6 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-4">
            Order summary
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-medium mb-1 text-[#1A1614]">
                7-day content plan
              </div>
              <div className="text-sm text-[#6B6259]">
                Niche: {order.quiz.niche}
              </div>
            </div>
            <div className="text-lg font-semibold text-[#1A1614]">
              ${order.amount_usd}
            </div>
          </div>
          <div className="border-t border-[#E8E1D6] pt-4 flex justify-between font-medium text-[#1A1614]">
            <span>Total</span>
            <span>${order.amount_usd}</span>
          </div>
        </div>

        {/* Card — Lemon hosted checkout */}
        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 mb-4 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#FBF0E9] border border-[#E8E1D6] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#D97757]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-medium text-[#1A1614]">Pay with card</div>
              <div className="text-sm text-[#6B6259]">
                Card, Apple Pay, Google Pay, or PayPal
              </div>
            </div>
          </div>

          <button
            onClick={handleCardCheckout}
            disabled={redirecting}
            className="w-full bg-[#D97757] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#C66846] disabled:opacity-50 transition-colors shadow-[0_4px_12px_rgba(217,119,87,0.25)]"
          >
            {redirecting
              ? 'Redirecting to secure checkout...'
              : `Pay $${order.amount_usd} securely`}
          </button>

          <p className="text-xs text-[#A39B8F] text-center mt-3">
            Secure checkout by Lemon Squeezy. Instant access.
          </p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </main>
    </div>
  )
}