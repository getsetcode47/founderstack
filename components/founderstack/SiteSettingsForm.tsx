'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/types';

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(settings);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('site_settings').update({
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      hero_tagline: form.hero_tagline,
      hero_description: form.hero_description,
      cta_primary_text: form.cta_primary_text,
      cta_primary_link: form.cta_primary_link,
      cta_secondary_text: form.cta_secondary_text,
      cta_secondary_link: form.cta_secondary_link,
      footer_text: form.footer_text,
    }).eq('id', form.id);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Site settings updated');
  }

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h1 className="text-3xl font-medium text-white">Global settings</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Hero title"><input value={form.hero_title} onChange={(e) => update('hero_title', e.target.value)} className={inputClass} /></Field>
          <Field label="Hero subtitle"><input value={form.hero_subtitle} onChange={(e) => update('hero_subtitle', e.target.value)} className={inputClass} /></Field>
          <Field label="Hero tagline"><input value={form.hero_tagline} onChange={(e) => update('hero_tagline', e.target.value)} className={inputClass} /></Field>
          <Field label="Footer text"><input value={form.footer_text} onChange={(e) => update('footer_text', e.target.value)} className={inputClass} /></Field>
          <Field label="Primary CTA text"><input value={form.cta_primary_text} onChange={(e) => update('cta_primary_text', e.target.value)} className={inputClass} /></Field>
          <Field label="Primary CTA link"><input value={form.cta_primary_link} onChange={(e) => update('cta_primary_link', e.target.value)} className={inputClass} /></Field>
          <Field label="Secondary CTA text"><input value={form.cta_secondary_text} onChange={(e) => update('cta_secondary_text', e.target.value)} className={inputClass} /></Field>
          <Field label="Secondary CTA link"><input value={form.cta_secondary_link} onChange={(e) => update('cta_secondary_link', e.target.value)} className={inputClass} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Hero description">
            <textarea rows={5} value={form.hero_description} onChange={(e) => update('hero_description', e.target.value)} className={textareaClass} />
          </Field>
        </div>
      </section>
      <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition hover:bg-gray-100 disabled:opacity-70">
        {loading ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-gray-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white focus:border-gray-600 focus:outline-none';
const textareaClass =
  'w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-gray-600 focus:outline-none';
