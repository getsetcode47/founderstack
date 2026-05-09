'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PerkCard } from '@/components/perks/PerkCard';
import { PerkDetailModal } from '@/components/perks/PerkDetailModal';
import { DollarSign, Gift, Bookmark, ExternalLink, ArrowRight, Calendar } from 'lucide-react';
import type { Perk, PerkClaim, Profile } from '@/types';
import { formatValue } from '@/components/perks/PerkCard';

interface DashboardOverviewProps {
  profile: Profile | null;
  claims: (PerkClaim & { perks: Perk })[];
  bookmarkCount: number;
  totalSaved: number;
  recommendedPerks: Perk[];
}

export function DashboardOverview({
  profile,
  claims,
  bookmarkCount,
  totalSaved,
  recommendedPerks,
}: DashboardOverviewProps) {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null);

  const stats = [
    { icon: DollarSign, label: 'Total saved', value: formatValue(totalSaved), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
    { icon: Gift, label: 'Perks claimed', value: claims.length.toString(), color: 'text-cyan-400', bg: 'bg-cyan-500/10 border border-cyan-500/20' },
    { icon: Bookmark, label: 'Bookmarked', value: bookmarkCount.toString(), color: 'text-orange-400', bg: 'bg-orange-500/10 border border-orange-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-white">
          Welcome back, {profile?.username || 'Founder'}!
        </h1>
        <p className="text-sm text-gray-400">
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'today'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-0.5 text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">My Claimed Perks</h2>
          <Link href="/perks">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-gray-700 bg-black text-white hover:bg-white/5">
              Claim more
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {claims.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-white/[0.02] p-12 text-center">
            <Gift className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <h3 className="mb-1 font-semibold text-white">No claimed perks yet</h3>
            <p className="mb-5 text-sm text-gray-400">Start claiming perks to grow your startup stack</p>
            <Link href="/perks">
              <Button size="sm" className="bg-white text-black hover:bg-gray-100">Browse perks</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-white/[0.02]">
                    <th className="px-5 py-3 text-left font-medium text-gray-400">Tool</th>
                    <th className="hidden px-5 py-3 text-left font-medium text-gray-400 sm:table-cell">Category</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-400">Value</th>
                    <th className="hidden px-5 py-3 text-left font-medium text-gray-400 md:table-cell">Claimed</th>
                    <th className="px-5 py-3 text-right font-medium text-gray-400">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-900/80 transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-white">{claim.perks?.tool_name}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-gray-400">{(claim.perks as any)?.categories?.name ?? '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-emerald-400">
                          {formatValue(claim.perks?.value_amount ?? 0)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(claim.claimed_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {claim.perks?.redemption_link && (
                          <a
                            href={claim.perks.redemption_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Recommended for You</h2>
          <Link href="/perks">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-cyan-400 hover:bg-white/5 hover:text-cyan-300">
              See all
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {recommendedPerks.map((perk, i) => (
            <PerkCard key={perk.id} perk={perk} onOpenDetail={setSelectedPerk} index={i} />
          ))}
        </div>
      </div>

      {selectedPerk && (
        <PerkDetailModal perk={selectedPerk} onClose={() => setSelectedPerk(null)} />
      )}
    </div>
  );
}
