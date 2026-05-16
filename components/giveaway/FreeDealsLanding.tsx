'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Gift, Lock, Mail, Sparkles } from 'lucide-react';
import type { Deal } from '@/types';
import { DealTradingCard } from '@/components/founderstack/DealTradingCard';
import { FreeDealCardBackFace } from './FreeDealCardBackFace';

export function FreeDealsLanding({
  deals,
  verifiedEmail,
}: {
  deals: Deal[];
  verifiedEmail: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(verifiedEmail ?? '');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'capture' | 'verify' | 'unlocked'>(verifiedEmail ? 'unlocked' : 'capture');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/free-deals/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || 'Unable to send verification code.');
      return;
    }

    setStep('verify');
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/free-deals/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || 'Unable to verify your code.');
      return;
    }

    setStep('unlocked');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 pb-20 pt-10 text-white sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-black/35 px-6 py-14 backdrop-blur-xl sm:px-10 lg:px-14">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <Gift className="h-3.5 w-3.5" />
              FounderStackHub AI Savings Audit
            </span>
            <h1 className="mt-8 text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Run Your Free
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-white to-orange-300 bg-clip-text text-transparent">
                Startup Savings Audit
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Tell us where to send your unlock link, verify your email, and get a founder-friendly starting point: free credits, zero-cost offers, and the first perks most relevant to your stack.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Free startup savings audit
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                Email verification required
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                Unlock curated free offers instantly
              </span>
            </div>
          </div>

          {!verifiedEmail && (
            <div className="mx-auto mt-14 w-full max-w-xl rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              {step === 'capture' ? (
                <form onSubmit={sendCode} className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Step 1</p>
                    <h2 className="mt-3 text-2xl font-semibold">Enter your email to start the audit</h2>
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-cyan-400/40"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none transition focus:border-cyan-400/40"
                    required
                  />
                  {error ? <p className="text-sm text-red-300">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:opacity-70"
                  >
                    {loading ? 'Sending code...' : 'Start my free savings audit'}
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyCode} className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Step 2</p>
                    <h2 className="mt-3 text-2xl font-semibold">Verify your email</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      We sent a 6-digit code to <span className="text-white">{email}</span>.
                    </p>
                  </div>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-center text-lg tracking-[0.4em] text-white outline-none transition focus:border-cyan-400/40"
                    required
                  />
                  {error ? <p className="text-sm text-red-300">{error}</p> : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-white px-5 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:opacity-70"
                  >
                    {loading ? 'Verifying...' : 'Unlock free deals'}
                  </button>
                </form>
              )}
            </div>
          )}

          {verifiedEmail && (
            <div className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Free deals unlocked</h2>
              <p className="mt-3 text-sm leading-7 text-cyan-50/80">
                Verified for <span className="font-medium text-white">{verifiedEmail}</span>. Start with these free offers, then continue into the full founder savings workflow.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">Free Deals</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Start with free savings before you pay for anything.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {verifiedEmail
              ? 'These are the founder-friendly free offers we surface first inside the audit.'
              : 'Verify your email to unlock the curated free offers we use as the first step in the savings audit.'}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => (
            <DealTradingCard
              key={deal.id}
              deal={deal}
              flipOnClick={!!verifiedEmail}
              backFace={verifiedEmail ? <FreeDealCardBackFace deal={deal} /> : undefined}
              fixedAspect
            />
          ))}
        </div>

        {verifiedEmail ? null : (
          <div className="rounded-[28px] border border-white/10 bg-black/35 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <Lock className="h-6 w-6 text-cyan-300" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">Verify first to see the free deals</h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              We use a quick email verification step to unlock your free savings audit and send updates when new founder-friendly free offers are added.
            </p>
          </div>
        )}

        {verifiedEmail && deals.length > 0 && (
          <div className="mt-10">
            <a
              href="/deals"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              See the full deals catalog <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
