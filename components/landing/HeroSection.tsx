'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Rocket, ShieldCheck } from 'lucide-react';

const tickerTools = [
  { name: 'AWS', logo: 'https://logo.clearbit.com/aws.amazon.com' },
  { name: 'OpenAI', logo: 'https://logo.clearbit.com/openai.com' },
  { name: 'Notion', logo: 'https://logo.clearbit.com/notion.so' },
  { name: 'HubSpot', logo: 'https://logo.clearbit.com/hubspot.com' },
  { name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com' },
  { name: 'GitHub', logo: 'https://logo.clearbit.com/github.com' },
  { name: 'Figma', logo: 'https://logo.clearbit.com/figma.com' },
  { name: 'Intercom', logo: 'https://logo.clearbit.com/intercom.com' },
  { name: 'Webflow', logo: 'https://logo.clearbit.com/webflow.com' },
  { name: 'Cloudflare', logo: 'https://logo.clearbit.com/cloudflare.com' },
  { name: 'Anthropic', logo: 'https://logo.clearbit.com/anthropic.com' },
  { name: 'Framer', logo: 'https://logo.clearbit.com/framer.com' },
  { name: 'Asana', logo: 'https://logo.clearbit.com/asana.com' },
  { name: 'MongoDB', logo: 'https://logo.clearbit.com/mongodb.com' },
  { name: 'Slack', logo: 'https://logo.clearbit.com/slack.com' },
  { name: 'Airtable', logo: 'https://logo.clearbit.com/airtable.com' },
  { name: 'Supabase', logo: 'https://logo.clearbit.com/supabase.com' },
  { name: 'Vercel', logo: 'https://logo.clearbit.com/vercel.com' },
  { name: 'Make', logo: 'https://logo.clearbit.com/make.com' },
  { name: 'Miro', logo: 'https://logo.clearbit.com/miro.com' },
  { name: 'Grammarly', logo: 'https://logo.clearbit.com/grammarly.com' },
  { name: 'Apollo.io', logo: 'https://logo.clearbit.com/apollo.io' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A] pt-16">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(59,130,246,0.28), transparent 45%), radial-gradient(circle at 85% 85%, rgba(249,115,22,0.22), transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 75%)',
        }}
      />

      <Sparkles className="absolute top-24 left-10 w-5 h-5 text-blue-400/40 animate-pulse hidden sm:block" />
      <Sparkles className="absolute bottom-40 right-12 w-4 h-4 text-orange-400/50 animate-pulse hidden sm:block" style={{ animationDelay: '1.5s' }} />
      <Sparkles className="absolute top-1/3 right-1/4 w-3 h-3 text-blue-300/40 animate-pulse hidden lg:block" style={{ animationDelay: '0.8s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Link
            href="#pricing"
            className="group inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 text-xs sm:text-sm font-medium pl-2 pr-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Rocket className="w-3 h-3" />
              Launch Week
            </span>
            Lock in $50/year — before prices go up
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          Everything a Founder Needs.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-orange-400">
            One Hub. One Price.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Unlock 500+ deals, credits, discounts, and resources — from AI tools to
          cloud credits to grants. All for less than the price of a coffee per week.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/sign-in?mode=signup">
            <Button
              size="lg"
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base gap-2 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              Start for $10/month
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#deals">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:text-white font-semibold text-base"
            >
              See All Deals
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-400"
        >
          <span className="text-orange-300 font-semibold">Or $50/year — save 58%</span>
          <span className="text-slate-600">|</span>
          <span>Cancel anytime</span>
          <span className="text-slate-600">|</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" />30-day money back</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-6">
            Deals across the tools founders actually use
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-8 animate-[ticker_50s_linear_infinite] whitespace-nowrap">
              {[...tickerTools, ...tickerTools].map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 flex-shrink-0 px-1">
                  <div className="w-6 h-6 rounded-md bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.logo}
                      alt={t.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="text-slate-400 text-sm font-semibold tracking-tight">
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <style jsx>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
