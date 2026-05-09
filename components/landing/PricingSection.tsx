'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Infinity as InfinityIcon, Shield, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

type Plan = 'monthly' | 'annual' | 'lifetime';

const sharedFeatures = [
  'Full access to all 500+ deals',
  'All 12 categories unlocked',
  'Weekly fresh perks added',
  'Step-by-step redemption guides',
  'Email support',
  '30-day money-back guarantee',
];

export function PricingSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<Plan | null>(null);
  const { user } = useAuth();

  async function handleCheckout(plan: Plan) {
    setLoading(plan);
    try {
      if (!user) {
        router.push(`/sign-in?mode=signup&plan=${plan}`);
        return;
      }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      toast.error(err?.message || 'Unable to start checkout');
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="relative py-24 bg-[#0F172A] border-t border-white/5 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(249,115,22,0.2), transparent 50%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.15), transparent 50%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-4">
            <Rocket className="w-3.5 h-3.5" />
            Launch Week Special
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Insanely affordable.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              Ridiculously valuable.
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Price may increase after launch week. Lock in your rate now.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm hover:border-white/20 transition-all"
          >
            <h3 className="text-base font-semibold text-slate-300 mb-1">Monthly</h3>
            <p className="text-xs text-slate-500 mb-6">Try it risk-free</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-bold text-white">$10</span>
              <span className="text-slate-400 text-sm">/month</span>
            </div>
            <Button
              onClick={() => handleCheckout('monthly')}
              disabled={loading !== null}
              className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold"
            >
              {loading === 'monthly' ? 'Redirecting…' : 'Start Monthly'}
            </Button>
            <ul className="mt-8 space-y-3">
              {sharedFeatures.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative rounded-2xl border-2 border-orange-500/50 bg-gradient-to-b from-orange-500/10 via-white/[0.04] to-white/[0.02] p-8 backdrop-blur-sm shadow-2xl shadow-orange-500/10 md:scale-105 md:-my-2"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              Most Popular · Save 58%
            </div>
            <h3 className="text-base font-semibold text-orange-300 mb-1">Annual</h3>
            <p className="text-xs text-slate-400 mb-6">Best for serious founders</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-white">$50</span>
              <span className="text-slate-400 text-sm">/year</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              <span className="text-slate-500 line-through">$120</span>{' '}
              <span className="text-orange-300 font-semibold">that&apos;s just $4.17/month</span>
            </p>
            <Button
              onClick={() => handleCheckout('annual')}
              disabled={loading !== null}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30"
            >
              {loading === 'annual' ? 'Redirecting…' : 'Lock in $50/year'}
            </Button>
            <ul className="mt-8 space-y-3">
              {sharedFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="relative rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/10 via-white/[0.03] to-white/[0.02] p-8 backdrop-blur-sm hover:border-blue-500/50 transition-all"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <InfinityIcon className="w-3 h-3" />
              Pay Once
            </div>
            <h3 className="text-base font-semibold text-blue-300 mb-1">Lifetime</h3>
            <p className="text-xs text-slate-400 mb-6">Launch week only</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-bold text-white">$149</span>
              <span className="text-slate-400 text-sm">one-time</span>
            </div>
            <p className="text-xs text-blue-300 font-semibold mb-6">Access forever. No renewals.</p>
            <Button
              onClick={() => handleCheckout('lifetime')}
              disabled={loading !== null}
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20"
            >
              {loading === 'lifetime' ? 'Redirecting…' : 'Get Lifetime Access'}
            </Button>
            <ul className="mt-8 space-y-3">
              {sharedFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-400"
        >
          <span className="inline-flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-400" />
            30-day money-back guarantee
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span>Cancel anytime</span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span>Secure checkout via Stripe</span>
        </motion.div>

        <div className="mt-6 text-center">
          <Link href="/sign-in?mode=signup" className="text-sm text-slate-500 hover:text-slate-300 underline underline-offset-4">
            Or start free — browse deals without an account
          </Link>
        </div>
      </div>
    </section>
  );
}
