'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, CircleAlert as AlertCircle, Loader as Loader2, LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { validatePasswordStrength } from '@/lib/security/validation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setReady(Boolean(data.session));
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(Boolean(session));
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.replace('/sign-in');
    }, 1800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-20 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Founder access</p>
          <h1 className="mt-3 text-4xl">Set a new password.</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Choose a new password for your FounderStackHub account.
          </p>
        </div>

        {checking ? (
          <div className="mt-8 flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : success ? (
          <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" />
            <h2 className="mt-4 text-lg font-medium text-white">Password updated</h2>
            <p className="mt-2 text-sm text-emerald-100/90">
              Your password has been changed. Redirecting you to sign in.
            </p>
          </div>
        ) : !ready ? (
          <div className="mt-8 rounded-2xl border border-red-900/80 bg-red-950/30 p-5">
            <AlertCircle className="h-5 w-5 text-red-300" />
            <h2 className="mt-4 text-lg font-medium text-white">Reset link expired or invalid</h2>
            <p className="mt-2 text-sm leading-7 text-red-100/90">
              Request a new password reset email and use the latest link from your inbox.
            </p>
            <Link
              href="/forgot-password"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-100"
            >
              Request another reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="space-y-2 text-sm text-gray-300">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className={inputClass}
              />
            </label>
            <label className="space-y-2 text-sm text-gray-300">
              <span>Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                className={inputClass}
              />
            </label>

            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-4 w-4 text-gray-500" />
                <p>Password must be at least 8 characters and include at least one letter and one number.</p>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-900/80 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-white text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none';
