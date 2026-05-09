'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Shield, LogOut, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface SettingsClientProps {
  profile: Profile | null;
  userEmail: string;
}

export function SettingsClient({ profile, userEmail }: SettingsClientProps) {
  const router = useRouter();
  const [username, setUsername] = useState(profile?.username ?? '');
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const response = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Failed to save profile');
    } else {
      toast.success('Profile updated!');
      router.refresh();
    }

    setSaving(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setChangingPw(true);

    const response = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error || 'Unable to update password.');
    } else {
      toast.success('Password updated successfully!');
      setNewPassword('');
    }
    setChangingPw(false);
  }

  async function handleSignOut() {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account preferences</p>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-white">
          <User className="w-4 h-4 text-cyan-300" />
          Profile
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
              {(username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">{username || 'Unnamed founder'}</p>
            <p className="text-sm text-gray-400">{userEmail}</p>
            <Badge variant="secondary" className="mt-1 capitalize">{profile?.role}</Badge>
          </div>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Display name</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="h-10 max-w-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={userEmail} disabled className="h-10 max-w-xs border-gray-800 bg-white/[0.03] text-gray-500" />
            <p className="text-xs text-gray-500">Email cannot be changed here</p>
          </div>
          <Button type="submit" disabled={saving} className="h-9 bg-white text-black hover:bg-gray-100">
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-white">
          <Lock className="w-4 h-4 text-cyan-300" />
          Change Password
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="h-10 max-w-xs"
            />
          </div>
          <Button type="submit" disabled={changingPw} variant="outline" className="h-9 border-gray-700 bg-black text-white hover:bg-white/5">
            {changingPw ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="mb-2 flex items-center gap-2 font-bold text-white">
          <Shield className="w-4 h-4 text-gray-400" />
          Account
        </h2>
        <p className="mb-2 text-sm text-gray-400">
          Membership: <span className="font-semibold capitalize text-gray-200">{profile?.role} plan</span>
        </p>
        <Link href="/dashboard/billing" className="mb-5 inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200">
          <CreditCard className="w-3.5 h-3.5" />
          Manage billing
        </Link>
        <div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="h-9 gap-2 border-red-900/60 bg-black text-red-300 hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
