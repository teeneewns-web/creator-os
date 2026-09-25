'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import type { Order } from '@/types/order'
import type { DayPlan } from '@/types/plan'

export default function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    let ticker: ReturnType<typeof setInterval> | null = null

    async function load() {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        const data = await res.json()
        if (!res.ok || !data.ok)
          throw new Error(data.message || 'Not found')
        setOrder(data.order)
        setLoading(false)

        if (data.order.status === 'ready' && interval) {
          clearInterval(interval)
          interval = null
          if (ticker) clearInterval(ticker)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed')
        setLoading(false)
        if (interval) clearInterval(interval)
        if (ticker) clearInterval(ticker)
      }
    }

    load()
    interval = setInterval(load, 3000)
    ticker = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => {
      if (interval) clearInterval(interval)
      if (ticker) clearInterval(ticker)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#E8E1D6] border-t-[#D97757] spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-2xl mb-2">Something went wrong</h1>
          <p className="text-[#6B6259]">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  const isGenerating =
    order.status === 'pending' ||
    order.status === 'paid' ||
    order.status === 'generating'

  if (isGenerating) {
    const remaining = Math.max(0, 45 - elapsed)
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="relative w-16 h-16 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8E1D6]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#D97757] spinner" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] animate-pulse" />
            Generating
          </div>

          <h1 className="font-serif text-3xl md:text-4xl tracking-[-0.02em] mb-4">
            Building
            <br />
            <span className="italic text-[#6B6259]">your plan.</span>
          </h1>

          <p className="text-[#6B6259] leading-relaxed mb-6">
            This takes 30 to 60 seconds.
            <br />
            <span className="text-[#1A1614] font-medium">
              Please don&apos;t close this tab.
            </span>
          </p>

          {remaining > 0 && (
            <p className="text-sm text-[#A39B8F]">
              About {remaining} seconds remaining
            </p>
          )}

          <div className="mt-10 pt-6 border-t border-[#E8E1D6]">
            <p className="text-xs text-[#A39B8F] mb-2">
              Your order ID
            </p>
            <p className="font-mono text-sm text-[#1A1614]">{order.id}</p>
            <p className="text-xs text-[#A39B8F] mt-3">
              Save this in case you need support.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (order.status === 'failed') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-red-700 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Failed
          </div>
          <h1 className="font-serif text-3xl tracking-[-0.02em] mb-3">
            Generation failed
          </h1>
          <p className="text-[#6B6259] mb-6">
            {order.error_message || 'Please try again.'}
          </p>

          <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 mb-6 text-left">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
              Your order ID
            </div>
            <div className="font-mono text-sm text-[#1A1614] mb-4">
              {order.id}
            </div>
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
              Contact support
            </div>
            <a
              href={`mailto:teeneewns@gmail.com?subject=Order issue ${order.id}`}
              className="text-sm text-[#D97757] hover:underline"
            >
              teeneewns@gmail.com
            </a>
          </div>

          <Link
            href="/start"
            className="inline-block bg-[#1A1614] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
          >
            Try a new plan →
          </Link>
        </div>
      </div>
    )
  }

  const plan = order.plan
  if (!plan) return null

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-[#E8E1D6] bg-[#FAF7F2]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Plan ready
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">
            {plan.title}
          </h1>
          <p className="text-lg text-[#6B6259] leading-relaxed">
            {plan.summary}
          </p>
        </div>

        <div className="space-y-4">
          {plan.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E1D6] text-center">
          <p className="text-sm text-[#A39B8F] mb-1">
            Generated{' '}
            {new Date(plan.generated_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-[#A39B8F] mb-6">
            Order {order.id}
          </p>
          <Link
            href="/start"
            className="inline-block text-sm font-medium text-[#D97757] hover:underline"
          >
            Plan next week →
          </Link>
        </div>
      </main>
    </div>
  )
}

function DayCard({ day }: { day: DayPlan }) {
  const [copied, setCopied] = useState(false)

  function copyAll() {
    const text = [
      `DAY ${day.day}`,
      ``,
      `HOOK: ${day.hook}`,
      ``,
      `SCRIPT:`,
      day.script,
      ``,
      `CAPTION: ${day.caption}`,
      ``,
      `HASHTAGS: ${day.hashtags.map((h) => `#${h}`).join(' ')}`,
      ``,
      `VISUAL: ${day.visual}`,
      ``,
      `POST AT: ${day.posting_time}`,
    ].join('\n')

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="bg-white border border-[#E8E1D6] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
      <div className="px-6 py-4 border-b border-[#E8E1D6] flex items-center justify-between bg-[#FAF7F2]/60">
        <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#D97757] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
          Day {String(day.day).padStart(2, '0')}
        </div>
        <button
          onClick={copyAll}
          className={`text-xs font-medium transition-colors ${
            copied
              ? 'text-[#D97757]'
              : 'text-[#6B6259] hover:text-[#1A1614]'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy day'}
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2.5">
            Hook
          </div>
          <div className="font-serif text-xl md:text-2xl leading-snug text-[#1A1614]">
            {day.hook}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2.5">
            Script
          </div>
          <p className="text-[#3F3A35] whitespace-pre-wrap leading-relaxed">
            {day.script}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-[#E8E1D6]">
          <MetaBox label="Caption">{day.caption}</MetaBox>
          <MetaBox label="Post at">{day.posting_time}</MetaBox>
          <div className="sm:col-span-2">
            <MetaBox label="Visual direction">{day.visual}</MetaBox>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2.5">
              Hashtags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {day.hashtags.map((h, i) => (
                <span
                  key={`${h}-${i}`}
                  className="bg-[#FAF7F2] border border-[#E8E1D6] text-[#6B6259] px-2.5 py-1 rounded-full text-xs font-mono"
                >
                  #{h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function MetaBox({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#FAF7F2]/60 border border-[#E8E1D6] rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-[#A39B8F] mb-1.5">
        {label}
      </div>
      <div className="text-sm text-[#3F3A35] leading-relaxed">{children}</div>
    </div>
  )
}