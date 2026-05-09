'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { normalizeInternalRedirect } from '@/lib/security/redirect';

function SignInPageInner() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  );
  const redirectTo = normalizeInternalRedirect(searchParams.get('redirectTo'), '/deals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    setMode(searchParams.get('mode') === 'signup' ? 'signup' : 'signin');
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signin') {
      const result = await signIn(form.email, form.password);
      setLoading(false);
      if (result.error) {
        setError(result.error.message);
        return;
      }
      router.replace(redirectTo);
      router.refresh();
      return;
    }

    const result = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (result.needsEmailConfirmation) {
      setError('Check your email to confirm your account, then sign in to continue.');
      setMode('signin');
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-20 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
        <div className="flex gap-2 rounded-full border border-gray-800 bg-white/[0.02] p-1">
          <button onClick={() => setMode('signin')} className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === 'signin' ? 'bg-white text-black' : 'text-gray-400'}`}>
            Sign in
          </button>
          <button onClick={() => setMode('signup')} className={`flex-1 rounded-full px-4 py-2 text-sm ${mode === 'signup' ? 'bg-white text-black' : 'text-gray-400'}`}>
            Sign up
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Founder access</p>
          <h1 className="mt-3 text-4xl">{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Sign in to claim deals, reveal promo codes, and unlock founder-only offers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === 'signup' && (
            <label className="space-y-2 text-sm text-gray-300">
              <span>Full name</span>
              <input value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} required className={inputClass} />
            </label>
          )}
          <label className="space-y-2 text-sm text-gray-300">
            <span>Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required className={inputClass} />
          </label>
          <label className="space-y-2 text-sm text-gray-300">
            <span>Password</span>
            <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required className={inputClass} />
          </label>

          {mode === 'signin' && (
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-white">
                Forgot password?
              </Link>
            </div>
          )}

          {error && <p className="rounded-xl border border-red-900/80 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</p>}

          <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-md bg-white text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-70">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need a partner listing instead? <Link href="/submit-tool" className="text-white hover:text-gray-300">Submit your tool</Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-black text-white"><Loader2 className="h-6 w-6 animate-spin" /></main>}>
      <SignInPageInner />
    </Suspense>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none';
