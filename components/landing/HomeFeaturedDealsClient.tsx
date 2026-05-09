'use client';

import { DealCardBackFace } from '@/components/founderstack/DealCardBackFace';
import { DealTradingCard } from '@/components/founderstack/DealTradingCard';
import type { Deal } from '@/types';

export function HomeFeaturedDealsClient({ deals }: { deals: Deal[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {deals.slice(0, 6).map((deal) => (
        <DealTradingCard
          key={deal.id}
          deal={deal}
          flipOnClick
          backFace={<DealCardBackFace deal={deal} />}
        />
      ))}
    </div>
  );
}
