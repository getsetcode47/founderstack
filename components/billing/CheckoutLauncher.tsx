'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutLauncher({ plan }: { plan: 'monthly' | 'annual' | 'lifetime' }) {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function startCheckout() {
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!res.ok || !data.url) {
          throw new Error(data.error || 'Unable to start checkout.');
        }
        window.location.href = data.url;
      } catch (error: any) {
        toast.error(error?.message || 'Unable to start checkout.');
        router.replace('/dashboard/billing');
      }
    }

    startCheckout();
  }, [plan, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
      <div className="w-full max-w-lg rounded-[28px] border border-gray-800 bg-black p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Redirecting to secure checkout…</h1>
        <p className="mt-3 text-sm leading-7 text-gray-400">
          We&apos;re preparing your {plan} FounderStackHub checkout session with Stripe.
        </p>
      </div>
    </main>
  );
}
