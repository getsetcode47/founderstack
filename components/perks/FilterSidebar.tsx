'use client';

import { usePerksStore } from '@/store/usePerksStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RotateCcw } from 'lucide-react';
import type { Category, OfferType, SortOption } from '@/types';

interface FilterSidebarProps {
  categories: Category[];
}

const offerTypes: { value: OfferType; label: string }[] = [
  { value: 'credit', label: 'API Credit' },
  { value: 'discount', label: 'Discount' },
  { value: 'free_trial', label: 'Free Trial' },
  { value: 'lifetime', label: 'Lifetime Deal' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'highest_value', label: 'Highest value' },
  { value: 'most_popular', label: 'Most popular' },
  { value: 'expiring_soon', label: 'Expiring soon' },
];

function formatSliderValue(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const { filters, setFilters } = usePerksStore();

  function toggleCategory(id: string) {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    setFilters({ categories: next });
  }

  function toggleOfferType(type: OfferType) {
    const next = filters.offerTypes.includes(type)
      ? filters.offerTypes.filter((t) => t !== type)
      : [...filters.offerTypes, type];
    setFilters({ offerTypes: next });
  }

  function resetFilters() {
    setFilters({
      search: '',
      categories: [],
      valueRange: [0, 250000],
      offerTypes: [],
      sortBy: 'newest',
    });
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.offerTypes.length > 0 ||
    filters.valueRange[0] > 0 ||
    filters.valueRange[1] < 250000;

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-gray-300">Sort by</Label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilters({ sortBy: v as SortOption })}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-gray-300">Category</Label>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={filters.categories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm font-normal text-gray-400">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-gray-300">
          Value range{' '}
          <span className="font-normal text-gray-500">
            ({formatSliderValue(filters.valueRange[0])} – {formatSliderValue(filters.valueRange[1])})
          </span>
        </Label>
        <Slider
          min={0}
          max={250000}
          step={500}
          value={filters.valueRange}
          onValueChange={(v) => setFilters({ valueRange: v as [number, number] })}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-gray-300">Offer type</Label>
        <div className="space-y-2.5">
          {offerTypes.map((ot) => (
            <div key={ot.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`ot-${ot.value}`}
                checked={filters.offerTypes.includes(ot.value)}
                onCheckedChange={() => toggleOfferType(ot.value)}
              />
              <Label htmlFor={`ot-${ot.value}`} className="cursor-pointer text-sm font-normal text-gray-400">
                {ot.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
