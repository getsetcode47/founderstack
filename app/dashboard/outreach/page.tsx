import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { getOutreachAudienceSummary, getRecentOutreachCampaigns } from '@/lib/admin-outreach';
import { AdminOutreachClient } from '@/components/dashboard/AdminOutreachClient';

export const metadata: Metadata = {
  title: 'Outreach — FounderStackHub',
};

export const dynamic = 'force-dynamic';

export default async function OutreachPage() {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard/outreach');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const [summary, campaigns] = await Promise.all([
    getOutreachAudienceSummary(),
    getRecentOutreachCampaigns(),
  ]);

  return <AdminOutreachClient summary={summary} campaigns={campaigns} />;
}
