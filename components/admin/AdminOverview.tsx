'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Users, Activity, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatValue } from '@/components/perks/PerkCard';

interface AdminOverviewProps {
  totalPerks: number;
  totalUsers: number;
  totalClaims: number;
  recentClaims: any[];
}

export function AdminOverview({ totalPerks, totalUsers, totalClaims, recentClaims }: AdminOverviewProps) {
  const stats = [
    { icon: Gift, label: 'Total Perks', value: totalPerks.toString(), color: 'text-cyan-400', bg: 'bg-cyan-500/10 border border-cyan-500/20' },
    { icon: Users, label: 'Registered Users', value: totalUsers.toLocaleString(), color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
    { icon: Activity, label: 'Total Claims', value: totalClaims.toLocaleString(), color: 'text-orange-400', bg: 'bg-orange-500/10 border border-orange-500/20' },
    { icon: TrendingUp, label: 'Avg. Value Claimed', value: totalClaims > 0 ? formatValue(Math.round(totalClaims * 2400)) : '$0', color: 'text-rose-400', bg: 'bg-rose-500/10 border border-rose-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
          <p className="mt-1 text-sm text-gray-400">Monitor platform activity and manage content</p>
        </div>
        <Link href="/admin/perks/new">
          <Button className="h-9 gap-2 bg-white text-black hover:bg-gray-100">
            <Gift className="w-4 h-4" />
            Add perk
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent Claims
            </h2>
            <Link href="/admin/analytics" className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentClaims.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No claims yet</div>
          ) : (
            <div className="divide-y divide-gray-900/80">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{claim.perks?.tool_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-400">
                      {formatValue(claim.perks?.value_amount ?? 0)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(claim.claimed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { href: '/admin/perks/new', label: 'Add new perk', desc: 'Create and publish a new perk', icon: Gift },
              { href: '/admin/perks', label: 'Manage perks', desc: 'Edit, feature, or disable perks', icon: Gift },
              { href: '/admin/users', label: 'View users', desc: 'Browse user accounts and activity', icon: Users },
              { href: '/admin/analytics', label: 'Analytics', desc: 'Review platform performance metrics', icon: Activity },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                  <action.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-600 transition-colors group-hover:text-cyan-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
