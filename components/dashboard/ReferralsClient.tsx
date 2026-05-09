'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCheck, Users, Gift, Link as LinkIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Referral } from '@/types';

interface ReferralsClientProps {
  referralCode: string;
  referrals: Referral[];
}

export function ReferralsClient({ referralCode, referrals }: ReferralsClientProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/sign-in?mode=signup&ref=${referralCode}`
    : `https://founderstackhub.com/sign-in?mode=signup&ref=${referralCode}`;

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  function copyLink() {
    navigator.clipboard.writeText(referralUrl);
    toast.success('Referral link copied!');
  }

  const completed = referrals.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-white">Referral Program</h1>
        <p className="text-sm text-gray-400">
          Invite fellow founders and both of you unlock exclusive bonus perks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Share2, label: 'Total invites', value: referrals.length.toString(), color: 'text-cyan-200', bg: 'bg-cyan-400/10 border border-cyan-400/20' },
          { icon: CheckCheck, label: 'Completed', value: completed.toString(), color: 'text-emerald-300', bg: 'bg-emerald-400/10 border border-emerald-400/20' },
          { icon: Gift, label: 'Pending', value: (referrals.length - completed).toString(), color: 'text-orange-300', bg: 'bg-orange-400/10 border border-orange-400/20' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-gray-800 bg-black p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="mt-0.5 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
          <LinkIcon className="w-4 h-4 text-cyan-300" />
          Your referral details
        </h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-400">Referral code</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-gray-800 bg-white/[0.03] px-4 py-2.5 font-mono font-bold tracking-widest text-white">
                {referralCode || 'Loading...'}
              </div>
              <Button onClick={copyCode} variant="outline" size="sm" className="h-10 gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-400">Referral link</p>
            <div className="flex items-center gap-2">
              <Input
                value={referralUrl}
                readOnly
                className="h-10 flex-1 border-gray-800 bg-white/[0.03] text-sm text-gray-300"
              />
              <Button onClick={copyLink} variant="outline" size="sm" className="h-10 gap-2 border-gray-700 bg-black text-white hover:bg-white/5">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-gray-800 bg-black">
        <div className="border-b border-gray-800 px-5 py-4">
          <h2 className="flex items-center gap-2 font-bold text-white">
            <Users className="w-4 h-4 text-cyan-300" />
            Referred founders
          </h2>
        </div>
        {referrals.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <p className="mb-1 font-medium text-white">No referrals yet</p>
            <p className="text-sm text-gray-500">Share your code to start earning rewards</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Code used</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} className="border-b border-gray-900/80">
                    <td className="px-5 py-3.5 font-mono text-gray-300">{ref.referral_code}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        ref.status === 'completed'
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-orange-400/10 text-orange-300'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
