'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { applyFreeDealFlag, hasFreeDealFlag, stripFreeDealFlag } from '@/lib/free-deals';
import { DEFAULT_DEAL_CATEGORIES } from '@/lib/founderstack';
import type { Deal, DiscountMethod } from '@/types';
import { DealTradingCard } from './DealTradingCard';
import { DealInfoCard } from './DealInfoCard';

interface CustomAdminDealFormProps {
  deal?: Deal | null;
}

export function CustomAdminDealForm({ deal }: CustomAdminDealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: deal?.name ?? '',
    slug: deal?.slug ?? '',
    short_name: deal?.short_name ?? '',
    logo_type: deal?.logo_type ?? 'initial',
    logo_image_url: deal?.logo_image_url ?? '',
    logo_text: deal?.logo_text ?? '',
    brand_color: deal?.brand_color ?? '#ffffff',
    description: deal?.description ?? '',
    full_description: deal?.full_description ?? '',
    category: deal?.category ?? DEFAULT_DEAL_CATEGORIES[0],
    deal_headline: deal?.deal_headline ?? '',
    deal_details: deal?.deal_details ?? '',
    eligibility: deal?.eligibility ?? '',
    discount_method: (deal?.discount_method ?? 'link') as DiscountMethod,
    discount_code: deal?.discount_code ?? '',
    discount_url: deal?.discount_url ?? '',
    out_of_credits: deal?.out_of_credits ?? false,
    featured: deal?.featured ?? false,
    free_deal: hasFreeDealFlag(deal?.meta_description ?? null),
    published: deal?.published ?? true,
    sort_order: String(deal?.sort_order ?? 100),
    meta_title: deal?.meta_title ?? '',
    meta_description: stripFreeDealFlag(deal?.meta_description ?? '') ?? '',
  });

  const previewDeal = useMemo(
    () =>
      ({
        id: deal?.id ?? 'preview',
        created_at: deal?.created_at ?? new Date().toISOString(),
        updated_at: deal?.updated_at ?? new Date().toISOString(),
        ...form,
        short_name: form.short_name || null,
        logo_image_url: form.logo_image_url || null,
        logo_text: form.logo_text || null,
        discount_code: form.discount_code || null,
        discount_url: form.discount_url || null,
        sort_order: Number(form.sort_order) || 100,
      }) as Deal,
    [deal, form]
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      short_name: form.short_name || null,
      logo_image_url: form.logo_image_url || null,
      logo_text: form.logo_text || null,
      discount_code: form.discount_method === 'code' ? form.discount_code : null,
      discount_url: form.discount_method === 'link' ? form.discount_url : form.discount_url || null,
      sort_order: Number(form.sort_order) || 100,
      meta_title: form.meta_title || null,
      meta_description: applyFreeDealFlag(form.meta_description || null, form.free_deal),
    };

    const response = await fetch(deal ? `/api/custom-deals/${deal.id}` : '/api/custom-deals', {
      method: deal ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data.error || 'Unable to save deal.');
      return;
    }

    toast.success(deal ? 'Deal updated' : 'Deal created');
    router.push('/dashboard/new-deals');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-gray-800 bg-black p-6">
          <h2 className="text-lg font-medium text-white">Deal details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Tool name" required>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} required className={inputClass} />
            </Field>
            <Field label="Slug" required>
              <input value={form.slug} onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} required className={inputClass} />
            </Field>
            <Field label="Short name">
              <input value={form.short_name} onChange={(e) => update('short_name', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className={inputClass}>
                {DEFAULT_DEAL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>
            <Field label="Brand color" required>
              <div className="flex gap-3">
                <input type="color" value={form.brand_color} onChange={(e) => update('brand_color', e.target.value)} className="h-12 w-14 rounded-xl border border-gray-800 bg-transparent" />
                <input value={form.brand_color} onChange={(e) => update('brand_color', e.target.value)} className={`${inputClass} flex-1`} />
              </div>
            </Field>
            <Field label="Sort order" required>
              <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Logo type">
              <select value={form.logo_type} onChange={(e) => update('logo_type', e.target.value as 'image' | 'initial')} className={inputClass}>
                <option value="initial">Initial / text</option>
                <option value="image">Image URL</option>
              </select>
            </Field>
            <Field label="Fallback logo text">
              <input value={form.logo_text} onChange={(e) => update('logo_text', e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Logo image URL">
              <input value={form.logo_image_url} onChange={(e) => update('logo_image_url', e.target.value)} className={inputClass} />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Short description" required>
              <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} required className={textareaClass} />
            </Field>
            <Field label="Full description" required>
              <textarea rows={6} value={form.full_description} onChange={(e) => update('full_description', e.target.value)} required className={textareaClass} />
            </Field>
            <Field label="Deal headline" required>
              <textarea rows={3} value={form.deal_headline} onChange={(e) => update('deal_headline', e.target.value)} required className={textareaClass} />
            </Field>
            <Field label="Deal details / offer description" required>
              <textarea rows={5} value={form.deal_details} onChange={(e) => update('deal_details', e.target.value)} required className={textareaClass} />
            </Field>
            <Field label="Eligibility" required>
              <textarea rows={4} value={form.eligibility} onChange={(e) => update('eligibility', e.target.value)} required className={textareaClass} />
            </Field>
          </div>
        </section>

        <section className="rounded-[28px] border border-gray-800 bg-black p-6">
          <h2 className="text-lg font-medium text-white">Claim behavior & SEO</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Discount method" required>
              <select value={form.discount_method} onChange={(e) => update('discount_method', e.target.value as DiscountMethod)} className={inputClass}>
                <option value="link">External link</option>
                <option value="code">Promo code</option>
                <option value="locked">Locked / gated</option>
              </select>
            </Field>
            <Field label="Promo code">
              <input value={form.discount_code} onChange={(e) => update('discount_code', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Offer redeem link">
              <input value={form.discount_url} onChange={(e) => update('discount_url', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Meta title">
              <input value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Meta description">
              <textarea rows={4} value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} className={textareaClass} />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Toggle
              label="Show in Best Live Offers on homepage"
              checked={form.featured}
              onChange={(value) => update('featured', value)}
            />
            <Toggle
              label="Show on free deals page"
              checked={form.free_deal}
              onChange={(value) => update('free_deal', value)}
            />
            <Toggle label="Published" checked={form.published} onChange={(value) => update('published', value)} />
            <Toggle label="Out of credits" checked={form.out_of_credits} onChange={(value) => update('out_of_credits', value)} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition hover:bg-gray-100 disabled:opacity-70">
            {loading ? 'Saving...' : deal ? 'Save deal' : 'Create deal'}
          </button>
          <button type="button" onClick={() => router.push('/dashboard/new-deals')} className="inline-flex h-12 items-center justify-center rounded-md border border-gray-800 px-5 text-sm font-medium text-white transition hover:border-gray-600">
            Cancel
          </button>
        </div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-[28px] border border-gray-800 bg-black p-5">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Preview</p>
          <div className="mt-5 space-y-4">
            <DealTradingCard deal={previewDeal} />
            <DealInfoCard deal={previewDeal} initiallyAuthed />
          </div>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="space-y-2 text-sm text-gray-300">
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-gray-800 bg-white/[0.02] px-4 py-3 text-sm text-gray-200">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-white" />
    </label>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none';

const textareaClass =
  'w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-gray-600 focus:outline-none';
