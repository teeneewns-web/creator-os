import Link from 'next/link'

type DayPlan = {
  day: number
  type: string
  hook: string
  script: string
  caption: string
  hashtags: string[]
  visual: string
  posting_time: string
}

const SAMPLE_PLAN = {
  title: 'Fitness for Busy Moms — Week 1',
  summary:
    'A week of practical, no-guilt fitness content for moms who have 10 minutes, not 2 hours.',
  niche: 'fitness for busy moms',
  platform: 'TikTok',
  goal: 'Grow followers',
  days: [
    {
      day: 1,
      type: 'Hot take',
      hook: 'Most moms quit fitness in week two. Here is why.',
      script: `Most moms quit fitness in week two. Not because they are lazy. Because they picked the wrong starting point.

The pattern is always the same: start with 45 minutes, five days a week. Feel great for three days. Miss one day. Feel guilty. Miss two more. Quit.

The fix is boring, and it works: start with 10 minutes.

Not 30. Not an hour. Ten. Same time, same spot, every day.

Ten minutes is small enough that you cannot talk yourself out of it. And after two weeks, your brain stops negotiating.

Save this if you needed to hear it today.`,
      caption: "10 minutes beats 45 you'll quit. Every time.",
      hashtags: [
        'busymomfitness',
        'momworkout',
        '10minuteworkout',
        'fitnessmotivation',
        'momlife',
      ],
      visual:
        'Talking head in home setting + b-roll of morning routine. Anchor hook in first 2 seconds.',
      posting_time: '6:30 – 8:00 AM local',
    },
    {
      day: 2,
      type: 'Tutorial',
      hook: 'The 10-minute workout that actually works.',
      script: `Here is a 10-minute workout you can do in your living room, no equipment, no commute.

Minute 1-2: Bodyweight squats.
Minute 3-4: Push-ups or knee push-ups.
Minute 5-6: Reverse lunges.
Minute 7-8: Plank hold.
Minute 9-10: Jumping jacks or fast walk in place.

That is it. Five moves, ten minutes.

Do this four times a week and you will feel it in ten days. Not because the workout is magic. Because you actually did it.

Follow for the full weekly schedule.`,
      caption: '10 minutes, 5 moves, zero equipment.',
      hashtags: [
        '10minuteworkout',
        'homeworkout',
        'busymom',
        'noequipmentworkout',
        'momfitness',
      ],
      visual:
        'Screen recording style + timer overlay. Split screen showing each move. Add text overlay for each move name at start.',
      posting_time: '12:00 – 1:00 PM local',
    },
    {
      day: 3,
      type: 'Hot take',
      hook: '"No time" is not the real reason you are not working out.',
      script: `You have time. You are just not prioritizing it.

I know that sounds harsh. But hear me out.

If your kid needed you at 5 AM, you would be there. If your boss texted at 9 PM, you would answer.

So when you say you do not have time to work out, what you are really saying is: it is not a priority yet.

And that is okay. But let's be honest about it.

Because once you decide it matters, 10 minutes will appear.`,
      caption: 'The real reason you are not working out (it is not time).',
      hashtags: [
        'momtruth',
        'busymomlife',
        'fitnessmindset',
        'honesty',
        'momlife',
      ],
      visual:
        'Talking head, direct eye contact, no cuts. Strong delivery. Cut on the word "yet" for emphasis.',
      posting_time: '8:00 – 9:00 PM local',
    },
    {
      day: 4,
      type: 'Framework',
      hook: 'The six-week rule nobody tells busy moms.',
      script: `Six weeks. That is how long it takes before a 10-minute workout stops feeling optional.

Week 1-2: Three days a week. Ten minutes. That is the whole goal.
Week 3-4: Add a fourth day. Do not increase the time yet.
Week 5-6: Add two minutes to each session.

Notice what is missing: no extreme diet, no 5 AM gym, no guilt.

The goal is not intensity. The goal is that by week six, missing a workout feels wrong.

You are not behind. You are just at week one.`,
      caption: 'Six weeks. Four workouts a week. Zero guilt.',
      hashtags: [
        'fitnessjourney',
        'mombod',
        'progressnotperfection',
        'busymom',
        'fitover40',
      ],
      visual:
        'Clean text overlay showing the 3 phases with a timer. Voiceover explaining each phase. No face required.',
      posting_time: '7:00 – 8:30 AM local',
    },
    {
      day: 5,
      type: 'List',
      hook: '3 things I would tell every mom starting today.',
      script: `If you are a mom starting your fitness journey, here are three things that matter more than any workout plan:

1. Start with 10 minutes, not 60. Your goal is consistency, not intensity.

2. Pick the same time every day. Morning, lunch, whenever. Same slot equals same habit.

3. Stop weighing yourself. Measure how you feel, how you sleep, how you show up for your kids.

That is it. Three rules.

Save this for the days you feel like quitting.`,
      caption: '3 rules for moms starting their fitness journey.',
      hashtags: [
        'momfitness',
        'fitmom',
        'healthymom',
        'momtips',
        'startingover',
      ],
      visual:
        'Text overlay list with voiceover. B-roll of mom doing simple exercises. Add number badge animations.',
      posting_time: '6:00 – 7:30 AM local',
    },
    {
      day: 6,
      type: 'Behind the scenes',
      hook: 'What a realistic week one actually looks like.',
      script: `Here is what week one usually looks like, not the highlight reel.

Monday: Ten minutes. Almost quit.
Tuesday: Rest day. Felt guilty.
Wednesday: Ten minutes. Felt easier.
Thursday: Skipped. Felt awful.
Friday: Came back. Ten minutes.
Saturday: Twelve minutes. On your own.
Sunday: Rest.

That is it. Two wins, one skip, one comeback.

This is what progress actually looks like. Messy, human, real.

If this was your week, you are not failing. You are doing it.`,
      caption: 'Real first week. Not a highlight reel.',
      hashtags: [
        'realfitness',
        'honestmom',
        'fitnessjourney',
        'momlife',
        'progress',
      ],
      visual:
        'Simple calendar-style animation with voiceover. Show each day one by one with a checkmark or X.',
      posting_time: '9:00 – 10:00 PM local',
    },
    {
      day: 7,
      type: 'Question',
      hook: 'What is stopping you from starting today?',
      script: `Be honest with me.

Is it time? Energy? Kids? Guilt? Not knowing where to start?

I want to know. Because every reason has a workaround.

Time? Ten minutes.
Energy? Do it seated.
Kids? Workout with them watching.
Guilt? That is the one we need to talk about.

Drop your reason in the comments. Let's fix it together.`,
      caption: 'What is your real reason? Tell me below.',
      hashtags: [
        'momquestions',
        'busymom',
        'fitnessblock',
        'momlife',
        'honestmom',
      ],
      visual:
        'Talking head, warm lighting, direct to camera. Reply to first 10 comments within an hour to boost reach.',
      posting_time: '8:30 – 9:30 PM local',
    },
  ],
}

export default function SamplesPage() {
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
            Create my own →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Sample plan
          </div>
          <h1 className="font-serif text-3xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4 text-[#1A1614]">
            {SAMPLE_PLAN.title}
          </h1>
          <p className="text-base md:text-lg text-[#6B6259] leading-relaxed mb-6">
            {SAMPLE_PLAN.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            <Chip>Niche: {SAMPLE_PLAN.niche}</Chip>
            <Chip>Platform: {SAMPLE_PLAN.platform}</Chip>
            <Chip>Goal: {SAMPLE_PLAN.goal}</Chip>
          </div>

          <p className="text-xs text-[#A39B8F] mt-6 italic">
            A real example of the output. Yours is built from your own
            answers.
          </p>
        </div>

        <div className="space-y-4">
          {SAMPLE_PLAN.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E1D6] text-center">
          <p className="text-sm text-[#A39B8F] mb-4">
            Want a plan built for your niche?
          </p>
          <Link
            href="/start"
            className="inline-block bg-[#1A1614] text-[#FAF7F2] px-6 py-3.5 rounded-xl font-medium hover:bg-[#2A2521] transition-colors"
          >
            Create my 7-day plan →
          </Link>
        </div>
      </main>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-[#FAF7F2] border border-[#E8E1D6] text-[#6B6259] px-3 py-1.5 rounded-full">
      {children}
    </span>
  )
}

function DayCard({ day }: { day: DayPlan }) {
  return (
    <article className="bg-white border border-[#E8E1D6] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
      <div className="px-6 py-4 border-b border-[#E8E1D6] flex items-center justify-between bg-[#FAF7F2]/60">
        <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[#D97757] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
          Day {String(day.day).padStart(2, '0')}
        </div>
        <div className="text-xs text-[#A39B8F]">{day.type}</div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
            Hook
          </div>
          <div className="font-serif text-xl md:text-2xl leading-snug text-[#1A1614]">
            {day.hook}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
            Script
          </div>
          <p className="text-[#3F3A35] whitespace-pre-wrap leading-relaxed">
            {day.script}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-[#E8E1D6]">
          <MetaBox label="Caption">{day.caption}</MetaBox>
          <MetaBox label="Post at">{day.posting_time}</MetaBox>
          <div className="sm:col-span-2">
            <MetaBox label="Visual direction">{day.visual}</MetaBox>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
              Hashtags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {day.hashtags.map((h) => (
                <span
                  key={h}
                  className="bg-[#FAF7F2] border border-[#E8E1D6] text-[#6B6259] px-2.5 py-1 rounded-full text-xs font-mono"
                >
                  #{h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
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