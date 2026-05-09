'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  getFallbackDealLogoUrl,
  getDealInitials,
  getGeneratedDealLogoUrl,
  getOfficialDealLogoUrl,
} from '@/lib/founderstack';
import type { Deal } from '@/types';

interface DealLogoProps {
  deal: Pick<Deal, 'name' | 'short_name' | 'logo_type' | 'logo_image_url' | 'logo_text' | 'brand_color'>;
  className?: string;
  textClassName?: string;
}

export function DealLogo({ deal, className, textClassName }: DealLogoProps) {
  const initials = getDealInitials(deal);
  const primaryLogo = getOfficialDealLogoUrl(deal);
  const fallbackLogo = getFallbackDealLogoUrl(deal);
  const generatedLogo = getGeneratedDealLogoUrl(deal);
  const [imgSrc, setImgSrc] = useState(
    deal.logo_type === 'image' && deal.logo_image_url ? deal.logo_image_url : primaryLogo
  );

  useEffect(() => {
    setImgSrc(deal.logo_type === 'image' && deal.logo_image_url ? deal.logo_image_url : primaryLogo);
  }, [deal.logo_image_url, deal.logo_type, primaryLogo]);

  if (imgSrc) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5',
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={deal.name}
          className="h-full w-full object-contain p-2"
          onError={() => {
            if (imgSrc !== fallbackLogo) {
              setImgSrc(fallbackLogo);
              return;
            }

            if (imgSrc !== generatedLogo) {
              setImgSrc(generatedLogo);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        className
      )}
      style={{ backgroundColor: `${deal.brand_color}22` }}
    >
      <span className={cn('text-lg tracking-[0.2em]', textClassName)}>{initials}</span>
    </div>
  );
}
