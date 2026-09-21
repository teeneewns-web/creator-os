import Link from 'next/link'

export default function TermsPage() {
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
          <div className="text-xs uppercase tracking-widest text-[#D97757] mb-3">Legal</div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">Terms of Service</h1>
          <p className="text-[#A39B8F] text-sm">Last updated: September 2026</p>
        </div>
        <div className="space-y-8 text-[#3F3A35] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">What Creator OS provides</h2>
            <p>Creator OS is a digital product that generates personalized 7-day content plans based on information you provide (niche, platform, tone, and goals).</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">What you receive</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>A 7-day content plan with hooks, scripts, captions, and visual direction</li>
              <li>Delivered within minutes after payment confirmation</li>
              <li>Accessible on our website and via email</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">What we don&apos;t guarantee</h2>
            <p>We do not guarantee specific follower growth, revenue, viral content, or view counts. Creator OS provides planning and direction. Your results depend on how you execute.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Payment and delivery</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Payment is one-time. No subscription.</li>
              <li>Your plan is generated automatically after payment confirmation.</li>
              <li>Delivery is typically within minutes. During high-traffic periods, it may take longer.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Refund policy</h2>
            <p>Because Creator OS is a digital product with immediate delivery, all sales are final. If you experience a technical problem, contact us and we&apos;ll make it right.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Your responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Provide accurate information in the quiz</li>
              <li>Use the plans for legitimate purposes</li>
              <li>Don&apos;t attempt to resell our plans as your own</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Changes to these terms</h2>
            <p>We may update these terms from time to time. Significant changes will be communicated via email or on the website.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Contact</h2>
            <p>Questions? Email us at <a href="mailto:teeneewns@gmail.com" className="text-[#D97757] hover:underline">teeneewns@gmail.com</a></p>
          </section>
        </div>
      </main>
    </div>
  )
}