import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* ============ HEADER ============ */}
      <header className="border-b border-[#E8E1D6] bg-[#FAF7F2]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#1A1614] flex items-center justify-center text-[#FAF7F2] text-xs font-semibold">
              C
            </div>
            <span className="font-medium tracking-tight text-[15px] text-[#1A1614]">
              Creator OS
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#preview"
              className="px-4 py-2 rounded-full text-sm text-[#6B6259] border border-transparent hover:text-[#1A1614] hover:bg-white hover:border-[#E8E1D6] transition-all"
            >
              Preview
            </a>
            <a
              href="#how"
              className="px-4 py-2 rounded-full text-sm text-[#6B6259] border border-transparent hover:text-[#1A1614] hover:bg-white hover:border-[#E8E1D6] transition-all"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="px-4 py-2 rounded-full text-sm text-[#6B6259] border border-transparent hover:text-[#1A1614] hover:bg-white hover:border-[#E8E1D6] transition-all"
            >
              Pricing
            </a>
            <Link
              href="/start"
              className="ml-2 inline-flex items-center gap-1.5 bg-[#1A1614] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A2521] transition-colors"
            >
              Get started
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="max-w-3xl">
          {/* Bigger, clearer badge */}
          <div className="inline-flex items-center gap-2.5 border border-[#E8E1D6] bg-white rounded-full pl-2 pr-4 py-2 text-[13px] text-[#6B6259] mb-10 shadow-[0_1px_2px_rgba(26,22,20,0.03)]">
            <span className="inline-flex items-center gap-1.5 bg-[#FBF0E9] text-[#D97757] px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              New
            </span>
            Built for TikTok, Reels, and Shorts
          </div>

          {/* Headline with marker highlight on italic line */}
          <h1 className="font-serif text-[clamp(2.5rem,6.5vw,4.75rem)] leading-[1.05] tracking-[-0.02em] mb-7 text-[#1A1614]">
            Know exactly what to post
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic">for the next 7 days.</span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.32em] bg-[#FBF0E9] -z-0"
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#6B6259] max-w-xl mb-10 leading-relaxed">
            Turn your business, audience, and goals into a personalized
            weekly content plan — hooks, scripts, captions, and
            next steps included.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 bg-[#1A1614] text-white px-7 py-4 rounded-xl font-medium hover:bg-[#2A2521] transition-colors shadow-[0_2px_8px_rgba(26,22,20,0.12)]"
            >
              Create my 7-day plan
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/samples"
              className="inline-flex items-center gap-2 bg-white text-[#1A1614] border border-[#E8E1D6] px-7 py-4 rounded-xl font-medium hover:border-[#D4CBB9] hover:bg-[#FFFDFA] transition-colors"
            >
              See a sample plan
            </Link>
          </div>

          {/* Trust line as pills */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E1D6] text-[#6B6259] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              $19 one-time
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E1D6] text-[#6B6259] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3E50]" />
              Delivered in minutes
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E1D6] text-[#6B6259] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A39B8F]" />
              No subscription
            </span>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT PREVIEW ============ */}
      <section id="preview" className="max-w-6xl mx-auto px-6 pb-24 md:pb-32">
        <div className="bg-white border border-[#E8E1D6] rounded-3xl shadow-[0_8px_32px_rgba(26,22,20,0.06)] overflow-hidden">
          {/* Accent top bar */}
          <div className="h-1 bg-gradient-to-r from-[#D97757] via-[#D97757]/60 to-transparent" />

          {/* Window bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8E1D6] bg-[#FAF7F2]/60">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8E1D6]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8E1D6]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8E1D6]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs font-mono text-[#A39B8F]">
                creator-os / week-01
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D97757] font-medium bg-[#FBF0E9] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              Ready
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
                  Your plan
                </div>
                <div className="font-serif text-2xl md:text-3xl tracking-[-0.01em]">
                  Fitness for busy moms
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip>Week 1</Chip>
                <Chip>TikTok</Chip>
                <Chip>Grow followers</Chip>
              </div>
            </div>

            {/* Day 1 */}
            <div className="border-t border-[#E8E1D6] pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 bg-[#FBF0E9] text-[#D97757] px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-widest">
                  Day 01
                </div>
                <div className="flex-1 h-px bg-[#E8E1D6]" />
                <div className="text-xs text-[#A39B8F]">Personal story</div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
                  Hook
                </div>
                <div className="font-serif text-xl md:text-2xl leading-snug text-[#1A1614]">
                  &ldquo;I trained 20 busy moms. Only 3 stuck with it.&rdquo;
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
                  Script
                </div>
                <p className="text-[#3F3A35] leading-relaxed max-w-2xl">
                  Most moms quit because they try to fit 5 workouts a week
                  into a schedule that&rsquo;s already full. The three who
                  stuck with it? They started with 10 minutes. Here&rsquo;s
                  what changed for them&hellip;
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <MetaBox label="Visual">
                  Talking head + b-roll of morning routine
                </MetaBox>
                <MetaBox label="Caption">
                  10 minutes is enough. Here&rsquo;s proof.
                </MetaBox>
                <MetaBox label="Post at">
                  6:30 – 8:00 AM local
                </MetaBox>
              </div>
            </div>

            {/* Days 2-7 */}
            <div className="mt-8 border-t border-[#E8E1D6]">
              {[
                ['02', 'Tutorial', 'The 10-minute workout that actually works'],
                ['03', 'Hot take', 'Why &ldquo;no time&rdquo; isn&rsquo;t the real problem'],
                ['04', 'Before / after', 'From 0 to 4 workouts a week — in 6 weeks'],
                ['05', 'List', '3 things I&rsquo;d tell every mom starting today'],
                ['06', 'Behind the scenes', 'What my client&rsquo;s first week actually looked like'],
                ['07', 'Question', 'What&rsquo;s stopping you from starting?'],
              ].map(([day, type, title]) => (
                <div
                  key={day}
                  className="flex items-center gap-4 py-4 border-b border-[#E8E1D6] last:border-b-0 hover:bg-[#FAF7F2]/60 -mx-3 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-[#A39B8F] w-8">
                    {day}
                  </div>
                  <div className="inline-flex items-center text-[11px] font-medium text-[#D97757] bg-[#FBF0E9] px-2 py-0.5 rounded-full w-32 justify-center hidden sm:inline-flex">
                    {type}
                  </div>
                  <div
                    className="flex-1 text-sm text-[#3F3A35] truncate"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                  <div className="text-[#A39B8F] text-sm">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-[#A39B8F] mt-6">
          A real example. Yours is built from your information.
        </p>
      </section>

      {/* ============ PROBLEM → SOLUTION ============ */}
      <section className="bg-white border-y border-[#E8E1D6]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-28 grid md:grid-cols-2 gap-16 md:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#6B6259] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A39B8F]" />
              Sound familiar?
            </div>
            <ul className="space-y-6">
              {[
                'I open the app, stare at the screen, and close it.',
                'I have a business — but I don&rsquo;t know what to turn into content.',
                'I post for a week, then disappear for two.',
                'I&rsquo;m too busy to plan. So I don&rsquo;t post.',
              ].map((line, i) => (
                <li
                  key={i}
                  className="font-serif text-xl md:text-2xl leading-snug text-[#3F3A35]"
                  dangerouslySetInnerHTML={{
                    __html: `&ldquo;${line}&rdquo;`,
                  }}
                />
              ))}
            </ul>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              What changes with Creator OS
            </div>
            <ul className="space-y-6">
              {[
                'You open the app and see exactly what to post today.',
                'Every piece of content ties back to your business.',
                'You show up 7 days in a row — without deciding anything.',
                'Your plan takes 60 seconds. Not 3 hours.',
              ].map((line, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#FBF0E9] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      viewBox="0 0 16 16"
                      className="w-3.5 h-3.5 text-[#D97757]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 8 7 12 13 4" />
                    </svg>
                  </div>
                  <div className="text-[#1A1614] text-lg leading-relaxed">
                    {line}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ WHAT YOU GET ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            What you get
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-5">
            Everything you need.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic text-[#6B6259]">
                Nothing you don&rsquo;t.
              </span>
              <span
                aria-hidden
                className="absolute left-0 right-0 bottom-[0.08em] h-[0.3em] bg-[#FBF0E9] -z-0"
              />
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['7 hooks', 'Written to stop the scroll in the first 3 seconds.'],
            ['7 scripts', 'Word-for-word. 30–60 seconds. Ready to read aloud.'],
            ['Captions + hashtags', 'Tuned to your platform. Not copy-pasted.'],
            ['Visual direction', 'B-roll and on-screen text for each day.'],
            ['Posting time slots', 'So you show up when your audience does.'],
            ['Backup option', 'A second angle if you can&rsquo;t film the first.'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white border border-[#E8E1D6] rounded-2xl p-6 shadow-[0_1px_3px_rgba(26,22,20,0.03)] hover:border-[#D4CBB9] hover:shadow-[0_4px_16px_rgba(26,22,20,0.06)] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FBF0E9] flex items-center justify-center mb-4">
                <div className="w-2 h-2 rounded-full bg-[#D97757]" />
              </div>
              <div className="font-medium text-[#1A1614] mb-1.5">
                {title}
              </div>
              <div
                className="text-sm text-[#6B6259] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section
        id="how"
        className="bg-white border-y border-[#E8E1D6]"
      >
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              How it works
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
              Three steps. About a minute.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              [
                '01',
                'Tell us about your content',
                'Five quick questions. Your niche, tone, platform, and goal.',
              ],
              [
                '02',
                'Checkout in seconds',
                'One-time payment. Card or PromptPay. No subscription.',
              ],
              [
                '03',
                'Get your 7-day plan',
                'Ready in about 60 seconds. Emailed and on-screen.',
              ],
            ].map(([n, title, desc]) => (
              <div
                key={n}
                className="bg-[#FAF7F2] border border-[#E8E1D6] rounded-2xl p-8"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#E8E1D6] font-serif text-xl text-[#D97757] mb-6">
                  {n}
                </div>
                <div className="text-xl font-medium text-[#1A1614] mb-2 tracking-tight">
                  {title}
                </div>
                <div className="text-[#6B6259] leading-relaxed text-[15px]">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHO IT IS FOR ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Who it&rsquo;s for
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em]">
            Built for people who post — or want to.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E8E1D6] rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#6B6259] font-medium mb-5">
              Just starting
            </div>
            <div className="font-serif text-2xl md:text-3xl leading-tight mb-5">
              You want to post consistently.
              <br />
              <span className="italic text-[#6B6259]">
                You just don&rsquo;t know where to start.
              </span>
            </div>
            <ul className="space-y-3 text-[#6B6259] text-[15px] leading-relaxed">
              <li>· No expensive equipment required</li>
              <li>· No prompt writing</li>
              <li>· No content strategy background</li>
            </ul>
          </div>

          <div className="bg-white border border-[#E8E1D6] rounded-2xl p-8 md:p-10 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#6B6259] font-medium mb-5">
              Already creating
            </div>
            <div className="font-serif text-2xl md:text-3xl leading-tight mb-5">
              You have a business.
              <br />
              <span className="italic text-[#6B6259]">
                You need content that sells it.
              </span>
            </div>
            <ul className="space-y-3 text-[#6B6259] text-[15px] leading-relaxed">
              <li>· Every piece ties to an offer or goal</li>
              <li>· Weekly variety — no repeating the same angle</li>
              <li>· Fits inside a busy schedule</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section
        id="pricing"
        className="bg-white border-y border-[#E8E1D6]"
      >
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Pricing
          </div>
          <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-6">
            One plan. One price.
          </h2>
          <p className="text-[#6B6259] text-lg max-w-lg mx-auto mb-12">
            No subscription. No hidden fees. Yours to keep and reuse.
          </p>

          <div className="inline-block text-left bg-[#FAF7F2] border border-[#E8E1D6] rounded-3xl p-10 md:p-12 min-w-[320px] shadow-[0_8px_32px_rgba(26,22,20,0.06)]">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#6B6259] font-medium mb-5">
              7-Day Content Plan
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-serif text-6xl tracking-[-0.02em]">
                $19
              </span>
              <span className="text-[#6B6259] text-lg">USD</span>
            </div>
            <ul className="space-y-3 mb-10 text-[15px] text-[#3F3A35]">
              {[
                '7 days of hooks, scripts, captions',
                'Visual direction for every day',
                'Posting time recommendations',
                'Delivered in minutes',
                'One-time payment',
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
              className="inline-flex items-center justify-center gap-2 w-full bg-[#1A1614] text-white px-6 py-4 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
            >
              Create my 7-day plan
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-[#1A1614] text-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              $19 · One-time
            </div>
            <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-6">
              Stop deciding.
              <br />
              <span className="italic text-[#D97757]">Start posting.</span>
            </h2>
            <p className="text-[#A39B8F] text-lg mb-10 max-w-md leading-relaxed">
              Your first 7-day plan is 60 seconds away.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/start"
                className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#1A1614] px-7 py-4 rounded-xl font-medium hover:bg-white transition-colors"
              >
                Create my 7-day plan
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="#preview"
                className="inline-flex items-center gap-2 border border-white/15 text-[#FAF7F2] px-7 py-4 rounded-xl font-medium hover:bg-white/5 transition-colors"
              >
                See a sample
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#E8E1D6] bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-wrap items-center justify-between gap-6 text-sm text-[#A39B8F]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#1A1614] flex items-center justify-center text-[#FAF7F2] text-[10px] font-semibold">
              C
            </div>
            <span>© {new Date().getFullYear()} Creator OS</span>
          </div>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-[#1A1614] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#1A1614] transition-colors">
              Privacy
            </Link>

            <Link href="/contact" className="hover:text-[#1A1614] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ============ Small helpers ============ */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-[#FAF7F2] border border-[#E8E1D6] text-[#6B6259] px-3 py-1.5 rounded-full">
      {children}
    </span>
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