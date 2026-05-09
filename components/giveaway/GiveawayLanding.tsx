'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CircleCheck as CheckCircle2, Clock, Users, Shield, Zap, Brain, ChartBar as BarChart3, Lock, ChevronDown, Gift, ArrowRight, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const TOTAL_SPOTS = 50;
const CLAIMED_SPOTS = 37;

const features = [
  { icon: Brain, label: 'Advanced AI models for work (GPT-4o, o1)' },
  { icon: Zap, label: 'Unlimited core chat & uploads' },
  { icon: BarChart3, label: 'More images, videos & data analysis' },
  { icon: Users, label: 'Up to 5 team seats included — share with your whole team' },
  { icon: Shield, label: 'Advanced security — SSO, MFA & more' },
  { icon: Lock, label: 'Privacy built-in: data never used for training' },
];

const faqs = [
  {
    q: 'Who is this giveaway for?',
    a: 'This giveaway is exclusively for FounderStackHub community members. If you\'re a founder, entrepreneur, or builder, this is for you.',
  },
  {
    q: 'How will I receive my free month?',
    a: 'After you sign up, our team will reach out via email within 24–48 hours with your unique redemption code.',
  },
  {
    q: 'Is there any catch or hidden cost?',
    a: 'Absolutely none. This is a full 1-month ChatGPT Business access for up to 5 team members, worth $150, completely free. No credit card required to claim.',
  },
  {
    q: 'How many spots are available?',
    a: `We have ${TOTAL_SPOTS} spots total. Once they\'re gone, they\'re gone. Claim yours before it\'s too late.`,
  },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Startup Founder',
    text: 'ChatGPT Business transformed how our team works. The custom GPTs alone saved us 10+ hours a week.',
    stars: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Product Manager',
    text: 'The advanced data analysis features are insane. We\'re shipping faster than ever.',
    stars: 5,
  },
  {
    name: 'Priya R.',
    role: 'Solo Operator',
    text: 'I was skeptical about paying for AI tools. This free month completely changed my mind — it pays for itself.',
    stars: 5,
  },
];

export function GiveawayLanding() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from('giveaway_leads')
        .insert({ email: email.trim().toLowerCase(), name: name.trim() });
      if (dbError) {
        if (dbError.code === '23505') {
          setError('This email is already registered. Check your inbox!');
        } else {
          setError('Something went wrong. Please try again.');
        }
        return;
      }
      setSuccess(true);

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        fetch(`${supabaseUrl}/functions/v1/send-giveaway-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ email: email.trim().toLowerCase(), name: name.trim() }),
        }).catch(() => {});
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Urgency Bar */}
        <div className="bg-emerald-600 text-white text-center py-2.5 px-4 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Only {TOTAL_SPOTS - CLAIMED_SPOTS} spots remaining — Giveaway ends in {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
        </div>

        {/* Nav */}
        <nav className="border-b border-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">FounderStackHub</span>
            </div>
            <a
              href="#claim"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Claim Free Month <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Gift className="w-4 h-4" />
              Exclusive FounderStackHub Giveaway — $150 Value
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              1 Month of
              <br />
              <span className="text-emerald-400">ChatGPT Business</span>
              <br />
              <span className="text-white/90">Completely Free</span>
            </h1>

            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              We&apos;re gifting <strong className="text-white">{TOTAL_SPOTS} founders</strong> one full month of ChatGPT Business for <strong className="text-white">up to 5 team members</strong> — the AI suite that supercharges teams. Worth <strong className="text-emerald-400">$150</strong>, yours for free.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 5 team seats</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No strings attached</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cancel anytime</span>
            </div>

            {/* Progress bar */}
            <div className="max-w-sm mx-auto mb-2">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{CLAIMED_SPOTS} spots claimed</span>
                <span>{TOTAL_SPOTS - CLAIMED_SPOTS} remaining</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(CLAIMED_SPOTS / TOTAL_SPOTS) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>
            <p className="text-xs text-white/30 mb-12">{Math.round((CLAIMED_SPOTS / TOTAL_SPOTS) * 100)}% of spots taken</p>
          </motion.div>

          {/* Screenshot Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-4xl mx-auto mb-20"
          >
            <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl scale-105" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Screenshot_2026-04-18_at_1.20.14_AM.png"
                alt="ChatGPT Business — Try free for 1 month"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* What You Get */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Everything included in your free month</h2>
            <p className="text-white/50">The full ChatGPT Business plan — no limitations.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 hover:bg-white/[0.06] transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <span className="text-sm text-white/80 leading-snug pt-1">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Signup Form */}
        <section id="claim" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10"
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">You&apos;re in! Spot secured.</h3>
                      <p className="text-white/50 text-sm">A confirmation email is on its way to <strong className="text-white/70">{email}</strong></p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-5 mb-6">
                      <p className="text-emerald-400 font-semibold text-sm mb-1 flex items-center gap-1.5">
                        <ArrowRight className="w-4 h-4" /> Redeem your free month now
                      </p>
                      <p className="text-white/60 text-xs mb-3">Click the button below to go directly to the ChatGPT Business offer page and activate your free month.</p>
                      <a
                        href="https://chatgpt.com/?promo_campaign=team-1-month-free&utm_campaign=WEB-team-1-month-free&utm_internal_medium=referral&utm_internal_source=openai_team&referrer=https%3A%2F%2Fchatgpt.com%2Fbusiness%2Fbusiness-plan%3Futm_source%3Dchatgpt.com#team-pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm group"
                      >
                        <Gift className="w-4 h-4" />
                        Activate My Free ChatGPT Business Month
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>

                    <div className="space-y-3">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Step-by-step instructions</p>
                      {[
                        { step: '1', title: 'Click the button above', desc: 'Opens the official ChatGPT Business promo page in a new tab.' },
                        { step: '2', title: 'Sign up or log in', desc: 'Use your business email to create or sign into your ChatGPT account.' },
                        { step: '3', title: 'Select the Business plan', desc: 'Click &quot;Claim free offer&quot; on the Business plan card — your first month is $0.' },
                        { step: '4', title: 'Complete checkout', desc: 'Enter your team details. No charge for the first month. Cancel before day 30 to avoid billing.' },
                      ].map(({ step, title, desc }) => (
                        <div key={step} className="flex items-start gap-3 bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">{step}</div>
                          <div>
                            <p className="text-sm font-semibold text-white/90">{title}</p>
                            <p className="text-xs text-white/45 mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-white/30 text-xs mt-5">
                      Need help? Reply to your confirmation email and we&apos;ll assist you.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        <Clock className="w-3 h-3" /> Limited — {TOTAL_SPOTS - CLAIMED_SPOTS} spots left
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Claim your free month</h2>
                      <p className="text-white/50 text-sm">Enter your details below. We&apos;ll send your code within 48 hours.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Jane Smith"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">Email Address <span className="text-emerald-400">*</span></label>
                        <input
                          id="email"
                          type="email"
                          placeholder="jane@company.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                        />
                      </div>

                      {error && (
                        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2 group shadow-lg shadow-emerald-900/40"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Claiming your spot...
                          </span>
                        ) : (
                          <>
                            <Gift className="w-4.5 h-4.5" />
                            Claim My Free Month — $150 Value
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-white/30 text-center">
                        By signing up, you agree to receive updates from FounderStackHub. No spam, ever.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What founders are saying</h2>
            <p className="text-white/50">From the FounderStackHub community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold hover:bg-white/[0.03] transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 ml-3 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 text-center">
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 rounded-3xl p-12 sm:p-16">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gift className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Don&apos;t miss this giveaway</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {TOTAL_SPOTS - CLAIMED_SPOTS} spots left. Once they&apos;re gone, this offer disappears forever.
            </p>
            <a
              href="#claim"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-lg shadow-emerald-900/50 group"
            >
              <Gift className="w-5 h-5" />
              Claim My Free Month Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <p className="text-white/30 text-xs mt-4">No credit card. No commitment. 100% free.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center text-white/30 text-xs px-4">
          <p>© 2026 FounderStackHub. All rights reserved.</p>
          <p className="mt-1">This giveaway is not affiliated with OpenAI. ChatGPT Business is a product of OpenAI.</p>
        </footer>
      </div>
    </div>
  );
}
