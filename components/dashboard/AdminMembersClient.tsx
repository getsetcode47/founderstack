'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Link from 'next/link';
import { Activity, Download, Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { DealClaim, PlanType, Profile } from '@/types';

type RangeOption = 7 | 30 | 90 | 365;

interface MemberClaimRow extends Pick<DealClaim, 'id' | 'user_id' | 'created_at'> {
  deals?: {
    name: string;
    deal_headline: string;
  } | null;
}

interface AdminMembersClientProps {
  profiles: Profile[];
  claims: MemberClaimRow[];
}

const RANGE_OPTIONS: { label: string; value: RangeOption }[] = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last year', value: 365 },
];

const planBadgeClasses: Record<PlanType, string> = {
  free: 'border border-gray-700 bg-white/[0.03] text-gray-300',
  monthly: 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  annual: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  lifetime: 'border border-amber-500/20 bg-amber-500/10 text-amber-300',
};

function getPlanLabel(profile: Profile) {
  if (profile.plan_type === 'lifetime' || profile.lifetime_access) return 'Lifetime';
  if (profile.plan_type === 'annual') return 'Annual';
  if (profile.plan_type === 'monthly') return 'Monthly';
  return 'Free';
}

function getPlanType(profile: Profile): PlanType {
  if (profile.lifetime_access) return 'lifetime';
  return profile.plan_type || 'free';
}

function getInitial(name: string | null | undefined) {
  return (name || 'U').trim().charAt(0).toUpperCase() || 'U';
}

function formatCompactDate(input: string) {
  return new Date(input).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatLongDate(input: string) {
  return new Date(input).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AdminMembersClient({ profiles, claims }: AdminMembersClientProps) {
  const [selectedRange, setSelectedRange] = useState<RangeOption>(30);
  const [search, setSearch] = useState('');

  const analytics = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (selectedRange - 1));

    const dayKeys = Array.from({ length: selectedRange }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });

    const seriesMap = new Map(
      dayKeys.map((day) => [
        day.toISOString().slice(0, 10),
        { label: formatCompactDate(day.toISOString()), users: 0, claims: 0 },
      ])
    );

    const recentProfiles = profiles.filter((profile) => new Date(profile.created_at) >= start);
    const recentClaims = claims.filter((claim) => new Date(claim.created_at) >= start);

    recentProfiles.forEach((profile) => {
      const key = profile.created_at.slice(0, 10);
      const current = seriesMap.get(key);
      if (current) current.users += 1;
    });

    recentClaims.forEach((claim) => {
      const key = claim.created_at.slice(0, 10);
      const current = seriesMap.get(key);
      if (current) current.claims += 1;
    });

    const claimCountByUser = new Map<string, number>();
    const claimNamesByUser = new Map<string, string[]>();
    const topDealsMap = new Map<string, number>();

    claims.forEach((claim) => {
      claimCountByUser.set(claim.user_id, (claimCountByUser.get(claim.user_id) || 0) + 1);

      const dealName = claim.deals?.name;
      if (dealName) {
        const currentNames = claimNamesByUser.get(claim.user_id) || [];
        if (!currentNames.includes(dealName) && currentNames.length < 4) {
          claimNamesByUser.set(claim.user_id, [...currentNames, dealName]);
        } else if (!claimNamesByUser.has(claim.user_id)) {
          claimNamesByUser.set(claim.user_id, currentNames);
        }
      }
    });

    recentClaims.forEach((claim) => {
      const dealName = claim.deals?.name || 'Unknown deal';
      topDealsMap.set(dealName, (topDealsMap.get(dealName) || 0) + 1);
    });

    const enrichedMembers = profiles.map((profile) => ({
      ...profile,
      claimCount: claimCountByUser.get(profile.id) || 0,
      claimedDeals: claimNamesByUser.get(profile.id) || [],
      planLabel: getPlanLabel(profile),
      planType: getPlanType(profile),
    }));

    const filteredMembers = enrichedMembers.filter((member) => {
      const haystack = [
        member.username || '',
        member.referral_code || '',
        member.planLabel,
        member.subscription_status || '',
        member.claimedDeals.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(search.toLowerCase());
    });

    const planCounts = enrichedMembers.reduce<Record<string, number>>((acc, member) => {
      acc[member.planType] = (acc[member.planType] || 0) + 1;
      return acc;
    }, {});

    const topDeals = Array.from(topDealsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalMembers: profiles.length,
      newMembersInRange: recentProfiles.length,
      claimsInRange: recentClaims.length,
      activePaidMembers: enrichedMembers.filter((member) => member.planType !== 'free').length,
      recentMembers: [...profiles]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 5)
        .map((profile) => ({
          id: profile.id,
          username: profile.username || 'Unnamed member',
          created_at: profile.created_at,
        })),
      topDeals,
      planCounts,
      filteredMembers,
      series: Array.from(seriesMap.values()),
    };
  }, [profiles, claims, search, selectedRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Members</p>
          <h1 className="mt-3 text-4xl text-white">Platform members and claim activity</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Track member growth, plan mix, claimed deals, and the most-used offers from one admin view.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/api/admin/export/members"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-200 hover:border-white/20 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export members CSV
          </Link>
          <Link
            href="/api/admin/export/claims"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-200 hover:border-white/20 hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export claims CSV
          </Link>
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedRange(option.value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedRange === option.value
                  ? 'border-white bg-white text-black'
                  : 'border-gray-800 bg-black text-gray-300 hover:border-gray-700 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MetricCard
          title={`+${analytics.newMembersInRange}`}
          subtitle="users"
          icon={Users}
          data={analytics.series}
          dataKey="users"
          stroke="#4ade80"
          fill="rgba(74, 222, 128, 0.15)"
        />
        <MetricCard
          title={analytics.claimsInRange.toLocaleString()}
          subtitle="deals claimed"
          icon={Activity}
          data={analytics.series}
          dataKey="claims"
          stroke="#22d3ee"
          fill="rgba(34, 211, 238, 0.15)"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="rounded-[28px] border border-gray-800 bg-black p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Plan breakdown</p>
              <h2 className="mt-2 text-2xl text-white">How your membership base looks today</h2>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-white/[0.03] px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Paid members</p>
              <p className="mt-2 text-2xl text-white">{analytics.activePaidMembers}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {(['free', 'monthly', 'annual', 'lifetime'] as PlanType[]).map((plan) => (
              <div key={plan} className="rounded-2xl border border-gray-800 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{plan}</p>
                <p className="mt-3 text-3xl text-white">{analytics.planCounts[plan] || 0}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Free', count: analytics.planCounts.free || 0 },
                { name: 'Monthly', count: analytics.planCounts.monthly || 0 },
                { name: 'Annual', count: analytics.planCounts.annual || 0 },
                { name: 'Lifetime', count: analytics.planCounts.lifetime || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 12,
                    border: '1px solid #374151',
                    backgroundColor: '#020617',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6">
          <ListCard
            title="Most used deals"
            items={analytics.topDeals.map((deal) => ({
              key: deal.name,
              primary: deal.name,
              secondary: `${deal.count} claims`,
            }))}
            emptyText="No deal claims yet"
          />

          <ListCard
            title="Last members signed up"
            items={analytics.recentMembers.map((member) => ({
              key: member.id,
              primary: member.username,
              secondary: formatLongDate(member.created_at),
            }))}
            emptyText="No member signups yet"
            withAvatar
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">All members</p>
            <h2 className="mt-2 text-2xl text-white">Plans, claims, and signup history</h2>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, plan, claim, or referral code"
              className="h-11 border-gray-800 bg-white/[0.03] pl-10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-white/[0.02]">
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Member</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Plan</th>
                  <th className="hidden px-5 py-3 text-left font-medium text-gray-400 lg:table-cell">Joined</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Claims</th>
                  <th className="hidden px-5 py-3 text-left font-medium text-gray-400 xl:table-cell">Claimed deals</th>
                </tr>
              </thead>
              <tbody>
                {analytics.filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-900/80 transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                          {getInitial(member.username)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{member.username || 'Unnamed member'}</p>
                          <p className="font-mono text-xs text-gray-500">{member.id.slice(0, 12)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${planBadgeClasses[member.planType]}`}>
                          {member.planLabel}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {member.subscription_status || member.role}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 text-gray-400 lg:table-cell">
                      {formatLongDate(member.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-white/[0.03] px-3 py-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                        <span className="text-white">{member.claimCount}</span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-4 xl:table-cell">
                      {member.claimedDeals.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {member.claimedDeals.map((deal) => (
                            <span
                              key={`${member.id}-${deal}`}
                              className="inline-flex rounded-full border border-gray-800 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300"
                            >
                              {deal}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No claimed deals yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {analytics.filteredMembers.length === 0 && (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-3 h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">No members match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  subtitle,
  icon: Icon,
  data,
  dataKey,
  stroke,
  fill,
}: {
  title: string;
  subtitle: string;
  icon: typeof Users;
  data: { label: string; users: number; claims: number }[];
  dataKey: 'users' | 'claims';
  stroke: string;
  fill: string;
}) {
  return (
    <div className="rounded-[28px] border border-gray-800 bg-black p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-4xl font-semibold text-white">{title}</p>
          <p className="mt-2 text-lg text-gray-300">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-3">
          <Icon className="h-5 w-5 text-cyan-300" />
        </div>
      </div>

      <div className="mt-6 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`${dataKey}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stroke} stopOpacity={0.45} />
                <stop offset="95%" stopColor={stroke} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 12,
                border: '1px solid #374151',
                backgroundColor: '#020617',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              fillOpacity={1}
              fill={`url(#${dataKey}-fill)`}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  emptyText,
  withAvatar = false,
}: {
  title: string;
  items: { key: string; primary: string; secondary: string }[];
  emptyText: string;
  withAvatar?: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-gray-800 bg-black p-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-cyan-300" />
        <h2 className="text-lg text-white">{title}</h2>
      </div>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">{emptyText}</p>
        ) : (
          items.map((item, index) => (
            <div key={item.key} className="flex items-center gap-3">
              <div className="w-6 text-sm text-gray-500">{index + 1}.</div>
              {withAvatar ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
                  {getInitial(item.primary)}
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-white/[0.03] text-sm font-semibold text-white">
                  {getInitial(item.primary)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{item.primary}</p>
                <p className="text-sm text-gray-500">{item.secondary}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
