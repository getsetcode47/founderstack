'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, Rocket, ShieldAlert, Siren, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { OutreachCampaignRecord } from '@/lib/admin-outreach';

interface LaunchReadinessClientProps {
  checks: { label: string; ok: boolean }[];
  webhookEvents: Array<{
    id: string;
    stripe_event_id: string;
    event_type: string;
    processing_status: string;
    error_message: string | null;
    received_at: string;
    processed_at: string | null;
  }>;
  appErrors: Array<{
    id: string;
    source: string;
    route: string | null;
    message: string;
    created_at: string;
  }>;
  campaigns: OutreachCampaignRecord[];
}

const smokeTests = [
  { label: 'Sign up flow', href: '/sign-in?mode=signup&redirectTo=%2Fdashboard%2Fbilling' },
  { label: 'Billing checkout', href: '/dashboard/billing' },
  { label: 'Free deals verification', href: '/free-deals' },
  { label: 'Admin deal editing', href: '/dashboard/new-deals' },
  { label: 'Admin outreach queue', href: '/dashboard/outreach' },
];

export function LaunchReadinessClient({ checks, webhookEvents, appErrors, campaigns }: LaunchReadinessClientProps) {
  const passed = checks.filter((check) => check.ok).length;
  const [replayingId, setReplayingId] = useState<string | null>(null);

  async function handleReplay(stripeEventId: string) {
    setReplayingId(stripeEventId);
    try {
      const response = await fetch('/api/admin/stripe/replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeEventId }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to replay webhook.');
        return;
      }
      toast.success('Webhook replayed successfully.');
    } catch {
      toast.error('Unable to replay webhook right now.');
    } finally {
      setReplayingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Launch readiness</p>
        <h1 className="mt-3 text-4xl text-white">Production checks, monitoring, and smoke-test shortcuts</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
          This page brings together the operational checks you want right before launch: config readiness, Stripe webhook health, recent app errors, outreach queue activity, and the core smoke-test routes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Checks passing" value={`${passed}/${checks.length}`} icon={Rocket} />
        <SummaryCard label="Recent webhook failures" value={String(webhookEvents.filter((item) => item.processing_status === 'failed').length)} icon={Siren} />
        <SummaryCard label="Recent app errors" value={String(appErrors.length)} icon={ShieldAlert} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-300" />
            <h2 className="text-lg text-white">Config checks</h2>
          </div>
          <div className="mt-5 space-y-3">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-gray-200">{check.label}</span>
                <span className={`inline-flex items-center gap-2 text-sm ${check.ok ? 'text-emerald-300' : 'text-red-300'}`}>
                  {check.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  {check.ok ? 'Ready' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-cyan-300" />
            <h2 className="text-lg text-white">Smoke-test shortcuts</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {smokeTests.map((test) => (
              <Link
                key={test.href}
                href={test.href}
                className="group rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-4 transition hover:border-gray-700"
              >
                <p className="text-sm font-medium text-white">{test.label}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-gray-400 group-hover:text-white">
                  Open test
                  <ExternalLink className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-500">
            Stripe webhook upgrade still needs a real Stripe event after checkout in your deployed environment.
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="text-lg text-white">Recent Stripe webhook events</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-white/[0.02]">
                  {['Event', 'Status', 'Received', 'Details', 'Action'].map((column) => (
                    <th key={column} className="px-5 py-3 text-left font-medium text-gray-400">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {webhookEvents.map((item) => (
                  <tr key={item.id} className="border-b border-gray-900/80">
                    <td className="px-5 py-4 text-gray-200">{item.event_type}</td>
                    <td className="px-5 py-4 text-gray-200">{item.processing_status}</td>
                    <td className="px-5 py-4 text-gray-200">{new Date(item.received_at).toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-200">{item.error_message || item.stripe_event_id}</td>
                    <td className="px-5 py-4">
                      {item.processing_status === 'failed' ? (
                        <button
                          type="button"
                          onClick={() => handleReplay(item.stripe_event_id)}
                          disabled={replayingId === item.stripe_event_id}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-white/[0.03] px-3 py-1.5 text-xs text-white hover:border-gray-500 disabled:opacity-60"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          {replayingId === item.stripe_event_id ? 'Replaying...' : 'Replay'}
                        </button>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {webhookEvents.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-500">No Stripe webhook activity logged yet.</div>
            )}
          </div>
        </div>
      </div>

      <SectionTable
        title="Recent app errors"
        columns={['Source', 'Route', 'Message', 'Created']}
        rows={appErrors.map((item) => [
          item.source,
          item.route || '—',
          item.message,
          new Date(item.created_at).toLocaleString(),
        ])}
        emptyText="No logged app errors yet."
      />

      <SectionTable
        title="Recent outreach campaigns"
        columns={['Subject', 'Status', 'Recipients', 'Created']}
        rows={campaigns.map((item) => [
          item.subject,
          item.status,
          `${item.sent_count}/${item.recipient_count} sent`,
          new Date(item.created_at).toLocaleString(),
        ])}
        emptyText="No outreach campaigns queued yet."
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Rocket;
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

function SectionTable({
  title,
  columns,
  rows,
  emptyText,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  emptyText: string;
}) {
  return (
    <div className="rounded-[28px] border border-gray-800 bg-black p-6">
      <h2 className="text-lg text-white">{title}</h2>
      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/[0.02]">
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3 text-left font-medium text-gray-400">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-b border-gray-900/80">
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="px-5 py-4 text-gray-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">{emptyText}</div>
          )}
        </div>
      </div>
    </div>
  );
}
