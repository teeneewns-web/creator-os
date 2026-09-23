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
  summary: 'A week of practical, no-guilt fitness content for moms who have 10 minutes, not 2 hours.',
  niche: 'fitness for busy moms',
  platform: 'TikTok',
  goal: 'Grow followers',
  days: [
    {
      day: 1,
      type: 'Personal story',
      hook: "I trained 20 busy moms. Only 3 stuck with it.",
      script: "I trained 20 busy moms. Only 3 stuck with it.\n\nMost moms quit because they try to fit 5 workouts into a schedule that's already full.\n\nThe 3 who stuck with it? They started with 10 minutes.\n\nNot 30. Not an hour. Ten.\n\nHere's what changed for them: they stopped treating workouts like a to-do list and started treating them like a habit.\n\nSame time. Same spot. Every day.\n\nTen minutes is enough. Save this if you needed to hear it.",
      caption: "10 minutes is enough. Here's proof.",
      hashtags: ['busymomfitness', 'momworkout', '10minuteworkout', 'fitnessmotivation', 'momlife'],
      visual: 'Talking head in home setting + b-roll of morning routine',
      posting_time: '6:30 – 8:00 AM local',
    },
    {
      day: 2,
      type: 'Tutorial',
      hook: 'The 10-minute workout that actually works.',
      script: "Here's the 10-minute workout I give every busy mom.\n\nMinute 1-2: Bodyweight squats.\nMinute 3-4: Push-ups or knee push-ups.\nMinute 5-6: Reverse lunges.\nMinute 7-8: Plank hold.\nMinute 9-10: Jumping jacks or fast walk in place.\n\nNo equipment. No commute. No excuses.\n\nDo this 4 times a week and you'll feel it in 10 days.\n\nFollow for the full schedule.",
      caption: '10 minutes, 5 moves, zero equipment.',
      hashtags: ['10minuteworkout', 'homeworkout', 'busymom', 'noequipmentworkout', 'momfitness'],
      visual: 'Screen recording style + timer overlay. Split screen showing each move.',
      posting_time: '12:00 – 1:00 PM local',
    },
    {
      day: 3,
      type: 'Hot take',
      hook: '"No time" is not the real reason you\'re not working out.',
      script: "You have time. You're just not prioritizing it.\n\nI know that sounds harsh. But hear me out.\n\nIf your kid needed you at 5 AM, you'd be there. If your boss texted at 9 PM, you'd answer.\n\nSo when you say you don't have time to work out, what you're really saying is: it's not a priority yet.\n\nAnd that's okay. But let's be honest about it.\n\nBecause once you decide it matters, 10 minutes will appear.",
      caption: "The real reason you're not working out (it's not time).",
      hashtags: ['momtruth', 'busymomlife', 'fitnessmindset', 'honesty', 'momlife'],
      visual: 'Talking head, direct eye contact, no cuts. Strong delivery.',
      posting_time: '8:00 – 9:00 PM local',
    },
    {
      day: 4,
      type: 'Before / after',
      hook: 'From 0 to 4 workouts a week. In 6 weeks.',
      script: "Six weeks ago, Sarah couldn't finish a plank.\n\nYesterday she held one for 90 seconds.\n\nHere's what she did:\n\nWeek 1-2: 10 min, 3 days a week. That's it.\nWeek 3-4: Added 1 extra day.\nWeek 5-6: Added 2 minutes to each session.\n\nNo extreme diet. No 5 AM gym. No guilt.\n\nJust consistency. Small, boring, repeatable.\n\nShe's not special. You can do the same thing.",
      caption: 'Six weeks. Four workouts a week. Zero guilt.',
      hashtags: ['fitnessjourney', 'mombod', 'progressnotperfection', 'busymom', 'fitover40'],
      visual: 'Split screen before/after. B-roll of client training (with permission).',
      posting_time: '7:00 – 8:30 AM local',
    },
    {
      day: 5,
      type: 'List',
      hook: "3 things I'd tell every mom starting today.",
      script: "If you're a mom starting your fitness journey, here are 3 things I wish I'd known:\n\n1. Start with 10 minutes, not 60. Your goal is consistency, not intensity.\n\n2. Pick the same time every day. Morning, lunch, whenever. Same slot = same habit.\n\n3. Stop weighing yourself. Measure how you feel, how you sleep, how you show up for your kids.\n\nThat's it. Three rules.\n\nSave this for the days you feel like quitting.",
      caption: '3 rules for moms starting their fitness journey.',
      hashtags: ['momfitness', 'fitmom', 'healthymom', 'momtips', 'startingover'],
      visual: 'Text overlay list with voiceover. B-roll of mom doing simple exercises.',
      posting_time: '6:00 – 7:30 AM local',
    },
    {
      day: 6,
      type: 'Behind the scenes',
      hook: "What my client's first week actually looked like.",
      script: "Let me show you what a real first week looks like.\n\nMonday: 10 minutes. Almost quit.\nTuesday: Rest day. Felt guilty.\nWednesday: 10 minutes. Felt easier.\nThursday: Skipped. Felt awful.\nFriday: Came back. 10 minutes.\nSaturday: 12 minutes. On her own.\nSunday: Rest.\n\nThat's it. Two wins, one skip, one comeback.\n\nThis is what progress actually looks like. Messy, human, real.",
      caption: "Real first week. Not a highlight reel.",
      hashtags: ['realfitness', 'honestmom', 'fitnessjourney', 'momlife', 'progress'],
      visual: 'Screenshot of a tracker app + voiceover. Simple, honest.',
      posting_time: '9:00 – 10:00 PM local',
    },
    {
      day: 7,
      type: 'Question',
      hook: "What's stopping you from starting today?",
      script: "Be honest with me.\n\nIs it time? Energy? Kids? Guilt? Not knowing where to start?\n\nI want to know. Because every reason has a workaround.\n\nFive years ago I had the same list.\n\nToday I work out 4 times a week, with two kids, a full-time job, and zero guilt.\n\nIt didn't happen overnight. But it did happen.\n\nDrop your reason in the comments. Let's fix it together.",
      caption: "What's your real reason? Tell me below.",
      hashtags: ['momquestions', 'busymom', 'fitnessblock', 'momlife', 'honestmom'],
      visual: 'Talking head, warm lighting, direct to camera.',
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
            href="/"
            className="text-xs text-[#A39B8F] hover:text-[#1A1614] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FBF0E9] border border-[#E8E1D6] rounded-full px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D97757] font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
            Sample plan
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.02em] mb-4">
            This is what you get.
          </h1>
          <p className="text-lg text-[#6B6259] leading-relaxed max-w-2xl">
            A real example. Every plan is built from your niche, platform,
            tone, and goal — not copy-pasted from a template.
          </p>
        </div>

        <div className="bg-white border border-[#E8E1D6] rounded-2xl p-6 md:p-8 mb-10 shadow-[0_1px_3px_rgba(26,22,20,0.03)]">
          <div className="text-xs uppercase tracking-widest text-[#A39B8F] mb-2">
            Example plan
          </div>
          <div className="font-serif text-2xl md:text-3xl mb-3 text-[#1A1614]">
            {SAMPLE_PLAN.title}
          </div>
          <div className="text-[#6B6259] mb-5">{SAMPLE_PLAN.summary}</div>
          <div className="flex flex-wrap gap-2">
            <Chip>{SAMPLE_PLAN.niche}</Chip>
            <Chip>{SAMPLE_PLAN.platform}</Chip>
            <Chip>{SAMPLE_PLAN.goal}</Chip>
          </div>
        </div>

        <div className="space-y-4">
          {SAMPLE_PLAN.days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>

        <div className="mt-16 bg-[#1A1614] text-white rounded-3xl p-10 md:p-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            Want a plan built for <span className="italic text-[#D97757]">your</span> niche?
          </h2>
          <p className="text-[#A39B8F] mb-8 max-w-md mx-auto">
            Answer 5 questions. Get a personalized 7-day plan in about a minute.
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 bg-[#FAF7F2] text-[#1A1614] px-6 py-3.5 rounded-xl font-medium hover:bg-white transition-colors"
          >
            Create my 7-day plan
            <span aria-hidden>→</span>
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