'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getFallbackDealLogoUrl,
  getDealHref,
  getDealInitials,
  getGeneratedDealLogoUrl,
  getOfficialDealLogoUrl,
} from '@/lib/founderstack';
import type { Deal } from '@/types';

interface DealTradingCardProps {
  deal: Deal;
  priority?: boolean;
  href?: string;
  flipOnClick?: boolean;
  backFace?: ReactNode;
  fixedAspect?: boolean;
}

export function DealTradingCard({
  deal,
  href,
  flipOnClick = false,
  backFace,
  fixedAspect = false,
}: DealTradingCardProps) {
  const primaryLogo = useMemo(() => getOfficialDealLogoUrl(deal), [deal]);
  const fallbackLogo = useMemo(() => getFallbackDealLogoUrl(deal), [deal]);
  const generatedLogo = useMemo(() => getGeneratedDealLogoUrl(deal), [deal]);
  const initials = useMemo(() => getDealInitials(deal), [deal]);
  const [pointer, setPointer] = useState({ x: 50, y: 50, rotateX: 0, rotateY: 0, active: false });
  const [flipped, setFlipped] = useState(false);

  function handleMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const rotateY = ((x - 50) / 50) * 11;
    const rotateX = ((50 - y) / 50) * 11;
    setPointer({ x, y, rotateX, rotateY, active: true });
  }

  function handleLeave() {
    setPointer({ x: 50, y: 50, rotateX: 0, rotateY: 0, active: false });
  }

  function handleFlip(event: MouseEvent<HTMLElement>) {
    if (!flipOnClick || !backFace) return;
    const target = event.target as HTMLElement;
    if (target.closest('a,button,input,textarea,select')) return;
    setFlipped((value) => !value);
  }

  const frontFace = (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-[28px] border border-gray-800 bg-black transition duration-300',
        'shadow-[0_24px_60px_rgba(0,0,0,0.45)]'
      )}
      style={{
        transform: `rotateX(${pointer.rotateX}deg) rotateY(${pointer.rotateY}deg) scale(${pointer.active ? 1.03 : 1})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at 18% 12%, ${deal.brand_color}66, transparent 34%), radial-gradient(circle at 88% 85%, ${deal.brand_color}44, transparent 28%), linear-gradient(180deg, rgba(18,18,18,0.94) 0%, rgba(0,0,0,1) 58%, rgba(10,10,10,1) 100%)`,
        }}
      />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_38%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.22), rgba(255,255,255,0.08) 18%, transparent 42%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.16)_42%,rgba(255,255,255,0.03)_55%,transparent_78%)] opacity-0 translate-x-[-32%] transition duration-500 group-hover:translate-x-[36%] group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-300">
            {deal.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 p-2 text-white/90">
            {flipOnClick && backFace ? <RotateCcw className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div
            className="absolute h-48 w-48 rounded-full blur-3xl"
            style={{ backgroundColor: `${deal.brand_color}55` }}
          />
          <div className="relative rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryLogo}
              alt={`${deal.name} logo`}
              className="h-28 w-28 object-contain drop-shadow-[0_18px_34px_rgba(0,0,0,0.35)]"
              onError={(event) => {
                if (event.currentTarget.src !== fallbackLogo) {
                  event.currentTarget.src = fallbackLogo;
                  return;
                }

                event.currentTarget.src = generatedLogo;
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-gray-500">Founder Stack Hub</p>
              <h3 className="mt-3 text-2xl font-semibold leading-none text-white sm:text-[2rem]">
                {deal.name}
              </h3>
            </div>
            <span className="text-5xl font-semibold leading-none tracking-[-0.08em] text-white/[0.08]">
              {initials}
            </span>
          </div>
          <p className="max-w-[90%] text-sm leading-6 text-gray-400">
            {deal.deal_headline}
          </p>
        </div>
      </div>
    </div>
  );

  if (flipOnClick && backFace) {
    return (
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleFlip}
        className="group relative block cursor-pointer [perspective:1400px]"
      >
        <div
          className="relative aspect-[0.72/1] transition-transform duration-700 [transform-style:preserve-3d]"
          style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            {frontFace}
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {backFace}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href ?? getDealHref(deal)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative block [perspective:1400px]"
    >
      {fixedAspect ? <div className="aspect-[0.72/1]">{frontFace}</div> : frontFace}
    </Link>
  );
}
