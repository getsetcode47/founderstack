'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DealCardBackFace } from './DealCardBackFace';
import { DealTradingCard } from './DealTradingCard';
import { getSortedDeals, matchesDealQuery } from '@/lib/founderstack';
import type { Deal, DealSortOption } from '@/types';

interface DealsExplorerProps {
  deals: Deal[];
  initiallyAuthed?: boolean;
  claimedDealIds?: string[];
}

export function DealsExplorer({
  deals,
  initiallyAuthed = false,
  claimedDealIds = [],
}: DealsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'All');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === '1');
  const [sort, setSort] = useState<DealSortOption>((searchParams.get('sort') as DealSortOption) ?? 'custom');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(deals.map((deal) => deal.category))).sort()],
    [deals]
  );

  const filteredDeals = useMemo(() => {
    const next = deals.filter((deal) => {
      if (category !== 'All' && deal.category !== category) return false;
      if (featuredOnly && !deal.featured) return false;
      return matchesDealQuery(deal, search);
    });

    return getSortedDeals(next, sort);
  }, [category, deals, featuredOnly, search, sort]);

  function updateParams(next: {
    q?: string;
    category?: string;
    featured?: boolean;
    sort?: DealSortOption;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const q = next.q ?? search;
    const currentCategory = next.category ?? category;
    const currentFeatured = next.featured ?? featuredOnly;
    const currentSort = next.sort ?? sort;

    q ? params.set('q', q) : params.delete('q');
    currentCategory !== 'All' ? params.set('category', currentCategory) : params.delete('category');
    currentFeatured ? params.set('featured', '1') : params.delete('featured');
    currentSort !== 'custom' ? params.set('sort', currentSort) : params.delete('sort');

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(event) => {
                const value = event.target.value;
                setSearch(value);
                updateParams({ q: value });
              }}
              placeholder="Search founder tools, categories, or headlines"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.05] pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-cyan-300/40 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => {
                  setFeaturedOnly(event.target.checked);
                  updateParams({ featured: event.target.checked });
                }}
                className="accent-white"
              />
              Featured only
            </label>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) => {
                  const value = event.target.value as DealSortOption;
                  setSort(value);
                  updateParams({ sort: value });
                }}
                className="h-12 rounded-xl border border-white/10 bg-white/[0.05] px-4 pr-10 text-sm text-white focus:border-cyan-300/40 focus:outline-none"
              >
                <option value="custom">Custom order</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="newest">Newest</option>
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                updateParams({ category: item });
              }}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                item === category
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 bg-white/[0.04] text-gray-200 hover:border-white/20'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredDeals.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-black/35 px-6 py-16 text-center backdrop-blur-xl">
          <h3 className="text-xl font-medium text-white">No deals match these filters</h3>
          <p className="mt-2 text-sm text-slate-300">Try a broader search or remove a filter.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredDeals.map((deal) => (
            <DealTradingCard
              key={deal.id}
              deal={deal}
              flipOnClick
              backFace={
                <DealCardBackFace
                  deal={deal}
                  initiallyAuthed={initiallyAuthed}
                  initiallyClaimed={claimedDealIds.includes(deal.id)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
