'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Star, StarOff, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatValue } from '@/components/perks/PerkCard';

interface AdminPerksClientProps {
  perks: any[];
}

export function AdminPerksClient({ perks: initialPerks }: AdminPerksClientProps) {
  const [perks, setPerks] = useState(initialPerks);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const filtered = perks.filter((p) =>
    p.tool_name.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleFeatured(perk: any) {
    const { error } = await supabase
      .from('perks')
      .update({ is_featured: !perk.is_featured })
      .eq('id', perk.id);
    if (!error) {
      setPerks((prev) => prev.map((p) => p.id === perk.id ? { ...p, is_featured: !p.is_featured } : p));
      toast.success(perk.is_featured ? 'Removed from featured' : 'Added to featured');
    }
  }

  async function toggleActive(perk: any) {
    const { error } = await supabase
      .from('perks')
      .update({ is_active: !perk.is_active })
      .eq('id', perk.id);
    if (!error) {
      setPerks((prev) => prev.map((p) => p.id === perk.id ? { ...p, is_active: !p.is_active } : p));
      toast.success(perk.is_active ? 'Perk deactivated' : 'Perk activated');
    }
  }

  async function deletePerk(id: string) {
    if (!confirm('Delete this perk? This cannot be undone.')) return;
    const { error } = await supabase.from('perks').delete().eq('id', id);
    if (!error) {
      setPerks((prev) => prev.filter((p) => p.id !== id));
      toast.success('Perk deleted');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Perks</h1>
          <p className="mt-1 text-sm text-gray-400">{perks.length} total perks</p>
        </div>
        <Link href="/admin/perks/new">
          <Button className="h-9 gap-2 bg-white text-black hover:bg-gray-100">
            <Plus className="w-4 h-4" />
            New perk
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search perks..."
          className="h-10 border-gray-800 bg-white/[0.03] pl-10 text-white placeholder:text-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/[0.02]">
                <th className="px-5 py-3 text-left font-medium text-gray-400">Tool</th>
                <th className="hidden px-5 py-3 text-left font-medium text-gray-400 sm:table-cell">Category</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Value</th>
                <th className="hidden px-5 py-3 text-left font-medium text-gray-400 md:table-cell">Claims</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Status</th>
                <th className="px-5 py-3 text-right font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((perk) => (
                <tr key={perk.id} className="border-b border-gray-900/80 transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-white">{perk.tool_name}</p>
                      <p className="text-xs capitalize text-gray-500">{perk.offer_type.replace('_', ' ')}</p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-gray-400 sm:table-cell">
                    {perk.categories?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-emerald-400">
                      {formatValue(perk.value_amount)}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-gray-400 md:table-cell">
                    {perk.claim_count.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${perk.is_active ? 'bg-green-500' : 'bg-slate-400'}`} />
                      <span className="text-xs text-gray-400">
                        {perk.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {perk.is_featured && <Badge variant="secondary" className="border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0 text-xs text-cyan-300">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleFeatured(perk)}
                        title={perk.is_featured ? 'Unfeature' : 'Feature'}
                        className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-amber-500/10 hover:text-amber-400"
                      >
                        {perk.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleActive(perk)}
                        title={perk.is_active ? 'Deactivate' : 'Activate'}
                        className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-green-500/10 hover:text-green-400"
                      >
                        {perk.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <Link href={`/admin/perks/${perk.id}`}>
                        <button className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-cyan-500/10 hover:text-cyan-400">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => deletePerk(perk.id)}
                        className="rounded-lg p-1.5 text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500">No perks found</div>
          )}
        </div>
      </div>
    </div>
  );
}
