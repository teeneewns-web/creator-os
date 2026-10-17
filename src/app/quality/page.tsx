import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quality Gate — Creator OS',
  description: 'Why Creator OS is different: 10+ automated quality checks so you never post generic AI slop.',
}

export default function QualityPage() {
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
            The Quality Gate
          </div>
          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
            Why our AI doesn't
            <br />
            <span className="italic text-[#6B6259]">sound like AI.</span>
          </h1>
          <p className="text-[#6B6259] text-lg max-w-xl mx-auto leading-relaxed">
            Anyone can ask ChatGPT for a script. But raw AI output is generic, repetitive, and often hallucinates facts.
            We built a 10-layer Quality Gate to fix that.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {[
            { title: 'Fact Safety', desc: 'No fake stories, no invented numbers, no imaginary clients. If you didn’t tell us, we don’t say it.' },
            { title: 'Niche Lock', desc: 'Every single day must reference your niche and product. If it’s generic, it fails.' },
            { title: 'Constraint Compliance', desc: 'No face? No voice? Phone only? The AI is strictly blocked from suggesting equipment you don’t have.' },
            { title: 'Goal Alignment', desc: 'If you want sales, we check that 4+ days have a product CTA. If you want followers, we cap “follow me” prompts.' },
            { title: 'Hook Diversity', desc: 'We check that the first 4 words of every hook are unique across all 7 days.' },
            { title: 'Format & Hashtags', desc: 'Hashtags are de-duplicated, spaces removed, and formatting is strictly enforced.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[#E8E1D6] rounded-2xl p-6 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
              <div className="w-8 h-8 rounded-lg bg-[#FBF0E9] flex items-center justify-center mb-4 text-[#D97757] font-serif font-bold">
                {i + 1}
              </div>
              <h3 className="font-medium text-[#1A1614] mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B6259] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1614] text-[#FAF7F2] rounded-3xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            The Creator OS difference.
          </h2>
          <p className="text-[#A39B8F] mb-8 max-w-lg mx-auto leading-relaxed">
            ChatGPT gives you a chat that disappears. We give you a quality-checked, persistent 7-day plan that actually matches your business.
          </p>
          <Link
            href="/start"
            className="inline-block bg-[#D97757] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#C66846] transition-colors"
          >
            Create my 7-day plan →
          </Link>
        </div>
      </main>
    </div>
  )
}