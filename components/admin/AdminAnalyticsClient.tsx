'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatValue } from '@/components/perks/PerkCard';
import { ChartBar as BarChart3, ChartPie as PieIcon, TrendingUp } from 'lucide-react';

interface AdminAnalyticsClientProps {
  topPerks: { tool_name: string; claim_count: number; value_amount: number }[];
  categoryData: { name: string; count: number }[];
  recentClaims: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AdminAnalyticsClient({ topPerks, categoryData, recentClaims }: AdminAnalyticsClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-gray-400">Platform performance and engagement metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5">
          <h2 className="mb-5 flex items-center gap-2 font-bold text-white">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Top perks by claims
          </h2>
          {topPerks.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topPerks.slice(0, 8)} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                <YAxis type="category" dataKey="tool_name" width={80} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} tickLine={{ stroke: '#374151' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #374151', backgroundColor: '#020617', color: '#fff' }}
                  formatter={(val: number) => [val, 'Claims']}
                />
                <Bar dataKey="claim_count" fill="#22d3ee" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-white/[0.03] p-5">
          <h2 className="mb-5 flex items-center gap-2 font-bold text-white">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            Perks by category
          </h2>
          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #374151', backgroundColor: '#020617', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03]">
        <div className="border-b border-gray-800 px-5 py-4">
          <h2 className="flex items-center gap-2 font-bold text-white">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Top perks by value impact
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/[0.02]">
                <th className="px-5 py-3 text-left font-medium text-gray-400">Tool</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Claims</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Unit value</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Total impact</th>
              </tr>
            </thead>
            <tbody>
              {topPerks.map((perk) => (
                <tr key={perk.tool_name} className="border-b border-gray-900/80 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-white">{perk.tool_name}</td>
                  <td className="px-5 py-3.5 text-gray-400">{perk.claim_count}</td>
                  <td className="px-5 py-3.5 text-gray-400">{formatValue(perk.value_amount)}</td>
                  <td className="px-5 py-3.5 font-semibold text-emerald-400">
                    {formatValue(perk.claim_count * perk.value_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topPerks.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">No claims yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
