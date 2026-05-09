'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/60 bg-red-950/30">
              <AlertTriangle className="h-8 w-8 text-red-300" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mb-8 leading-relaxed text-gray-400">
              An unexpected error occurred. Please try again or return to the homepage.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={reset} variant="outline" className="gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
                <RefreshCw className="h-4 w-4" />
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
      </body>
    </html>
  );
}
