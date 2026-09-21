import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="border-b border-[#E8E1D6] bg-[#FAF7F2]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#1A1614] flex items-center justify-center text-[#FAF7F2] text-xs font-semibold">C</div>
            <span className="font-medium tracking-tight text-[15px] text-[#1A1614]">Creator OS</span>
          </Link>
          <Link href="/" className="text-xs text-[#A39B8F] hover:text-[#1A1614] transition-colors">← Back</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-[#D97757] mb-3">Support</div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">Get in touch</h1>
          <p className="text-[#6B6259] text-lg">Questions, feedback, or need help with an order? We reply within 24 hours.</p>
        </div>
        <div className="grid gap-4 mb-12">
          <a href="mailto:teeneewns@gmail.com" className="block bg-white border border-[#E8E1D6] rounded-2xl p-6 hover:border-[#D4CBB9] hover:shadow-[0_4px_16px_rgba(26,22,20,0.06)] transition-all">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">Email</div>
            <div className="text-lg font-medium text-[#1A1614]">teeneewns@gmail.com</div>
            <div className="text-sm text-[#6B6259] mt-2">Best for order issues, refunds, and detailed questions.</div>
          </a>
        </div>
        <section className="bg-[#FBF0E9] border border-[#E8E1D6] rounded-2xl p-8">
          <h2 className="font-serif text-2xl mb-4 text-[#1A1614]">Common questions</h2>
          <div className="space-y-5 text-[15px] text-[#3F3A35]">
            <div>
              <div className="font-medium text-[#1A1614] mb-1">My plan didn&apos;t arrive</div>
              <p>Check your spam folder first. If it&apos;s not there, email us with your Order ID.</p>
            </div>
            <div>
              <div className="font-medium text-[#1A1614] mb-1">I want a different plan</div>
              <p>Reply to your order email and describe what you want changed. We&apos;ll regenerate it once, free.</p>
            </div>
            <div>
              <div className="font-medium text-[#1A1614] mb-1">I need a refund</div>
              <p>Because plans are digital and delivered instantly, all sales are final. If there&apos;s a technical problem, contact us and we&apos;ll make it right.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}