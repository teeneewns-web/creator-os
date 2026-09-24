'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Platform = 'tiktok' | 'reels' | 'shorts'
type Tone = 'energetic' | 'calm' | 'funny' | 'serious'
type Goal = 'followers' | 'sales' | 'engagement'
type Constraint = 'no_face' | 'no_voice' | 'phone_only' | 'under_30s' | 'no_editing'

const platforms: { value: Platform; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'reels', label: 'Reels' },
  { value: 'shorts', label: 'Shorts' },
]

const tones: { value: Tone; label: string }[] = [
  { value: 'energetic', label: 'Energetic' },
  { value: 'calm', label: 'Calm' },
  { value: 'funny', label: 'Funny' },
  { value: 'serious', label: 'Serious' },
]

const goals: { value: Goal; label: string }[] = [
  { value: 'followers', label: 'Grow followers' },
  { value: 'sales', label: 'Drive sales' },
  { value: 'engagement', label: 'Boost engagement' },
]

const constraintOptions: { value: Constraint; label: string }[] = [
  { value: 'no_face', label: 'No face on camera' },
  { value: 'no_voice', label: 'No voiceover' },
  { value: 'phone_only', label: 'Phone camera only' },
  { value: 'under_30s', label: 'Videos under 30 seconds' },
  { value: 'no_editing', label: 'Minimal editing' },
]

export default function StartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    platform: 'tiktok' as Platform,
    niche: '',
    product: '',
    audience: '',
    tone: 'energetic' as Tone,
    goal: 'followers' as Goal,
    constraints: [] as Constraint[],
    email: '',
  })

  function toggleConstraint(c: Constraint) {
    setForm((prev) => ({
      ...prev,
      constraints: prev.constraints.includes(c)
        ? prev.constraints.filter((x) => x !== c)
        : [...prev.constraints, c],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Failed')
      router.push(`/checkout/${data.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
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
          <Link
            href="/"
            className="text-xs text-[#A39B8F] hover:text-[#1A1614] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
          Step 1 of 2
        </div>

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">
            Tell us about
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic text-[#6B6259]">
                your content.
              </span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.3em] bg-[#FBF0E9] -z-0"
              />
            </span>
          </h1>
          <p className="text-[#6B6259] text-lg">
            8 quick questions. Takes about 45 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <Field label="Which platform?">
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <ChoiceButton
                  key={p.value}
                  selected={form.platform === p.value}
                  onClick={() => setForm({ ...form, platform: p.value })}
                >
                  {p.label}
                </ChoiceButton>
              ))}
            </div>
          </Field>

          <Field
            label="Your niche"
            hint="Be specific. Specific niches make better hooks."
          >
            <input
              type="text"
              value={form.niche}
              onChange={(e) => setForm({ ...form, niche: e.target.value })}
              placeholder="e.g. fitness for busy moms"
              required
              className="w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3.5 text-sm text-[#1A1614] placeholder:text-[#A39B8F] transition-all focus:border-[#1A1614] focus:ring-4 focus:ring-[#1A1614]/5"
            />
          </Field>

          <Field
            label="What do you sell or offer?"
            hint="Product, service, or expertise you want to promote."
          >
            <input
              type="text"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
              placeholder="e.g. 10-minute home workout program"
              required
              className="w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3.5 text-sm text-[#1A1614] placeholder:text-[#A39B8F] transition-all focus:border-[#1A1614] focus:ring-4 focus:ring-[#1A1614]/5"
            />
          </Field>

          <Field
            label="Who is this content for?"
            hint="Describe your ideal viewer or customer."
          >
            <input
              type="text"
              value={form.audience}
              onChange={(e) => setForm({ ...form, audience: e.target.value })}
              placeholder="e.g. busy moms aged 28-40 who want to get fit at home"
              required
              className="w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3.5 text-sm text-[#1A1614] placeholder:text-[#A39B8F] transition-all focus:border-[#1A1614] focus:ring-4 focus:ring-[#1A1614]/5"
            />
          </Field>

          <Field label="Tone">
            <div className="grid grid-cols-4 gap-2">
              {tones.map((t) => (
                <ChoiceButton
                  key={t.value}
                  selected={form.tone === t.value}
                  onClick={() => setForm({ ...form, tone: t.value })}
                >
                  {t.label}
                </ChoiceButton>
              ))}
            </div>
          </Field>

          <Field label="Main goal">
            <div className="grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <ChoiceButton
                  key={g.value}
                  selected={form.goal === g.value}
                  onClick={() => setForm({ ...form, goal: g.value })}
                >
                  {g.label}
                </ChoiceButton>
              ))}
            </div>
          </Field>

          <Field
            label="Any constraints?"
            hint="Optional. Select all that apply. We'll design content around them."
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {constraintOptions.map((c) => {
                const selected = form.constraints.includes(c.value)
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => toggleConstraint(c.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      selected
                        ? 'border-[#D97757] bg-[#FBF0E9] text-[#D97757]'
                        : 'border-[#E8E1D6] bg-white text-[#6B6259] hover:border-[#D4CBB9] hover:text-[#1A1614]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected
                          ? 'border-[#D97757] bg-[#D97757]'
                          : 'border-[#D4CBB9] bg-white'
                      }`}
                    >
                      {selected && (
                        <svg
                          viewBox="0 0 16 16"
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 8 7 12 13 4" />
                        </svg>
                      )}
                    </span>
                    {c.label}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field
            label="Your email"
            hint="We send your plan here. No spam, ever."
          >
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3.5 text-sm text-[#1A1614] placeholder:text-[#A39B8F] transition-all focus:border-[#1A1614] focus:ring-4 focus:ring-[#1A1614]/5"
            />
          </Field>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="pt-6 border-t border-[#E8E1D6]">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1614] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#2A2521] disabled:opacity-50 transition-colors shadow-[0_2px_8px_rgba(26,22,20,0.12)]"
            >
              {loading ? 'Creating your order...' : 'Continue to payment →'}
            </button>
            <p className="text-xs text-[#A39B8F] text-center mt-4">
              Next: secure checkout. Takes about a minute.
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1614] mb-2.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-[#A39B8F] mt-2.5">{hint}</p>}
    </div>
  )
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
        selected
          ? 'border-[#D97757] bg-[#FBF0E9] text-[#D97757] shadow-[0_0_0_3px_rgba(217,119,87,0.1)]'
          : 'border-[#E8E1D6] bg-white text-[#6B6259] hover:border-[#D4CBB9] hover:text-[#1A1614]'
      }`}
    >
      {children}
    </button>
  )
}