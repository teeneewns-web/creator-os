import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Creator OS',
  description:
    'Get in touch with Creator OS. We reply within 24 hours, Monday through Friday.',
}

const CONTACT_EMAIL = 'teeneewns@gmail.com'

const REASONS = [
  {
    label: 'Order issue',
    hint: 'Plan wrong, missing, or duplicated',
  },
  {
    label: 'Refund request',
    hint: 'Within 7 days of purchase',
  },
  {
    label: 'Technical problem',
    hint: 'Site down, checkout failing',
  },
  {
    label: 'Something else',
    hint: 'Partnerships, feedback, questions',
  },
]

export default function ContactPage() {
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
          <Link
            href="/"
            className="text-xs text-[#A39B8F] hover:text-[#1A1614] transition-colors"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Contact
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
            Talk to
            <br />
            <span className="italic text-[#6B6259]">a human.</span>
          </h1>
          <p className="text-[#6B6259] text-base md:text-lg leading-relaxed max-w-xl">
            Creator OS is run by one person, not a team. Emails go
            directly to me. I read every message.
          </p>
        </div>

        {/* Response time promise */}
        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 md:p-8 mb-6 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FBF0E9] border border-[#E8E1D6] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#D97757]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1614] mb-2">
                We reply within 24 hours.
              </h2>
              <p className="text-[#6B6259] leading-relaxed">
                Monday through Friday. Weekend messages are answered
                on the next business day. For order issues, please
                include your order ID (starts with{' '}
                <span className="font-mono text-sm">COS-</span>) so I
                can find your plan instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 md:p-8 mb-6 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-4">
            Email us directly
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="block font-mono text-lg md:text-xl text-[#1A1614] hover:text-[#D97757] transition-colors break-all mb-5"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=General%20inquiry`}
              className="flex-1 text-center bg-[#1A1614] text-[#FAF7F2] px-6 py-3.5 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
            >
              Send a message →
            </a>
            <Link
              href="/faq"
              className="flex-1 text-center bg-[#FAF7F2] border border-[#E8E1D6] text-[#1A1614] px-6 py-3.5 rounded-xl font-medium hover:border-[#D4CBB9] transition-colors"
            >
              Check FAQ first
            </Link>
          </div>
        </div>

        {/* What to include */}
        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 md:p-8 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-5">
            Common reasons to write
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {REASONS.map((r) => (
              <div
                key={r.label}
                className="bg-[#FAF7F2]/60 border border-[#E8E1D6] rounded-xl p-4"
              >
                <div className="font-medium text-[#1A1614] text-sm mb-1">
                  {r.label}
                </div>
                <div className="text-xs text-[#6B6259] leading-relaxed">
                  {r.hint}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-[#E8E1D6]">
            <p className="text-sm text-[#6B6259] leading-relaxed">
              <span className="text-[#1A1614] font-medium">
                Faster resolution:
              </span>{' '}
              If your plan is wrong or missing, use the{' '}
              <span className="text-[#D97757]">
                &ldquo;Report an issue&rdquo;
              </span>{' '}
              button at the bottom of your order page — it files a
              ticket with your order ID attached automatically.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#A39B8F] mt-10">
          Creator OS is operated by Sai Yar Len. Registered address
          available on request.
        </p>
      </main>
    </div>
  )
}