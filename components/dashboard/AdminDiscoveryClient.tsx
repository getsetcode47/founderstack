'use client';

import { useState } from 'react';
import { Bot, CheckCircle2, Globe, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { DiscoveryCandidate, DiscoveryRun, DiscoverySource } from '@/lib/deal-discovery';

interface AdminDiscoveryClientProps {
  overview: {
    activeSources: number;
    totalRuns: number;
    pendingCandidates: number;
    approvedCandidates: number;
  };
  sources: DiscoverySource[];
  runs: DiscoveryRun[];
  candidates: DiscoveryCandidate[];
}

export function AdminDiscoveryClient({ overview, sources, runs, candidates }: AdminDiscoveryClientProps) {
  const [form, setForm] = useState({
    name: '',
    sourceType: 'startup_program',
    homepageUrl: '',
    crawlUrl: '',
    parserHint: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  async function handleAddSource() {
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/discovery/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to add source.');
        return;
      }
      toast.success('Source added. Refresh to see it in the registry.');
      setForm({ name: '', sourceType: 'startup_program', homepageUrl: '', crawlUrl: '', parserHint: '', notes: '' });
    } catch {
      toast.error('Unable to add source right now.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleScan(sourceId: string) {
    setScanningId(sourceId);
    try {
      const response = await fetch(`/api/admin/discovery/sources/${sourceId}/scan`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to run scan.');
        return;
      }
      toast.success('Scan queued and snapshot stored. Refresh to review candidates.');
    } catch {
      toast.error('Unable to run scan right now.');
    } finally {
      setScanningId(null);
    }
  }

  async function handleApprove(candidateId: string) {
    setApprovingId(candidateId);
    try {
      const response = await fetch(`/api/admin/discovery/candidates/${candidateId}/approve`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Unable to publish candidate.');
        return;
      }
      toast.success(`Published candidate as deal ${data.slug}. Refresh to see the updated queue.`);
    } catch {
      toast.error('Unable to publish candidate right now.');
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">AI deal discovery</p>
        <h1 className="mt-3 text-4xl text-white">Source registry, crawl runs, and review queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
          This is phase 1 of the AI agent system: track trusted sources, save crawl snapshots, generate candidate deals, and promote the good ones into the live catalog.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active sources" value={overview.activeSources} icon={Globe} />
        <StatCard label="Total crawl runs" value={overview.totalRuns} icon={RefreshCw} />
        <StatCard label="Pending candidates" value={overview.pendingCandidates} icon={Sparkles} />
        <StatCard label="Approved candidates" value={overview.approvedCandidates} icon={CheckCircle2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Add source</p>
          <h2 className="mt-3 text-2xl text-white">Register a new place to watch</h2>
          <div className="mt-5 grid gap-4">
            <input className={inputClass} placeholder="Source name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <input className={inputClass} placeholder="Source type" value={form.sourceType} onChange={(e) => setForm((prev) => ({ ...prev, sourceType: e.target.value }))} />
            <input className={inputClass} placeholder="Homepage URL" value={form.homepageUrl} onChange={(e) => setForm((prev) => ({ ...prev, homepageUrl: e.target.value }))} />
            <input className={inputClass} placeholder="Crawl URL" value={form.crawlUrl} onChange={(e) => setForm((prev) => ({ ...prev, crawlUrl: e.target.value }))} />
            <input className={inputClass} placeholder="Parser hint (optional)" value={form.parserHint} onChange={(e) => setForm((prev) => ({ ...prev, parserHint: e.target.value }))} />
            <textarea className={`${inputClass} min-h-[100px] py-3`} placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
            <button onClick={handleAddSource} disabled={submitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {submitting ? 'Adding source...' : 'Add source'}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Source registry</p>
          <h2 className="mt-3 text-2xl text-white">Managed discovery inputs</h2>
          <div className="mt-5 space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-gray-800 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base text-white">{source.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{source.crawl_url}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-600">{source.source_type}</p>
                  </div>
                  <button onClick={() => handleScan(source.id)} disabled={scanningId === source.id} className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-700 px-3 text-xs text-white hover:border-gray-500 disabled:opacity-60">
                    <Bot className="h-3.5 w-3.5" />
                    {scanningId === source.id ? 'Scanning...' : 'Run scan'}
                  </button>
                </div>
              </div>
            ))}
            {sources.length === 0 && <div className="rounded-2xl border border-dashed border-gray-800 px-4 py-8 text-sm text-gray-500">No discovery sources added yet.</div>}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Candidate review queue</p>
        <h2 className="mt-3 text-2xl text-white">Approve the best findings into live deals</h2>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg text-white">{candidate.software_name}</p>
                  <p className="mt-1 text-sm text-gray-400">{candidate.headline}</p>
                </div>
                <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">{candidate.status}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-400">{candidate.conditions || 'No extracted conditions yet.'}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                <span>Value: {candidate.approx_value || '—'}</span>
                <span>Confidence: {Math.round(candidate.confidence * 100)}%</span>
                <span>Category: {candidate.category || '—'}</span>
              </div>
              <div className="mt-5 flex gap-3">
                {candidate.source_url ? (
                  <a href={candidate.source_url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-700 px-4 text-sm text-white hover:border-gray-500">
                    Source
                  </a>
                ) : null}
                {candidate.status !== 'approved' ? (
                  <button onClick={() => handleApprove(candidate.id)} disabled={approvingId === candidate.id} className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-100 disabled:opacity-60">
                    {approvingId === candidate.id ? 'Publishing...' : 'Publish as deal'}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {candidates.length === 0 && <div className="rounded-2xl border border-dashed border-gray-800 px-4 py-8 text-sm text-gray-500">No candidates generated yet. Run a scan from the source registry.</div>}
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Recent crawl runs</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-white/[0.02]">
                  {['Status', 'HTTP', 'Found', 'Started', 'Finished', 'Error'].map((column) => (
                    <th key={column} className="px-5 py-3 text-left font-medium text-gray-400">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-b border-gray-900/80">
                    <td className="px-5 py-4 text-gray-200">{run.status}</td>
                    <td className="px-5 py-4 text-gray-200">{run.http_status ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-200">{run.discovered_count}</td>
                    <td className="px-5 py-4 text-gray-200">{new Date(run.started_at).toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-200">{run.finished_at ? new Date(run.finished_at).toLocaleString() : '—'}</td>
                    <td className="px-5 py-4 text-gray-400">{run.error_message || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {runs.length === 0 && <div className="py-10 text-center text-sm text-gray-500">No crawl runs yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Globe }) {
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

const inputClass =
  'h-11 w-full rounded-xl border border-gray-800 bg-white/[0.03] px-4 text-sm text-white placeholder:text-gray-500 focus:border-gray-600 focus:outline-none';
