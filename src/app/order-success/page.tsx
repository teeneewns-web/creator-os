'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type OrderLite = {
  id: string
  status: string
  email: string
}

function OrderSuccessInner() {
  const searchParams = useSearchParams()
  const lemonOrderId = searchParams.get('order_id')
  const [order, setOrder] = useState<OrderLite | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const attemptRef = useRef(0)

  useEffect(() => {
    if (!lemonOrderId) {
      setNotFound(true)
      return
    }

    let cancelled = false

    async function poll() {
      attemptRef.current += 1
      try {
        const res = await fetch(`/api/orders/by-lemon/${lemonOrderId}`)

        if (res.status === 404) {
          // Webhook may not have fired yet — keep trying ~60s
          if (attemptRef.current >= 20) {
            setTimedOut(true)
            return
          }
          if (!cancelled) window.setTimeout(poll, 3000)
          return
        }

        const data = await res.json()
        if (cancelled) return

        if (data.ok) {
          setOrder(data.order)
          if (
            data.order.status === 'ready' ||
            data.order.status === 'failed'
          ) {
            return
          }
        } else {
          setNotFound(true)
          return
        }
      } catch {
        // network — retry
      }
      if (!cancelled) window.setTimeout(poll, 3000)
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [lemonOrderId])

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="font-serif text-3xl mb-3 text-[#1A1614]">
            Order not found
          </h1>
          <p className="text-[#6B6259] mb-6">
            If you were charged, contact us at{' '}
            <a
              className="text-[#D97757] underline"
              href="mailto:hello@creator-os.app"
            >
              hello@creator-os.app
            </a>
          </p>
          <Link
            href="/"
            className="text-[#D97757] font-medium hover:underline"
          >
            Back to home →
          </Link>
        </div>
      </div>
    )
  }

  if (timedOut) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">📬</div>
          <h1 className="font-serif text-3xl mb-3 text-[#1A1614]">
            Payment received
          </h1>
          <p className="text-[#6B6259] mb-2">
            We're generating your 7-day plan.
          </p>
          <p className="text-[#6B6259] mb-6">
            It will arrive at your email shortly. You can safely close this tab.
          </p>
          <Link
            href="/"
            className="text-[#D97757] font-medium hover:underline"
          >
            Back to home →
          </Link>
        </div>
      </div>
    )
  }

  const isReady = order?.status === 'ready'
  const isFailed = order?.status === 'failed'

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
          {order && (
            <div className="text-xs font-mono text-[#A39B8F]">{order.id}</div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(26,22,20,0.03)] text-center">
          {isReady ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FBF0E9] border border-[#E8E1D6] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-[#D97757]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
                Your plan is{' '}
                <span className="italic text-[#6B6259]">ready.</span>
              </h1>
              <p className="text-[#6B6259] mb-8">
                Payment confirmed. We've emailed your 7-day plan to{' '}
                <span className="text-[#1A1614] font-medium">
                  {order?.email}
                </span>
              </p>
              <Link
                href={`/order/${order?.id}`}
                className="inline-block w-full bg-[#D97757] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#C66846] transition-colors shadow-[0_2px_8px_rgba(217,119,87,0.25)]"
              >
                View your plan →
              </Link>
            </>
          ) : isFailed ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h1 className="font-serif text-3xl mb-3 text-[#1A1614]">
                Something went wrong
              </h1>
              <p className="text-[#6B6259] mb-6">
                Payment went through, but we couldn't generate your plan.
                Please contact us at{' '}
                <a
                  className="text-[#D97757] underline"
                  href="mailto:hello@creator-os.app"
                >
                  hello@creator-os.app
                </a>{' '}
                and we'll fix it right away.
              </p>
              {order?.id && (
                <Link
                  href={`/order/${order.id}`}
                  className="text-[#D97757] font-medium hover:underline"
                >
                  Check order status →
                </Link>
              )}
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-[#E8E1D6] border-t-[#D97757] spinner" />
              <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
                Payment{' '}
                <span className="italic text-[#6B6259]">received.</span>
              </h1>
              <p className="text-[#6B6259] mb-3">
                We're generating your 7-day content plan right now.
              </p>
              {order?.email && (
                <p className="text-sm text-[#A39B8F] mb-8">
                  It will land in{' '}
                  <span className="text-[#1A1614] font-medium">
                    {order.email}
                  </span>{' '}
                  within ~60 seconds.
                </p>
              )}
              <p className="text-xs text-[#A39B8F]">
                You can safely close this tab — we'll email it.
              </p>
            </>
          )}
        </div>

        {!isReady && !isFailed && (
          <p className="text-center text-xs text-[#A39B8F] mt-6">
            This page auto-updates every few seconds.
          </p>
        )}
      </main>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#E8E1D6] border-t-[#D97757] spinner" />
        <div className="text-sm text-[#A39B8F]">Loading...</div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderSuccessInner />
    </Suspense>
  )
}