'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PerkCard } from '@/components/perks/PerkCard';
import { PerkDetailModal } from '@/components/perks/PerkDetailModal';
import { Button } from '@/components/ui/button';
import { Bookmark, ArrowRight } from 'lucide-react';
import type { Perk } from '@/types';
import { usePerksStore } from '@/store/usePerksStore';

interface BookmarksClientProps {
  bookmarks: { id: string; perk_id: string; perks: Perk }[];
}

export function BookmarksClient({ bookmarks }: BookmarksClientProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const { setBookmarkedPerkIds } = usePerksStore();

  useEffect(() => {
    setBookmarkedPerkIds(bookmarks.map((b) => b.perk_id));
  }, [bookmarks, setBookmarkedPerkIds]);

  const perks = bookmarks.map((b) => b.perks).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-white">Bookmarks</h1>
        <p className="text-sm text-gray-400">{perks.length} saved perks</p>
      </div>

      {perks.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-gray-800 bg-black p-12 text-center">
          <Bookmark className="mx-auto mb-3 h-10 w-10 text-gray-600" />
          <h3 className="mb-1 font-semibold text-white">No bookmarks yet</h3>
          <p className="mb-5 text-sm text-gray-500">
            Save perks you want to claim later by clicking the bookmark icon
          </p>
          <Link href="/deals">
            <Button size="sm" className="gap-2 border border-gray-700 bg-white text-black hover:bg-gray-100">
              Browse deals
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {perks.map((perk, i) => (
            <PerkCard key={perk.id} perk={perk} onOpenDetail={setSelectedPerk} index={i} />
          ))}
        </div>
      )}

      {selectedPerk && (
        <PerkDetailModal perk={selectedPerk} onClose={() => setSelectedPerk(null)} />
      )}
    </div>
  );
}
