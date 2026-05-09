'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users } from 'lucide-react';
import type { Profile } from '@/types';

interface AdminUsersClientProps {
  profiles: Profile[];
}

const roleBadgeColors: Record<string, string> = {
  admin: 'border border-rose-500/20 bg-rose-500/10 text-rose-300',
  premium: 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
  free: 'border border-gray-700 bg-white/[0.03] text-gray-300',
};

export function AdminUsersClient({ profiles }: AdminUsersClientProps) {
  const [search, setSearch] = useState('');

  const filtered = profiles.filter((p) =>
    (p.username ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.referral_code ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-gray-400">{profiles.length} registered accounts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or referral code..."
          className="h-10 border-gray-800 bg-white/[0.03] pl-10 text-white placeholder:text-gray-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-white/[0.02]">
                <th className="px-5 py-3 text-left font-medium text-gray-400">User</th>
                <th className="hidden px-5 py-3 text-left font-medium text-gray-400 sm:table-cell">Role</th>
                <th className="hidden px-5 py-3 text-left font-medium text-gray-400 md:table-cell">Referral code</th>
                <th className="hidden px-5 py-3 text-left font-medium text-gray-400 lg:table-cell">Joined</th>
                <th className="px-5 py-3 text-left font-medium text-gray-400">Onboarded</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => (
                <tr key={profile.id} className="border-b border-gray-900/80 transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500">
                        <span className="text-white text-xs font-bold">
                          {(profile.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{profile.username ?? 'Unnamed'}</p>
                        <p className="font-mono text-xs text-gray-500">{profile.id.slice(0, 12)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${roleBadgeColors[profile.role] || roleBadgeColors.free}`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="font-mono text-xs text-gray-400">{profile.referral_code ?? '—'}</span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-gray-400 lg:table-cell">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`w-2 h-2 rounded-full inline-block ${profile.onboarding_completed ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
