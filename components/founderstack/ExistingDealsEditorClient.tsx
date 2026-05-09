'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Deal } from '@/types';

interface ExistingDealsEditorClientProps {
  deals: Deal[];
  initialQuery?: string;
}

export function ExistingDealsEditorClient({
  deals,
  initialQuery = '',
}: ExistingDealsEditorClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialQuery);

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return deals;

    return deals.filter((deal) =>
      [deal.name, deal.slug, deal.category, deal.deal_headline, deal.discount_url ?? '']
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [deals, search]);

  return (
    <div className="rounded-[28px] border border-gray-800 bg-black p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Existing deals</p>
          <h2 className="mt-3 text-2xl text-white">Edit current offers and links</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Search any existing deal, review the current redeem link, and open the full editor to update the entire offer.
          </p>
        </div>
        <input
          value={search}
          onChange={(event) => {
            const nextValue = event.target.value;
            setSearch(nextValue);

            const params = new URLSearchParams(searchParams.toString());
            if (nextValue.trim()) {
              params.set('q', nextValue);
            } else {
              params.delete('q');
            }

            const nextQuery = params.toString();
            router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
          }}
          placeholder="Search by deal name, slug, category, or redeem link"
          className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none md:max-w-sm"
        />
      </div>

      <div className="grid gap-3">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="flex flex-col gap-4 rounded-2xl border border-gray-900 px-4 py-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-base text-white">{deal.name}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    deal.published ? 'bg-white text-black' : 'border border-gray-800 text-gray-400'
                  }`}
                >
                  {deal.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-400">{deal.deal_headline}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">{deal.category}</p>
              <p className="mt-3 text-xs text-gray-500">
                Current redeem link:{' '}
                <span className="break-all text-gray-300">{deal.discount_url || 'No link added yet'}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dashboard/new-deals/${deal.id}`}
                className="inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-100"
              >
                Edit full deal
              </Link>
              <Link
                href={`/deal/${deal.slug}`}
                className="inline-flex h-10 items-center rounded-md border border-gray-800 px-4 text-sm text-white hover:border-gray-600"
              >
                View live page
              </Link>
            </div>
          </div>
        ))}

        {!filteredDeals.length && (
          <div className="rounded-2xl border border-gray-900 px-4 py-6 text-sm text-gray-400">
            No deals matched your search.
          </div>
        )}
      </div>
    </div>
  );
}
