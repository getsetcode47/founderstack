'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function SubmitToolForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    website_url: '',
    contact_name: '',
    contact_email: '',
    category: '',
    details: '',
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('partner_submissions').insert({
      ...form,
      category: form.category || null,
      details: form.details || null,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setForm({
      company_name: '',
      website_url: '',
      contact_name: '',
      contact_email: '',
      category: '',
      details: '',
    });
    toast.success('Submission received. We will review it shortly.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-gray-300">
          <span>Company name</span>
          <input
            required
            value={form.company_name}
            onChange={(event) => setForm((prev) => ({ ...prev, company_name: event.target.value }))}
            className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-white focus:border-gray-600 focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm text-gray-300">
          <span>Website URL</span>
          <input
            required
            type="url"
            value={form.website_url}
            onChange={(event) => setForm((prev) => ({ ...prev, website_url: event.target.value }))}
            className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-white focus:border-gray-600 focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm text-gray-300">
          <span>Contact name</span>
          <input
            required
            value={form.contact_name}
            onChange={(event) => setForm((prev) => ({ ...prev, contact_name: event.target.value }))}
            className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-white focus:border-gray-600 focus:outline-none"
          />
        </label>
        <label className="space-y-2 text-sm text-gray-300">
          <span>Contact email</span>
          <input
            required
            type="email"
            value={form.contact_email}
            onChange={(event) => setForm((prev) => ({ ...prev, contact_email: event.target.value }))}
            className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-white focus:border-gray-600 focus:outline-none"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-gray-300">
        <span>Category</span>
        <input
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          placeholder="AI, Dev Tools, Marketing, Cloud..."
          className="h-12 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-white focus:border-gray-600 focus:outline-none"
        />
      </label>

      <label className="space-y-2 text-sm text-gray-300">
        <span>Offer details</span>
        <textarea
          value={form.details}
          onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
          rows={6}
          placeholder="Tell us about your startup perk, partner program, target stage, and the offer you want listed."
          className="w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-white focus:border-gray-600 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-md bg-white px-5 text-sm font-medium text-black transition hover:bg-gray-100 disabled:opacity-70"
      >
        {loading ? 'Submitting...' : 'Submit partner deal'}
      </button>
    </form>
  );
}
