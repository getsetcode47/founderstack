'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader as Loader2, ArrowLeft, CircleAlert as AlertCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Unable to send the reset email.');
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-slate-700/50">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png"
                alt="FounderStackHub"
                width={36}
                height={36}
                className="rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all"
              />
              <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                FounderStackHub
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset your password</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {sent ? 'Check your inbox for the reset link' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          <div className="px-8 py-7">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Reset link sent!</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-2">
                  We sent a reset link to
                </p>
                <p className="text-white font-semibold text-sm mb-6 bg-slate-800/60 rounded-lg px-4 py-2 inline-block">
                  {email}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Check your inbox and spam folder. The link expires in 1 hour.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white hover:bg-slate-100 text-black text-sm font-semibold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign in
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      placeholder="you@startup.com"
                      className="w-full h-11 rounded-xl bg-[#0F172A] border border-slate-700 text-white placeholder-slate-500 px-4 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-white hover:bg-slate-100 text-black font-semibold text-sm transition-all shadow-lg shadow-white/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
