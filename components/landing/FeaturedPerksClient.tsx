'use client';

import { useState } from 'react';
import { PerkCard } from '@/components/perks/PerkCard';
import { PerkDetailModal } from '@/components/perks/PerkDetailModal';
import type { Perk } from '@/types';

interface FeaturedPerksClientProps {
  perks: Perk[];
}

export function FeaturedPerksClient({ perks }: FeaturedPerksClientProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {perks.map((perk, i) => (
          <PerkCard key={perk.id} perk={perk} onOpenDetail={setSelectedPerk} index={i} />
        ))}
      </div>
      {selectedPerk && (
        <PerkDetailModal perk={selectedPerk} onClose={() => setSelectedPerk(null)} />
      )}
    </>
  );
}
