'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
    void fetch('/api/monitoring/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'client',
        route: typeof window !== 'undefined' ? window.location.pathname : null,
        message: error?.message || 'Unknown client error',
        digest: error?.digest ?? null,
        metadata: {
          stack: error?.stack ?? null,
        },
      }),
    }).catch(() => {});
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/60 bg-red-950/30">
          <AlertTriangle className="w-8 h-8 text-red-300" />
        </div>
        <h1 className="mb-3 text-2xl font-bold text-white">Something went wrong</h1>
        <p className="mb-8 leading-relaxed text-gray-400">
          An unexpected error occurred. Our team has been notified. Please try again or return to the homepage.
        </p>
        {process.env.NODE_ENV !== 'production' && error?.message ? (
          <div className="mb-6 rounded-2xl border border-yellow-900/40 bg-yellow-950/20 p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">Dev error</p>
            <p className="mt-2 break-words font-mono text-sm text-yellow-100">{error.message}</p>
            {error.digest ? <p className="mt-2 text-xs text-yellow-200/80">Digest: {error.digest}</p> : null}
          </div>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
          <Link href="/">
            <Button className="w-full bg-white text-black hover:bg-gray-100 sm:w-auto">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
