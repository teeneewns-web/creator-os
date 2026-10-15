import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — Creator OS',
  description:
    'Answers about your 7-day content plan, refunds, delivery, and how Creator OS works.',
}

const FAQS = [
  {
    q: 'How long does it take to get my plan?',
    a: 'About 60 seconds. The moment your payment is confirmed, our AI starts generating your 7-day plan and emails it to you. You can also watch it appear live on the order page.',
  },
  {
    q: 'What if the plan doesn\u2019t match my niche?',
    a: 'Every plan is built from the answers you gave us \u2014 your niche, product, audience, tone, and goal. If something feels off, click "Report an issue" at the bottom of your plan page and we\u2019ll reply within 24 hours. We may regenerate it at no extra cost.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Yes. If your plan is unusable \u2014 wrong niche, wrong language, or duplicated content \u2014 contact us within 7 days of purchase and we\u2019ll refund you in full.',
  },
  {
    q: 'How is this different from asking ChatGPT?',
    a: 'Three things: (1) Every plan passes a quality layer with 10+ automated checks \u2014 fact safety, niche relevance, constraint compliance. (2) You get a shareable plan page, not a chat that disappears. (3) It\u2019s purpose-built for short-form creators \u2014 hooks, visual direction, posting times, and hashtags for TikTok, Reels, and Shorts.',
  },
  {
    q: 'Do I need to film my face?',
    a: 'No. Choose "no face" during the quiz and every day in your plan will avoid talking-head shots, direct eye contact, and face-to-camera angles. You\u2019ll get hands-only shots, product close-ups, B-roll, and text-on-screen directions instead.',
  },
  {
    q: 'Can I reuse the plan?',
    a: 'Yes. Your plan is yours to keep. Post the content as many times as you want, on any platform you own. No license restrictions, no attribution required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Card (Visa, Mastercard, Amex, and more) through Lemon Squeezy. In Thailand, we also accept PromptPay (690 THB).',
  },
  {
    q: 'What if I never receive the email?',
    a: 'Check your spam folder first. If it\u2019s not there after 5 minutes, use the "Report an issue" button on your order page \u2014 or reach out via our contact page. We\u2019ll resend it manually and confirm delivery.',
  },
]

export default function FaqPage() {
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
            Get started →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Help center
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
            Questions,
            <br />
            <span className="italic text-[#6B6259]">answered.</span>
          </h1>
          <p className="text-[#6B6259] text-base md:text-lg leading-relaxed max-w-2xl">
            Everything you need to know before and after your purchase.
            Still stuck? Head to our{' '}
            <Link
              href="/contact"
              className="text-[#D97757] underline hover:no-underline"
            >
              contact page
            </Link>{' '}
            — we reply within 24 hours.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <details
              key={i}
              className="group bg-white border border-[#E8E1D6] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(26,22,20,0.03)] open:shadow-[0_4px_16px_rgba(26,22,20,0.06)] transition-shadow"
            >
              <summary className="cursor-pointer list-none px-6 py-5 flex items-start gap-4 hover:bg-[#FAF7F2]/50 transition-colors">
                <span className="font-mono text-xs text-[#A39B8F] mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-medium text-[#1A1614] text-base md:text-lg leading-snug">
                  {item.q}
                </span>
                <span
                  className="mt-1 shrink-0 text-[#A39B8F] group-open:text-[#D97757] transition-colors"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 transition-transform group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 pl-[3.6rem] text-[#3F3A35] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 bg-white border border-[#E8E1D6] rounded-2xl p-8 md:p-10 text-center shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <h2 className="font-serif text-2xl md:text-3xl text-[#1A1614] mb-3">
            Still have a question?
          </h2>
          <p className="text-[#6B6259] mb-6 max-w-md mx-auto">
            Send us a message and we&apos;ll reply within 24 hours
            (Mon&ndash;Fri).
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#1A1614] text-[#FAF7F2] px-6 py-3.5 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
          >
            Contact us →
          </Link>
        </div>
      </main>
    </div>
  )
}