'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePerksStore } from '@/store/usePerksStore';
import { createClient } from '@/lib/supabase/client';
import { FilterSidebar } from './FilterSidebar';
import { PerkCard } from './PerkCard';
import { PerkDetailModal } from './PerkDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category, Perk } from '@/types';

interface PerksExplorerProps {
  initialPerks: Perk[];
  categories: Category[];
}

export function PerksExplorer({ initialPerks, categories }: PerksExplorerProps) {
  const searchParams = useSearchParams();
  const {
    filteredPerks,
    filters,
    setPerks,
    setFilters,
    setClaimedPerkIds,
    setBookmarkedPerkIds,
  } = usePerksStore();

  const [loading, setLoading] = useState(false);
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    setPerks(initialPerks);

    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (cat) setFilters({ categories: [cat.id] });
    }

    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: claims }, { data: bookmarks }] = await Promise.all([
        supabase.from('perk_claims').select('perk_id').eq('user_id', user.id),
        supabase.from('bookmarks').select('perk_id').eq('user_id', user.id),
      ]);
      setClaimedPerkIds(claims?.map((c) => c.perk_id) ?? []);
      setBookmarkedPerkIds(bookmarks?.map((b) => b.perk_id) ?? []);
    }
    loadUserData();
  }, [
    categories,
    initialPerks,
    searchParams,
    setBookmarkedPerkIds,
    setClaimedPerkIds,
    setFilters,
    setPerks,
  ]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Browse Perks</h1>
        <p className="text-gray-400">
          Discover and claim {initialPerks.length}+ curated startup tools and discounts
        </p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tools, categories..."
            className="h-11 border-gray-800 bg-white/[0.03] pl-10 text-white placeholder:text-gray-500"
            value={filters.search}
            onChange={handleSearch}
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          className="h-11 gap-2 border-gray-700 bg-black text-white hover:bg-white/5 lg:hidden"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block w-full lg:w-56 flex-shrink-0`}>
          <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 lg:sticky lg:top-24 lg:p-5">
            <FilterSidebar categories={categories} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-white">{filteredPerks.length}</span> perks
              {filters.search && <span> matching &ldquo;<strong>{filters.search}</strong>&rdquo;</span>}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-11 h-11 rounded-xl" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
          ) : filteredPerks.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-white/[0.03]">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">No perks found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPerks.map((perk, i) => (
                <PerkCard key={perk.id} perk={perk} onOpenDetail={setSelectedPerk} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPerk && (
        <PerkDetailModal perk={selectedPerk} onClose={() => setSelectedPerk(null)} />
      )}
    </div>
  );
}
