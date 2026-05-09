'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, ExternalLink, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getDealAvatarLabel, getDealDomain } from '@/lib/founderstack';
import type { Deal } from '@/types';
import { DealLogo } from '@/components/founderstack/DealLogo';

export function FreeDealCardBackFace({ deal }: { deal: Deal }) {
  const [revealed, setRevealed] = useState(false);
  const officialUrl = `https://${getDealDomain({ name: deal.name, logo_image_url: deal.logo_image_url ?? null })}`;

  async function copyCode() {
    if (!deal.discount_code) return;
    await navigator.clipboard.writeText(deal.discount_code);
    toast.success('Promo code copied');
  }

  function handlePrimaryAction() {
    if (deal.discount_method === 'link' && deal.discount_url) {
      window.open(deal.discount_url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (deal.discount_method === 'code' && deal.discount_code) {
      setRevealed(true);
      return;
    }

    window.open(officialUrl, '_blank', 'noopener,noreferrer');
  }

  const primaryLabel =
    deal.discount_method === 'code'
      ? revealed
        ? 'Code unlocked'
        : 'Reveal code'
      : deal.discount_method === 'link'
        ? 'Claim free deal'
        : 'View official site';

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
              href={deal.discount_url || officialUrl}
              target="_blank"
              rel="noreferrer"
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
          onClick={(event) => {
            event.stopPropagation();
            handlePrimaryAction();
          }}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          {primaryLabel}
        </button>

        <Link
          href={deal.discount_url || officialUrl}
          target="_blank"
          rel="noreferrer"
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
            onClick={(event) => {
              event.stopPropagation();
              void copyCode();
            }}
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
          Visit the official partner page for this free offer.
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
