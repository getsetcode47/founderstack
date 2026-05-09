'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Category, OfferType } from '@/types';

interface PerkFormProps {
  categories: Category[];
  perk?: any;
}

export function PerkForm({ categories, perk }: PerkFormProps) {
  const router = useRouter();
  const isEdit = !!perk;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    tool_name: perk?.tool_name ?? '',
    description: perk?.description ?? '',
    short_description: perk?.short_description ?? '',
    category_id: perk?.category_id ?? '',
    value_amount: perk?.value_amount?.toString() ?? '',
    offer_type: (perk?.offer_type ?? 'credit') as OfferType,
    logo_url: perk?.logo_url ?? '',
    redemption_link: perk?.redemption_link ?? '',
    expiry_date: perk?.expiry_date ? perk.expiry_date.split('T')[0] : '',
    is_featured: perk?.is_featured ?? false,
    is_active: perk?.is_active ?? true,
  });

  const supabase = createClient();

  function update(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.tool_name || !form.description || !form.value_amount) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      value_amount: parseFloat(form.value_amount),
      category_id: form.category_id || null,
      expiry_date: form.expiry_date || null,
    };
    let error;
    if (isEdit) {
      ({ error } = await supabase.from('perks').update(payload).eq('id', perk.id));
    } else {
      ({ error } = await supabase.from('perks').insert(payload));
    }
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isEdit ? 'Perk updated!' : 'Perk created!');
      router.push('/admin/perks');
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-5 rounded-2xl border border-gray-800 bg-white/[0.03] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Basic Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Tool name <span className="text-red-500">*</span></Label>
            <Input value={form.tool_name} onChange={(e) => update('tool_name', e.target.value)} placeholder="e.g. Vercel" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category_id} onValueChange={(v) => update('category_id', v)}>
              <SelectTrigger className="h-10"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Short description (2 lines max)</Label>
          <Input value={form.short_description} onChange={(e) => update('short_description', e.target.value)} placeholder="Brief summary shown on cards" className="h-10" />
        </div>

        <div className="space-y-1.5">
          <Label>Full description <span className="text-red-500">*</span></Label>
          <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Detailed description with redemption notes..." rows={5} />
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-gray-800 bg-white/[0.03] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Offer Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Value (USD) <span className="text-red-500">*</span></Label>
            <Input type="number" value={form.value_amount} onChange={(e) => update('value_amount', e.target.value)} placeholder="e.g. 5000" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label>Offer type</Label>
            <Select value={form.offer_type} onValueChange={(v) => update('offer_type', v as OfferType)}>
              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">API Credit</SelectItem>
                <SelectItem value="discount">Discount</SelectItem>
                <SelectItem value="free_trial">Free Trial</SelectItem>
                <SelectItem value="lifetime">Lifetime Deal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Logo URL</Label>
            <Input value={form.logo_url} onChange={(e) => update('logo_url', e.target.value)} placeholder="https://..." className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label>Redemption link</Label>
            <Input value={form.redemption_link} onChange={(e) => update('redemption_link', e.target.value)} placeholder="https://..." className="h-10" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Expiry date (optional)</Label>
          <Input type="date" value={form.expiry_date} onChange={(e) => update('expiry_date', e.target.value)} className="h-10 max-w-xs" />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-800 bg-white/[0.03] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">Visibility</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Active</p>
            <p className="text-xs text-gray-400">Perk is visible and claimable</p>
          </div>
          <Switch checked={form.is_active} onCheckedChange={(v) => update('is_active', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Featured</p>
            <p className="text-xs text-gray-400">Show on the homepage featured section</p>
          </div>
          <Switch checked={form.is_featured} onCheckedChange={(v) => update('is_featured', v)} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving} className="h-10 gap-2 bg-white text-black hover:bg-gray-100">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create perk'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="h-10 gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
