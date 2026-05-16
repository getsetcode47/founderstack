import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AlarmClock,
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  Cloud,
  Coins,
  Cpu,
  DollarSign,
  Gauge,
  Gift,
  GraduationCap,
  Hourglass,
  Megaphone,
  Palette,
  Quote,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from 'lucide-react';
import { HomeFeaturedDealsClient } from '@/components/landing/HomeFeaturedDealsClient';
import { HomePricingSection } from '@/components/landing/HomePricingSection';
import { getHomepageFeaturedDeals } from '@/lib/site-data';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

const TRUST_STATS = [
  ['500+', 'verified deals'],
  ['$10M+', 'in perks found'],
  ['47', 'new deals today'],
  ['24/7', 'AI scanning the internet'],
];

const PROBLEM_CARDS: ReadonlyArray<[string, string, typeof AlarmClock]> = [
  ['Hours Wasted', 'Manually searching for deals across 200+ sites', AlarmClock],
  ['Deals Missed', "By the time you find them, they've expired", Search],
  ['Money Left', 'On the table — every single month', DollarSign],
];

const SOLUTION_FEATURES: ReadonlyArray<[string, string, typeof Bot]> = [
  [
    'Always On, Always Hunting',
    'Our AI runs 24 hours a day, 7 days a week, 365 days a year. While you focus on building, it scours startup programs, SaaS partner pages, accelerator portals, cloud provider deals, and hundreds more sources — so you never miss a perk again.',
    Bot,
  ],
  [
    'Real-Time Deal Discovery',
    'Every single day our AI surfaces new deals — free credits, discounts, perks, and grants — and adds them to your personal dashboard the moment they go live. You get alerted instantly before anyone else.',
    Zap,
  ],
  [
    'Verified, Not Scraped',
    'Every deal our AI finds is verified before it reaches you. No broken links. No expired codes. No fake savings. Only real, claimable, live offers — confirmed working.',
    ShieldCheck,
  ],
  [
    'Matched To Your Stack',
    'Tell us what tools you use or want to use. Our AI personalises your deal feed so you only see the savings that matter to your specific startup — filtered by stage, category, and tool stack.',
    Cpu,
  ],
  [
    'Claimed Before They Run Out',
    'Many deals have limits — first 5,000 users, or only for Series A and below. Our AI tracks availability in real time and alerts you the moment a high-value deal goes live, so you’re always first in line.',
    Hourglass,
  ],
  [
    'Tracks Your Total Savings',
    'Every deal you claim is logged. You get a live savings dashboard showing exactly how much your membership has made you. Most founders see ROI within the first 5 minutes of joining.',
    Gauge,
  ],
];

const CATEGORIES: ReadonlyArray<[string, string, typeof Cloud]> = [
  ['Cloud Credits', 'AWS, GCP, Azure — up to $200K free', Cloud],
  ['AI Tool Credits', 'OpenAI, Anthropic, Gemini — real API credits', Bot],
  ['SaaS Discounts', '90% off HubSpot, Notion, ClickUp + more', Briefcase],
  ['Accelerators & Programs', 'YC, Techstars, Antler — application guides & perks', Sparkles],
  ['Non-Dilutive Grants', 'Up to $2M in free government funding', Coins],
  ['Dev Tool Deals', 'GitHub, GitLab, Vercel, Supabase — months free', Wrench],
  ['Marketing Tools', 'Brevo, Apollo, Instantly — huge cuts', Megaphone],
  ['Design & Creative', 'Figma, Framer, Webflow, Canva — full access free', Palette],
  ['Legal & Finance', 'Stripe, Xero, Brex, Ramp — fee waivers', Scale],
  ['Learning & Upskilling', 'Courses, bootcamps, certifications — deep cuts', GraduationCap],
];

const LIVE_NUMBERS_TOP = [
  ['$10,000,000+', 'Total perk value found by our AI'],
  ['500+', 'Verified deals in the hub'],
  ['47', 'New deals added today'],
  ['12,000+', 'Founders saving right now'],
];

const LIVE_NUMBERS_BOTTOM = [
  ['$50,000', 'Zendesk free for startups'],
  ['$100,000', 'AWS Activate in free credits'],
  ['6 months', 'Notion completely free'],
  ['90%', 'Off HubSpot first year'],
];

const HOW_STEPS = [
  [
    'Step 1 — Join in 60 Seconds',
    "Create your free account. Tell us about your startup stage, your current tool stack, and what you're looking for. Takes less than a minute.",
  ],
  [
    'Step 2 — Your AI Agent Gets to Work',
    'Immediately, your personal deal agent starts scanning. It maps your stack, finds every eligible deal across 500+ sources, and builds your personalised savings dashboard — loaded with ready-to-claim offers.',
  ],
  [
    'Step 3 — Claim, Save, Repeat',
    "Every morning you wake up to fresh deals in your inbox. Click. Claim. Save. Our AI never stops — so every day there's something new waiting for you.",
  ],
];

const TESTIMONIALS = [
  [
    "I joined, the AI found me $12,000 in Notion credits and $100K in AWS within the first 10 minutes. The membership pays for itself 10,000x over.",
    'Rahul K., SaaS Founder, Series A',
  ],
  [
    'I had no idea how many deals existed for startups. The AI literally found me a $50,000 Zendesk deal I would have never discovered on my own. Mind-blowing.',
    'Priya S., Founder, EdTech Startup',
  ],
  [
    "The ROI on this is insane. $10/month and I've already saved over $30,000 on tools I was going to pay full price for. Every bootstrapped founder needs this.",
    'Aman T., Indie Hacker',
  ],
  [
    'I spent weeks manually searching for startup perks. FounderStackHub’s AI does it better in seconds. Found a $15K non-dilutive grant I never knew existed.',
    'Sarah W., Pre-Seed Founder',
  ],
  [
    'My co-founder thought I was joking when I said we saved $87,000 in the first month. Then I showed him the dashboard. He signed up immediately.',
    'James O., CTO, FinTech Startup',
  ],
  [
    'This is the most underpriced product I’ve ever used. $50/year for $500,000+ in savings potential? It’s not even a decision. Just sign up.',
    'Dev M., Bootstrapped Founder',
  ],
];

const COMPARISON_ROWS = [
  ['FounderStackHub', '$10/mo', 'Yes', 'Yes', '500+', 'Yes', 'Yes', 'Yes'],
  ['GetAIPerks', '$149/yr', 'No', 'No', '220+', 'No', 'No', 'No'],
  ['FounderPass', '$99/yr', 'No', 'No', '350+', 'No', 'No', 'Yes'],
  ['Freelance Stack', '€55/yr', 'No', 'No', '850+', 'No', 'No', 'Yes'],
];

const FAQS = [
  'What do I get with a membership?',
  "What's the difference between Pro Monthly and Pro Annual?",
  'How are you different from GetAIPerks or FounderPass?',
  'Are the perks real and verified?',
  'Do you offer a refund?',
  'How does the AI deal matching work?',
];

export const metadata: Metadata = {
  title: 'FounderStackHub — AI Startup Perks Matched To Your Stack',
  description:
    'Founder Stack Hub helps founders stop overpaying for software by matching their startup stage, stack, and goals with relevant startup perks, cloud credits, and AI-tool offers.',
  openGraph: {
    title: 'FounderStackHub — AI Startup Perks Matched To Your Stack',
    description:
      'Tell us what you are building and FounderStackHub matches you with relevant startup perks, cloud credits, and founder savings opportunities.',
    images: [{ url: 'https://founderstackhub.com/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FounderStackHub — AI Startup Perks Matched To Your Stack',
    description:
      'AI startup perks, cloud credits, and software savings matched to what your startup is building.',
    images: [{ url: 'https://founderstackhub.com/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
};

export default async function HomePage() {
  const featuredDeals = await getHomepageFeaturedDeals();

  return (
    <main className="bg-[#07111f] text-white">
      <AnnouncementBar />
      <HeroSection />
      <SocialProofTicker />
      <ProblemSection />
      <SolutionSection />
      <CategoriesSection />
      <LiveNumbersSection />
      <FeaturedDealsSection deals={featuredDeals} />
      <HowItWorksSection />
      <TestimonialsSection />
      <HomePricingSection />
      <ComparisonSection />
      <UrgencySection />
      <FinalCtaSection />
      <FaqSection />
    </main>
  );
}

function AnnouncementBar() {
  return (
    <section className="border-b border-cyan-400/10 bg-cyan-500/10 pt-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-center text-sm text-cyan-100 sm:flex-row sm:px-6 lg:px-8">
        <p>
          🤖 Our AI just matched 47 new startup savings opportunities in the last 24 hours — $2.3M in fresh value added today
        </p>
        <Link href="/free-deals" className="inline-flex items-center gap-2 font-semibold text-white hover:text-cyan-200">
          Run the audit <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgba(56,189,248,0.28), transparent 32%), radial-gradient(circle at 82% 24%, rgba(99,102,241,0.22), transparent 32%), radial-gradient(circle at 50% 100%, rgba(249,115,22,0.16), transparent 45%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/10 bg-black/35 px-6 py-14 backdrop-blur-xl sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              AI Startup Savings Audit — Built For Founders
            </span>

            <h1 className="mt-8 text-5xl font-bold leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              AI Startup Perks
              <br />
              Matched To
              <br />
              Your Stack.
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Tell us what you&apos;re building, your stage, and the tools you use. FounderStackHub helps you uncover relevant cloud credits, AI-tool offers, SaaS discounts, and founder-only perks without manually searching hundreds of scattered startup pages.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-slate-400">You get a startup savings workflow. Not a static deals list.</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/free-deals"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-base font-semibold text-black transition hover:bg-slate-100"
              >
                🚀 Run My Free Savings Audit
              </Link>
              <Link
                href="/deals"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Browse Live Founder Offers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-400">Already saving 12,000+ founders every week</p>

            <div className="mt-12 grid gap-4 sm:grid-cols-4">
              {TRUST_STATS.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5">
                  <p className="text-3xl font-bold text-white">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProofTicker() {
  const items = [
    'Saved $12K on Notion in 60 seconds',
    'Found an AWS deal I never knew existed',
    'The AI found me $50K in Zendesk credits',
    'I made back the cost in the first 5 minutes',
    'This is insane — $10K GitHub credits unlocked',
  ];

  return (
    <section className="border-y border-white/5 bg-black/30 py-5">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex min-w-max items-center gap-10 whitespace-nowrap animate-[ticker_34s_linear_infinite] text-sm text-slate-300">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
              <span>&ldquo;{item}&rdquo;</span>
              <span className="text-slate-600">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            Why Founders Lose Money Every Day
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            $10,000,000+ in Free Perks Exist Right Now.
            <br />
            Most Founders Never Find Them.
          </h2>
          <div className="mt-8 max-w-3xl space-y-4 text-lg leading-8 text-slate-300">
            <p>AWS gives away $100,000 in credits. Notion hands out 6 months free. GitHub offers $10,000 to eligible startups. Zendesk gives $50,000 in free access.</p>
            <p>These deals are real. They are live right now.</p>
            <p>
              But they&apos;re buried across hundreds of cloud programs, partner pages, accelerator portals, and startup websites — scattered in places no founder has time to search manually.
            </p>
            <p className="text-white">Until now.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PROBLEM_CARDS.map(([title, description, Icon]) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10">
                <Icon className="h-5 w-5 text-orange-300" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center sm:mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Meet Your AI Deal Agent
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            We Built an AI That Never Stops
            <br />
            Hunting Deals For You.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Founder Stack Hub&apos;s AI agent works around the clock — crawling the internet, verifying deals, and surfacing the best offers before they expire or run out.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {SOLUTION_FEATURES.map(([title, description, Icon]) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Icon className="h-5 w-5 text-cyan-200" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section id="deals" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            What Our AI Finds For You
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Every Type of Startup Saving.
            <br />
            Matched To What You Need Next.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {CATEGORIES.map(([title, description, Icon]) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveNumbersSection() {
  return (
    <section className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            What We&apos;ve Found So Far
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The Numbers Don&apos;t Lie.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {LIVE_NUMBERS_TOP.map(([value, label]) => (
            <div key={label} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-4xl font-bold text-white">{value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {LIVE_NUMBERS_BOTTOM.map(([value, label]) => (
            <div key={label} className="rounded-[28px] border border-orange-400/15 bg-orange-400/5 p-6">
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedDealsSection({ deals }: { deals: Awaited<ReturnType<typeof getHomepageFeaturedDeals>> }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            Featured Deals
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The Best Live Offers Our System Would Surface For Founders Like You.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            These are high-value founder offers being surfaced right now — the kind of savings your audit would prioritize based on stage, stack, and goals.
          </p>
        </div>

        <HomeFeaturedDealsClient deals={deals} />

        <div className="mt-12">
          <Link
            href="/deals"
            className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Browse All Founder Offers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Simple As 3 Steps
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Answer A Few Questions.
            <br />
            Get A Savings Plan.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {HOW_STEPS.map(([title, description], index) => (
            <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 text-lg font-bold text-orange-300">
                {index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            Founders Who Stopped Leaving Money On The Table
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Real Founders. Real Savings.
            <br />
            Real ROI in Minutes.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map(([quote, author]) => (
            <div key={author} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <Quote className="h-6 w-6 text-orange-300/50" />
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-200">&ldquo;{quote}&rdquo;</p>
              <p className="mt-5 text-sm font-semibold text-white">— {author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section className="border-t border-white/5 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
            Why FounderStackHub Beats Everything Else
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            More Than A Directory.
            <br />
            A Real Savings Workflow For Founders.
          </h2>
        </div>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-8 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <div>Platform</div>
            <div>Price</div>
            <div>AI-Powered</div>
            <div>Daily New Deals</div>
            <div>Deal Count</div>
            <div>AI Matching</div>
            <div>$10M+ Value</div>
            <div>Free Tier</div>
          </div>
          {COMPARISON_ROWS.map((row, index) => (
            <div
              key={row[0]}
              className={`grid grid-cols-8 px-5 py-5 text-sm ${index === 0 ? 'bg-cyan-400/10 text-white' : 'border-t border-white/5 text-slate-300'}`}
            >
              {row.map((cell, cellIndex) => (
                <div key={`${row[0]}-${cellIndex}`} className={cellIndex === 0 ? 'font-semibold' : ''}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UrgencySection() {
  return (
    <section className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
          Don&apos;t Wait — Deals Have Limits
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Right Now, These Deals Are Live.
          <br />
          Tomorrow, Some Will Be Gone.
        </h2>
        <div className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
          <p>
            Many of our best deals have hard limits. AWS Activate has limited slots per cohort. Notion free plans only apply to eligible startups. GitHub credits have limited availability per cycle. Zendesk startup access is often limited to Series A and below.
          </p>
          <p>
            Our AI monitors availability in real time. The moment slots open — you get first access. The moment they close — you missed out.
          </p>
          <p>
            There are founders claiming $50,000 in free tools right now. While you read this sentence, another founder just saved $12,000.
          </p>
          <p className="text-white">The only question is: are you next?</p>
        </div>

        <Link
          href="/free-deals"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-semibold text-black transition hover:bg-slate-100"
        >
          🚀 Run My Free Savings Audit
        </Link>
        <p className="mt-4 text-sm text-slate-500">Free to start. No credit card required.</p>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section id="audit" className="py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/[0.04] to-orange-400/10 px-6 py-14 sm:px-10">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Start With A Free AI Startup Savings Audit.
            <br />
            Then Unlock The Full Founder Stack.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            FounderStackHub is built to help founders stop overpaying for software. Tell us what you&apos;re building, get matched perks, and decide which savings to unlock next.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/free-deals"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-base font-semibold text-black transition hover:bg-slate-100"
            >
              🤖 Run My Free Savings Audit
            </Link>
            <Link
              href="/deals"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Browse Live Founder Offers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-400">$0 to start · No credit card · Founder-friendly onboarding · Instant access</p>
          <p className="mt-4 text-sm text-slate-500">
            Start with free offers, then upgrade when you want deeper access, better recommendations, and premium founder perks.
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">FAQ</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.03] px-6">
          {FAQS.map((item, index) => (
            <div key={item} className={index < FAQS.length - 1 ? 'border-b border-white/10' : ''}>
              <button className="flex w-full items-center justify-between py-5 text-left text-white">
                <span>{item}</span>
                <span className="text-slate-500">+</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
