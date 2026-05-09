'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { applyFreeDealFlag, hasFreeDealFlag, stripFreeDealFlag } from '@/lib/free-deals';
import type { Deal } from '@/types';

interface AdminDealsClientProps {
  deals: Deal[];
}

export function AdminDealsClient({ deals: initialDeals }: AdminDealsClientProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = useMemo(
    () =>
      deals.filter((deal) => {
        const matchesSearch = [deal.name, deal.slug, deal.category].some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        );
        const matchesStatus =
          status === 'all' || (status === 'published' ? deal.published : !deal.published);
        return matchesSearch && matchesStatus;
      }),
    [deals, search, status]
  );

  async function patchDeal(id: string, patch: Partial<Deal>, message: string) {
    const response = await fetch(`/api/custom-deals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        deals.find((deal) => deal.id === id)
          ? { ...deals.find((deal) => deal.id === id), ...patch }
          : patch
      ),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Unable to update deal.');
      return;
    }

    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, ...patch } : deal)));
    toast.success(message);
  }

  async function deleteDeal(id: string) {
    if (!window.confirm('Delete this deal?')) return;
    const response = await fetch(`/api/custom-deals/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Unable to delete deal.');
      return;
    }
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
    toast.success('Deal deleted');
  }

  async function moveDeal(target: Deal, direction: -1 | 1) {
    const sorted = [...deals].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((deal) => deal.id === target.id);
    const swap = sorted[index + direction];
    if (!swap) return;

    const response = await fetch('/api/custom-deals/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetId: target.id,
        targetSortOrder: target.sort_order,
        swapId: swap.id,
        swapSortOrder: swap.sort_order,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Unable to reorder deal');
      return;
    }

    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === target.id) return { ...deal, sort_order: swap.sort_order };
        if (deal.id === swap.id) return { ...deal, sort_order: target.sort_order };
        return deal;
      })
    );
    toast.success('Deal order updated');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-white">Deals</h1>
          <p className="mt-1 text-sm text-gray-400">
            {deals.length} deals in the catalog. Edit each entry to update offer links, headlines, eligibility, descriptions, and homepage placement.
          </p>
        </div>
        <Link href="/dashboard/deals/new" className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition hover:bg-gray-100">
          New deal
        </Link>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-gray-800 bg-black p-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search deals by name, slug, or category"
          className="h-12 rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className="h-12 rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-gray-800 bg-black">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                <th className="px-5 py-4 font-medium">Deal</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Offer</th>
                <th className="px-5 py-4 font-medium">Description</th>
                <th className="px-5 py-4 font-medium">Link</th>
                <th className="px-5 py-4 font-medium">Method</th>
                <th className="px-5 py-4 font-medium">Homepage</th>
                <th className="px-5 py-4 font-medium">Free Deals</th>
                <th className="px-5 py-4 font-medium">Sort</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-900/80 text-gray-200">
                  <td className="px-5 py-4">
                    <div>
                      <div className="font-medium text-white">{deal.name}</div>
                      <div className="text-xs text-gray-500">/{deal.slug}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{deal.category}</td>
                  <td className="max-w-[240px] px-5 py-4 text-sm text-gray-300">
                    <div className="line-clamp-2">{deal.deal_headline}</div>
                  </td>
                  <td className="max-w-[260px] px-5 py-4 text-sm text-gray-400">
                    <div className="line-clamp-2">{deal.description}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {deal.discount_url ? (
                      <a
                        href={deal.discount_url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        {deal.discount_url.replace(/^https?:\/\//, '').slice(0, 28)}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-5 py-4 capitalize">{deal.discount_method}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        deal.featured ? 'bg-cyan-400/15 text-cyan-200' : 'border border-gray-800 text-gray-400'
                      }`}
                    >
                      {deal.featured ? 'Best Live Offers' : 'Off'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        hasFreeDealFlag(deal.meta_description)
                          ? 'bg-emerald-400/15 text-emerald-200'
                          : 'border border-gray-800 text-gray-400'
                      }`}
                    >
                      {hasFreeDealFlag(deal.meta_description) ? 'Free Deals' : 'Off'}
                    </span>
                  </td>
                  <td className="px-5 py-4">{deal.sort_order}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs ${deal.published ? 'bg-white text-black' : 'border border-gray-800 text-gray-300'}`}>
                      {deal.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/deals/${deal.id}`} className="rounded-md bg-white px-3 py-2 text-xs font-medium text-black hover:bg-gray-100">Edit</Link>
                      <button onClick={() => moveDeal(deal, -1)} className="rounded-md border border-gray-800 px-3 py-2 text-xs text-white hover:border-gray-600">Up</button>
                      <button onClick={() => moveDeal(deal, 1)} className="rounded-md border border-gray-800 px-3 py-2 text-xs text-white hover:border-gray-600">Down</button>
                      <button onClick={() => patchDeal(deal.id, { published: !deal.published }, deal.published ? 'Deal unpublished' : 'Deal published')} className="rounded-md border border-gray-800 px-3 py-2 text-xs text-white hover:border-gray-600">
                        {deal.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => patchDeal(deal.id, { featured: !deal.featured }, deal.featured ? 'Removed from Best Live Offers' : 'Added to Best Live Offers')} className="rounded-md border border-gray-800 px-3 py-2 text-xs text-white hover:border-gray-600">
                        {deal.featured ? 'Remove from Home' : 'Show on Home'}
                      </button>
                      <button
                        onClick={() =>
                          patchDeal(
                            deal.id,
                            { meta_description: applyFreeDealFlag(stripFreeDealFlag(deal.meta_description), !hasFreeDealFlag(deal.meta_description)) },
                            hasFreeDealFlag(deal.meta_description) ? 'Removed from free deals page' : 'Added to free deals page'
                          )
                        }
                        className="rounded-md border border-gray-800 px-3 py-2 text-xs text-white hover:border-gray-600"
                      >
                        {hasFreeDealFlag(deal.meta_description) ? 'Remove Free' : 'Show Free'}
                      </button>
                      <button onClick={() => deleteDeal(deal.id)} className="rounded-md border border-red-900/60 px-3 py-2 text-xs text-red-300 hover:border-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
