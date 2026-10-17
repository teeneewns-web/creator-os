import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Creator OS',
  description: 'One plan. One price. $19 one-time. No subscription, no hidden fees.',
}

export default function PricingPage() {
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
            href="/start"
            className="text-xs font-medium text-[#D97757] hover:underline"
          >
            Create my plan →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Pricing
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
            Simple, honest pricing.
          </h1>
          <p className="text-[#6B6259] text-lg max-w-md mx-auto">
            No subscriptions. No hidden fees. Just the plan you need, when you need it.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white border border-[#E8E1D6] rounded-3xl p-10 md:p-12 shadow-[0_8px_32px_rgba(26,22,20,0.06)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D97757] to-[#FBF0E9]" />
            
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#6B6259] font-medium mb-5">
              7-Day Content Plan
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-6xl tracking-[-0.02em] text-[#1A1614]">
                $19
              </span>
              <span className="text-[#6B6259] text-lg">USD</span>
            </div>
            <p className="text-sm text-[#A39B8F] mb-8">One-time payment</p>

            <ul className="space-y-4 mb-10 text-[15px] text-[#3F3A35]">
              {[
                '7 days of hooks, scripts, captions',
                'Visual direction for every day',
                'Posting time recommendations',
                'Delivered in minutes',
                'No subscription required',
                '7-day money-back guarantee',
              ].map((line) => (
                <li key={line} className="flex gap-3 items-start">
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 text-[#D97757] flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 8 7 12 13 4" />
                  </svg>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/start"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#D97757] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#C66846] transition-colors shadow-[0_2px_8px_rgba(217,119,87,0.25)]"
            >
              Create my 7-day plan
              <span aria-hidden>→</span>
            </Link>
            
            <p className="text-xs text-center text-[#A39B8F] mt-4">
              Secure checkout by Lemon Squeezy.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-serif text-3xl text-center text-[#1A1614] mb-10">
            Pricing questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is this a subscription?',
                a: 'No. You pay $19 once and get a 7-day plan. If you want another plan later, you can buy it separately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'Credit and debit cards (Visa, Mastercard, Amex) via Lemon Squeezy. In Thailand, we also accept PromptPay (690 THB).',
              },
              {
                q: 'What is your refund policy?',
                a: 'If your plan is unusable (wrong niche, wrong language, or duplicated content), contact us within 7 days and we will refund you in full.',
              },
              {
                q: 'Are there any hidden fees?',
                a: 'None. The price you see is the price you pay. Taxes may apply based on your location, handled by Lemon Squeezy.',
              }
            ].map((item, i) => (
              <details key={i} className="group bg-white border border-[#E8E1D6] rounded-2xl overflow-hidden">
                <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between hover:bg-[#FAF7F2]/50 transition-colors">
                  <span className="font-medium text-[#1A1614]">{item.q}</span>
                  <span className="text-[#A39B8F] group-open:text-[#D97757] transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[#3F3A35] leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}