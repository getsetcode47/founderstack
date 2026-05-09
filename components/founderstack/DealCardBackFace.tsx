'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Copy, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getDealAvatarLabel, getDealHref, getDiscountCtaLabel, hasPaidAccess } from '@/lib/founderstack';
import type { Deal } from '@/types';
import { DealLogo } from './DealLogo';
import { useAuth } from '@/context/AuthContext';

interface DealCardBackFaceProps {
  deal: Deal;
  initiallyAuthed?: boolean;
  initiallyClaimed?: boolean;
}

export function DealCardBackFace({
  deal,
  initiallyAuthed = false,
  initiallyClaimed = false,
}: DealCardBackFaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [revealed, setRevealed] = useState(initiallyClaimed && deal.discount_method === 'code');
  const [claimed, setClaimed] = useState(initiallyClaimed);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(initiallyAuthed);

  useEffect(() => {
    setAuthed(Boolean(user) || initiallyAuthed);
  }, [initiallyAuthed, user]);

  const ctaLabel = useMemo(
    () => getDiscountCtaLabel(deal.discount_method, authed, claimed),
    [authed, claimed, deal.discount_method]
  );

  async function ensureUser() {
    if (!user) {
      router.push('/sign-in?mode=signup&redirectTo=%2Fdashboard%2Fbilling');
      return null;
    }

    setAuthed(true);
    return user;
  }

  async function createClaim() {
    const response = await fetch('/api/deals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId: deal.id }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Unable to save claim.');
    }

    setClaimed(true);
  }

  async function handleClaim(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (deal.out_of_credits) return;

    setLoading(true);
    try {
      const currentUser = await ensureUser();
      if (!currentUser) return;

      if (!hasPaidAccess(profile)) {
        router.push('/dashboard/billing');
        return;
      }

      await createClaim();

      if (deal.discount_method === 'link' && deal.discount_url) {
        window.open(deal.discount_url, '_blank', 'noopener,noreferrer');
        toast.success('Deal unlocked in a new tab');
        return;
      }

      if (deal.discount_method === 'code' && deal.discount_code) {
        setRevealed(true);
        toast.success('Promo code revealed');
        return;
      }

      if (deal.discount_method === 'locked') {
        toast.success('Offer unlocked. Check the deal page for next steps.');
        router.push(getDealHref(deal));
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Unable to claim this deal right now');
    } finally {
      setLoading(false);
    }
  }

  async function copyCode(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!deal.discount_code) return;
    await navigator.clipboard.writeText(deal.discount_code);
    toast.success('Promo code copied');
  }

  return (
    <div className="flex h-full flex-col rounded-[24px] border border-gray-800 bg-black p-5 text-white shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
      <div className="flex items-start gap-4">
        <DealLogo
          deal={deal}
          className="h-14 w-14 rounded-xl border-gray-800 bg-white/[0.03]"
          textClassName="text-base tracking-[0.16em] text-white"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-medium text-white">{deal.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{getDealAvatarLabel(deal)}</p>
            </div>
            <Link
              href={getDealHref(deal)}
              onClick={(event) => event.stopPropagation()}
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              View
            </Link>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-300">{deal.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleClaim}
          disabled={deal.out_of_credits || loading}
          className={cn(
            'inline-flex h-11 flex-1 items-center justify-center rounded-md px-4 text-sm font-medium transition',
            deal.out_of_credits
              ? 'cursor-not-allowed border border-gray-800 bg-white/[0.05] text-gray-500'
              : 'bg-white text-black hover:bg-gray-200'
          )}
        >
          {deal.out_of_credits ? 'Out of credits' : loading ? 'Working...' : ctaLabel}
        </button>

        <Link
          href={getDealHref(deal)}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-11 items-center justify-center rounded-md border border-gray-700 px-4 text-sm text-white transition hover:border-gray-500"
        >
          Details
        </Link>
      </div>

      {deal.discount_method === 'code' && revealed && deal.discount_code && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-3">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Promo code</p>
            <p className="mt-1 font-mono text-base text-white">{deal.discount_code}</p>
          </div>
          <button
            onClick={copyCode}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-700 px-3 text-sm text-white transition hover:border-gray-500"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
      )}

      {deal.discount_method === 'locked' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
          <Lock className="h-4 w-4" />
          Founder-only unlock flow handled after sign-in.
        </div>
      )}

      {claimed && deal.discount_method !== 'code' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Claimed successfully
          {deal.discount_method === 'link' && <ExternalLink className="h-4 w-4" />}
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-sm text-gray-200">
          {deal.deal_headline}
        </div>
      </div>
    </div>
  );
}
