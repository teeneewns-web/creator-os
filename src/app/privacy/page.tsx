import Link from 'next/link'

export default function PrivacyPage() {
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
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">Privacy Policy</h1>
          <p className="text-[#A39B8F] text-sm">Last updated: September 2026</p>
        </div>
        <div className="space-y-8 text-[#3F3A35] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">What we collect</h2>
            <p>When you create a 7-day content plan, we collect:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Your email address</li>
              <li>Your content preferences (platform, niche, tone, goal)</li>
              <li>Your payment confirmation</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">How we use your information</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Generate your personalized content plan</li>
              <li>Send your plan to your email</li>
              <li>Process your payment</li>
              <li>Provide customer support if you contact us</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">What we don&apos;t do</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>We don&apos;t sell your data</li>
              <li>We don&apos;t share your data with advertisers</li>
              <li>We don&apos;t use your data to train AI models</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Third-party services</h2>
            <p>We use trusted third-party services to operate: AI content generation, email delivery, payment processing, and database storage. Each has its own privacy policy.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Data retention</h2>
            <p>We keep your order information as long as needed to provide the service and comply with legal obligations. You can request deletion at any time.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3 text-[#1A1614]">Your rights</h2>
            <p>You can request to access, correct, or delete your data by contacting us.</p>
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