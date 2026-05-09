'use client';

import { create } from 'zustand';
import type { FilterState, Perk, SortOption, OfferType } from '@/types';

interface PerksStore {
  perks: Perk[];
  filteredPerks: Perk[];
  filters: FilterState;
  claimedPerkIds: Set<string>;
  bookmarkedPerkIds: Set<string>;
  selectedPerk: Perk | null;
  setPerks: (perks: Perk[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setClaimedPerkIds: (ids: string[]) => void;
  setBookmarkedPerkIds: (ids: string[]) => void;
  addClaim: (perkId: string) => void;
  toggleBookmark: (perkId: string) => void;
  setSelectedPerk: (perk: Perk | null) => void;
  applyFilters: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  categories: [],
  valueRange: [0, 250000],
  offerTypes: [],
  sortBy: 'newest',
};

function filterAndSort(perks: Perk[], filters: FilterState): Perk[] {
  let result = [...perks];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.tool_name.toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter(
      (p) => p.category_id && filters.categories.includes(p.category_id)
    );
  }

  if (filters.offerTypes.length > 0) {
    result = result.filter((p) =>
      filters.offerTypes.includes(p.offer_type as OfferType)
    );
  }

  result = result.filter(
    (p) =>
      p.value_amount >= filters.valueRange[0] &&
      p.value_amount <= filters.valueRange[1]
  );

  switch (filters.sortBy) {
    case 'newest':
      result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case 'highest_value':
      result.sort((a, b) => b.value_amount - a.value_amount);
      break;
    case 'most_popular':
      result.sort((a, b) => b.claim_count - a.claim_count);
      break;
    case 'expiring_soon':
      result.sort((a, b) => {
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      });
      break;
  }

  return result;
}

export const usePerksStore = create<PerksStore>((set, get) => ({
  perks: [],
  filteredPerks: [],
  filters: defaultFilters,
  claimedPerkIds: new Set(),
  bookmarkedPerkIds: new Set(),
  selectedPerk: null,

  setPerks: (perks) => {
    set({ perks });
    set((state) => ({ filteredPerks: filterAndSort(perks, state.filters) }));
  },

  setFilters: (newFilters) => {
    set((state) => {
      const filters = { ...state.filters, ...newFilters };
      return {
        filters,
        filteredPerks: filterAndSort(state.perks, filters),
      };
    });
  },

  setClaimedPerkIds: (ids) => {
    const s = new Set<string>();
    ids.forEach((id) => s.add(id));
    set({ claimedPerkIds: s });
  },

  setBookmarkedPerkIds: (ids) => {
    const s = new Set<string>();
    ids.forEach((id) => s.add(id));
    set({ bookmarkedPerkIds: s });
  },

  addClaim: (perkId) =>
    set((state) => {
      const next = new Set<string>();
      state.claimedPerkIds.forEach((id) => next.add(id));
      next.add(perkId);
      return { claimedPerkIds: next };
    }),

  toggleBookmark: (perkId) =>
    set((state) => {
      const next = new Set<string>();
      state.bookmarkedPerkIds.forEach((id) => next.add(id));
      if (next.has(perkId)) {
        next.delete(perkId);
      } else {
        next.add(perkId);
      }
      return { bookmarkedPerkIds: next };
    }),

  setSelectedPerk: (perk) => set({ selectedPerk: perk }),

  applyFilters: () => {
    const { perks, filters } = get();
    set({ filteredPerks: filterAndSort(perks, filters) });
  },
}));
