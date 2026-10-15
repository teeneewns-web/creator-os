'use client'

import { useEffect, useState } from 'react'

type ReportType =
  | 'plan_wrong'
  | 'email_missing'
  | 'payment_issue'
  | 'quality_issue'
  | 'other'

const OPTIONS: { value: ReportType; label: string; hint: string }[] = [
  {
    value: 'plan_wrong',
    label: 'Plan is off-topic',
    hint: 'Does not match my niche or product',
  },
  {
    value: 'quality_issue',
    label: 'Quality problem',
    hint: 'Repetitive, generic, or unusable content',
  },
  {
    value: 'email_missing',
    label: 'Email never arrived',
    hint: 'Plan is ready but I got no email',
  },
  {
    value: 'payment_issue',
    label: 'Payment / billing issue',
    hint: 'Charged twice, wrong amount, etc.',
  },
  {
    value: 'other',
    label: 'Something else',
    hint: 'Anything not listed above',
  },
]

export default function ReportIssueModal({
  orderId,
  open,
  onClose,
}: {
  orderId: string
  open: boolean
  onClose: () => void
}) {
  const [type, setType] = useState<ReportType>('plan_wrong')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setDone(false)
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, submitting, onClose])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (message.trim().length < 5) {
      setError('Please write at least a few words.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          type,
          message: message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.message || 'Failed to submit')
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#1A1614]/40 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="w-full sm:max-w-lg bg-[#FAF7F2] border border-[#E8E1D6] rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#FBF0E9] border border-[#E8E1D6] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-[#D97757]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl mb-2 text-[#1A1614]">
              Thanks for the heads-up.
            </h2>
            <p className="text-sm text-[#6B6259] mb-6">
              We&apos;ve logged your report and will reply within 24 hours to
              the email on this order.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#1A1614] text-[#FAF7F2] px-6 py-3 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-6 pt-6 pb-4 border-b border-[#E8E1D6] flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-[#1A1614] mb-1">
                  Report an issue
                </h2>
                <p className="text-xs text-[#A39B8F] font-mono">
                  {orderId}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="text-[#A39B8F] hover:text-[#1A1614] p-1 -mt-1 disabled:opacity-50"
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
              <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-3">
                What went wrong?
              </div>
              <div className="space-y-2 mb-6">
                {OPTIONS.map((opt) => {
                  const active = type === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        active
                          ? 'border-[#D97757] bg-[#FBF0E9]'
                          : 'border-[#E8E1D6] bg-white hover:border-[#D4CBB9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-type"
                        value={opt.value}
                        checked={active}
                        onChange={() => setType(opt.value)}
                        className="sr-only"
                      />
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          active
                            ? 'border-[#D97757]'
                            : 'border-[#D4CBB9]'
                        }`}
                      >
                        {active && (
                          <div className="w-2 h-2 rounded-full bg-[#D97757]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#1A1614]">
                          {opt.label}
                        </div>
                        <div className="text-xs text-[#6B6259] mt-0.5">
                          {opt.hint}
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

              <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-3">
                Tell us more
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What did you expect, and what did you get? The more detail, the faster we can help."
                rows={5}
                maxLength={2000}
                className="w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3 text-sm text-[#1A1614] placeholder:text-[#A39B8F] focus:outline-none focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 resize-none"
              />
              <div className="text-right text-[10px] text-[#A39B8F] mt-1">
                {message.length}/2000
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[#E8E1D6] bg-white flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-3 rounded-xl font-medium text-[#6B6259] hover:text-[#1A1614] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-medium bg-[#D97757] text-white hover:bg-[#C66846] disabled:opacity-50 transition-colors shadow-[0_2px_8px_rgba(217,119,87,0.25)]"
              >
                {submitting ? 'Sending...' : 'Send report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}