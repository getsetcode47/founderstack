'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock3, Download, Mail, Play, Send, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { OutreachAudienceSummary, OutreachCampaignRecord } from '@/lib/admin-outreach';

interface AdminOutreachClientProps {
  summary: OutreachAudienceSummary;
  campaigns?: OutreachCampaignRecord[];
}

export function AdminOutreachClient({ summary, campaigns = [] }: AdminOutreachClientProps) {
  const [includeFreeMembers, setIncludeFreeMembers] = useState(true);
  const [includeFreeDealLeads, setIncludeFreeDealLeads] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Upgrade to Pro');
  const [ctaUrl, setCtaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingQueue, setProcessingQueue] = useState(false);

  useEffect(() => {
    if (ctaUrl) return;
    if (typeof window === 'undefined') return;
    setCtaUrl(`${window.location.origin}/dashboard/billing`);
  }, [ctaUrl]);

  const selectedCount = useMemo(() => {
    if (includeFreeMembers && includeFreeDealLeads) return summary.combinedCount;
    if (includeFreeMembers) return summary.freeMembersCount;
    if (includeFreeDealLeads) return summary.freeDealLeadsCount;
    return 0;
  }, [includeFreeDealLeads, includeFreeMembers, summary]);

  async function handleSend() {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          ctaLabel,
          ctaUrl,
          includeFreeMembers,
          includeFreeDealLeads,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to send campaign.');
        return;
      }

      toast.success(`Campaign queued successfully.`);
    } catch {
      toast.error('Unable to send campaign right now.');
    } finally {
      setLoading(false);
    }
  }

  async function handleProcessQueue() {
    setProcessingQueue(true);
    try {
      const response = await fetch('/api/admin/outreach/process', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to process outreach queue.');
        return;
      }
      const count = Array.isArray(data.processed) ? data.processed.length : 0;
      toast.success(count > 0 ? `Processed ${count} queued campaign${count === 1 ? '' : 's'}.` : 'No queued campaigns to process.');
    } catch {
      toast.error('Unable to process outreach queue right now.');
    } finally {
      setProcessingQueue(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Outreach</p>
        <h1 className="mt-3 text-4xl text-white">Email your existing free users and free-deals leads</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
          Send upgrade emails through Resend to everyone who signed up but has not purchased a paid plan yet, plus the verified free-deals leads list.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Free-plan signups" value={summary.freeMembersCount} icon={Users} />
        <StatCard label="Free-deals leads" value={summary.freeDealLeadsCount} icon={Sparkles} />
        <StatCard label="Combined unique audience" value={summary.combinedCount} icon={Mail} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Audience</p>
          <h2 className="mt-3 text-2xl text-white">Choose who should receive this email</h2>

          <div className="mt-6 space-y-4">
            <label className="flex items-start gap-3 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={includeFreeMembers}
                onChange={(event) => setIncludeFreeMembers(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-black text-white"
              />
              <div>
                <p className="text-sm font-medium text-white">Free-plan users on the platform</p>
                <p className="mt-1 text-sm text-gray-400">
                  Signed-up members who have not purchased Monthly, Annual, or Lifetime yet.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={includeFreeDealLeads}
                onChange={(event) => setIncludeFreeDealLeads(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-black text-white"
              />
              <div>
                <p className="text-sm font-medium text-white">Verified free-deals leads</p>
                <p className="mt-1 text-sm text-gray-400">
                  People who submitted and verified their email through the free-deals page.
                </p>
              </div>
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Recipients selected</p>
            <p className="mt-3 text-4xl text-white">{selectedCount}</p>
            <p className="mt-2 text-sm text-gray-400">Duplicates across both lists are automatically removed.</p>
          </div>
          <Link
            href="/api/admin/export/outreach"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-200 hover:border-white/20 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export outreach audience CSV
          </Link>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Campaign</p>
          <h2 className="mt-3 text-2xl text-white">Compose the email</h2>

          <div className="mt-6 grid gap-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Subject</label>
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Example: Unlock founder-only perks before they expire"
                className="h-11 border-gray-800 bg-white/[0.03] text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Message</label>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write the campaign body here. Line breaks are preserved in the email."
                rows={10}
                className="border-gray-800 bg-white/[0.03] text-white placeholder:text-gray-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">CTA label</label>
                <Input
                  value={ctaLabel}
                  onChange={(event) => setCtaLabel(event.target.value)}
                  placeholder="Upgrade to Pro"
                  className="h-11 border-gray-800 bg-white/[0.03] text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-300">CTA link</label>
                <Input
                  value={ctaUrl}
                  onChange={(event) => setCtaUrl(event.target.value)}
                  placeholder="https://founderstackhub.com/dashboard/billing"
                  className="h-11 border-gray-800 bg-white/[0.03] text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              Campaigns are queued first. You can process them manually here or trigger the queue from a cron job in production.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleProcessQueue}
                disabled={processingQueue}
                variant="outline"
                className="h-11 gap-2 border-gray-700 bg-black text-white hover:bg-white/5"
              >
                <Play className="h-4 w-4" />
                {processingQueue ? 'Processing queue...' : 'Process queued campaigns'}
              </Button>
              <Button
                onClick={handleSend}
                disabled={loading || selectedCount === 0}
                className="h-11 gap-2 bg-white text-black hover:bg-gray-100"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Queueing campaign...' : `Queue campaign for ${selectedCount}`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-cyan-300" />
          <h2 className="text-lg text-white">Recent campaigns</h2>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-white/[0.02]">
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Subject</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Recipients</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Sent</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-900/80">
                    <td className="px-5 py-4 text-white">{campaign.subject}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full border border-gray-700 bg-white/[0.03] px-2.5 py-1 text-xs capitalize text-gray-200">
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">{campaign.recipient_count}</td>
                    <td className="px-5 py-4 text-gray-300">
                      {campaign.sent_count}
                      {campaign.failed_count ? <span className="text-red-300"> / {campaign.failed_count} failed</span> : null}
                    </td>
                    <td className="px-5 py-4 text-gray-400">{new Date(campaign.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {campaigns.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-500">No outreach campaigns queued yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[24px] border border-gray-800 bg-black p-5">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon className="h-4 w-4 text-cyan-300" />
        <p className="text-sm uppercase tracking-[0.2em]">{label}</p>
      </div>
      <p className="mt-4 text-4xl text-white">{value}</p>
    </div>
  );
}
