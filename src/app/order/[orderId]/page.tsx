'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import type { Order } from '@/types/order'
import type { DayPlan } from '@/types/plan'
import ReportIssueModal from '@/components/ReportIssueModal'

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
  const [doneDays, setDoneDays] = useState<number[]>([])
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`done-${orderId}`)
    if (stored) {
      try {
        setDoneDays(JSON.parse(stored))
      } catch {}
    }
  }, [orderId])

  function toggleDone(day: number) {
    const next = doneDays.includes(day)
      ? doneDays.filter((d) => d !== day)
      : [...doneDays, day]
    setDoneDays(next)
    localStorage.setItem(`done-${orderId}`, JSON.stringify(next))
  }

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
            <p className="text-xs text-[#A39B8F] mb-2">Your order ID</p>
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

  const progress = `${doneDays.length}/${plan.days.length}`

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
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Plan ready
          </div>
          <h1 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">
            {plan.title}
          </h1>
          <p className="text-base md:text-lg text-[#6B6259] leading-relaxed mb-6">
            {plan.summary}
          </p>

          <div className="inline-flex items-center gap-3 bg-white border border-[#E8E1D6] rounded-full px-4 py-2">
            <span className="text-xs uppercase tracking-widest text-[#A39B8F]">
              Progress
            </span>
            <span className="text-sm font-medium text-[#1A1614]">
              {progress} days done
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {plan.days.map((day) => (
            <DayCard
              key={day.day}
              day={day}
              done={doneDays.includes(day.day)}
              onToggleDone={() => toggleDone(day.day)}
            />
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
          <p className="text-xs text-[#A39B8F] mb-6">Order {order.id}</p>
          
          <Link
            href={`/start?from=${order.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#D97757] text-white px-6 py-3.5 rounded-xl font-medium hover:bg-[#C66846] transition-colors shadow-[0_2px_8px_rgba(217,119,87,0.25)] mt-2"
          >
            Plan next week →
          </Link>

          <div className="mt-3">
            <Link
              href="/start"
              className="text-xs text-[#A39B8F] hover:text-[#6B6259] transition-colors underline decoration-[#E8E1D6] underline-offset-4"
            >
              Or start a completely new plan
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#E8E1D6]">
            <p className="text-xs text-[#A39B8F] mb-3">
              Something not right with this plan?
            </p>
            <button
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6B6259] border border-[#E8E1D6] bg-white hover:border-[#D4CBB9] hover:text-[#1A1614] px-4 py-2.5 rounded-xl transition-all"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
              Report an issue
            </button>
          </div>
        </div>
      </main>

      <ReportIssueModal
        orderId={order.id}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  )
}

function DayCard({
  day,
  done,
  onToggleDone,
}: {
  day: DayPlan
  done: boolean
  onToggleDone: () => void
}) {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(label: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  const cleanTags = day.hashtags
    .map((h) => `#${h.replace(/^#+/, '').trim()}`)
    .join(' ')

  const hookText = day.hook
  const scriptText = day.script
  const captionAndTags = `${day.caption}\n\n${cleanTags}`

  const allText = [
    `DAY ${String(day.day).padStart(2, '0')} - ${day.type || ''}`,
    ``,
    `HOOK:`,
    hookText,
    ``,
    `SCRIPT:`,
    scriptText,
    ``,
    `CAPTION:`,
    day.caption,
    ``,
    `HASHTAGS:`,
    cleanTags,
    ``,
    `VISUAL:`,
    day.visual,
    ``,
    `POST AT: ${day.posting_time}`,
    day.posting_tip ? `\nPOSTING TIP: ${day.posting_tip}` : '',
    day.sound_suggestion ? `\nSOUND: ${day.sound_suggestion}` : '',
    day.text_overlay ? `\nTEXT OVERLAY: ${day.text_overlay}` : '',
  ].join('\n')

  return (
    <article
      className={`bg-white border rounded-2xl overflow-hidden transition-all ${
        done
          ? 'border-[#D97757]/40 bg-[#FBF0E9]/30 opacity-75'
          : 'border-[#E8E1D6] shadow-[0_1px_3px_rgba(26,22,20,0.03)]'
      }`}
    >
      <div className="px-6 py-4 border-b border-[#E8E1D6] flex items-center justify-between bg-[#FAF7F2]/60">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#D97757] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Day {String(day.day).padStart(2, '0')}
          </div>
          {day.type && (
            <span className="text-xs text-[#A39B8F] hidden sm:inline-block">
              {day.type}
            </span>
          )}
          {done && (
            <span className="text-xs text-[#D97757] font-medium">
              ✓ Done
            </span>
          )}
        </div>
        <button
          onClick={onToggleDone}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            done
              ? 'bg-[#D97757] border-[#D97757] text-white'
              : 'bg-white border-[#E8E1D6] text-[#6B6259] hover:border-[#D4CBB9] hover:text-[#1A1614]'
          }`}
        >
          {done ? 'Undo' : 'Mark done'}
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F]">
              Hook
            </div>
            <CopyButton
              label="Copy Hook"
              copied={copied === 'hook'}
              onClick={() => copy('hook', hookText)}
            />
          </div>
          <div className="font-serif text-xl md:text-2xl leading-snug text-[#1A1614]">
            {day.hook}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F]">
              Script
            </div>
            <CopyButton
              label="Copy Script"
              copied={copied === 'script'}
              onClick={() => copy('script', scriptText)}
            />
          </div>
          <p className="text-[#3F3A35] whitespace-pre-wrap leading-relaxed">
            {day.script}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F]">
              Caption + Hashtags
            </div>
            <CopyButton
              label="Copy for TikTok"
              copied={copied === 'caption'}
              onClick={() => copy('caption', captionAndTags)}
            />
          </div>
          <p className="text-[#3F3A35] mb-3">{day.caption}</p>
          <div className="flex flex-wrap gap-1.5">
            {day.hashtags.map((h, i) => {
              const clean = h.replace(/^#+/, '').trim()
              return (
                <span
                  key={`${clean}-${i}`}
                  className="bg-[#FAF7F2] border border-[#E8E1D6] text-[#6B6259] px-2.5 py-1 rounded-full text-xs font-mono"
                >
                  #{clean}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-[#E8E1D6]">
          <MetaBox label="Post at">{day.posting_time}</MetaBox>
          <MetaBox label="Visual direction">{day.visual}</MetaBox>
        </div>

        {/* Execution Tips (Posting Tip + Sound + Text Overlay) */}
        {(day.posting_tip || day.sound_suggestion || day.text_overlay) && (
          <div className="mt-6 pt-6 border-t border-[#E8E1D6]">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-4">
              Execution Tips
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3">
              {day.posting_tip && (
                <div className="bg-[#FBF0E9]/40 border border-[#E8E1D6] rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#D97757] font-medium mb-1.5 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    Filming Tip
                  </div>
                  <div className="text-sm text-[#3F3A35] leading-relaxed">
                    {day.posting_tip}
                  </div>
                </div>
              )}
              {day.sound_suggestion && (
                <div className="bg-[#FAF7F2] border border-[#E8E1D6] rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#6B6259] font-medium mb-1.5 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18V5l12-2v13"/>
                      <circle cx="6" cy="18" r="3"/>
                      <circle cx="18" cy="16" r="3"/>
                    </svg>
                    Sound
                  </div>
                  <div className="text-sm text-[#3F3A35] leading-relaxed">
                    {day.sound_suggestion}
                  </div>
                </div>
              )}
              {day.text_overlay && (
                <div className="bg-[#FAF7F2] border border-[#E8E1D6] rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#6B6259] font-medium mb-1.5 flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
                    </svg>
                    Text Overlay
                  </div>
                  <div className="text-sm text-[#3F3A35] leading-relaxed font-medium">
                    &ldquo;{day.text_overlay}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-[#E8E1D6] flex justify-end">
          <CopyButton
            label="Copy Full Day"
            copied={copied === 'all'}
            onClick={() => copy('all', allText)}
          />
        </div>
      </div>
    </article>
  )
}

function CopyButton({
  label,
  copied,
  onClick,
}: {
  label: string
  copied: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-all ${
        copied
          ? 'bg-[#D97757] border-[#D97757] text-white'
          : 'bg-white border-[#E8E1D6] text-[#6B6259] hover:border-[#D4CBB9] hover:text-[#1A1614]'
      }`}
    >
      {copied ? '✓ Copied' : label}
    </button>
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