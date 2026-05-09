'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { DealLogo } from '@/components/founderstack/DealLogo';
import { studentOfferToDeal, type StudentOffer } from '@/lib/student-offers';

interface StudentOfferInfoCardProps {
  offer: StudentOffer;
  index?: number;
}

export function StudentOfferInfoCard({ offer, index = 0 }: StudentOfferInfoCardProps) {
  const deal = studentOfferToDeal(offer, index);

  return (
    <div className="rounded-[24px] border border-gray-800 bg-black p-5 text-white shadow-[0_18px_36px_rgba(0,0,0,0.3)]">
      <div className="flex items-start gap-4">
        <DealLogo
          deal={deal}
          className="h-14 w-14 rounded-xl border-gray-800 bg-white/[0.03]"
          textClassName="text-base tracking-[0.16em] text-white"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-medium text-white">{offer.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{offer.provider}</p>
            </div>
            <Link
              href={`/student-offers/${offer.slug}`}
              className="text-xs text-gray-500 transition-colors hover:text-white"
            >
              View
            </Link>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-300">{offer.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Link
          href={offer.redeemUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          Redeem offer
          <ExternalLink className="h-4 w-4" />
        </Link>

        <Link
          href={`/student-offers/${offer.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-md border border-gray-700 px-4 text-sm text-white transition hover:border-gray-500"
        >
          Details
        </Link>
      </div>

      <div className="mt-5 rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-sm text-gray-200">
        {offer.savings}
      </div>
    </div>
  );
}
