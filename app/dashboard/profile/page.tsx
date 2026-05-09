import { redirect } from 'next/navigation';
import { SettingsClient } from '@/components/dashboard/SettingsClient';
import { getAuthenticatedProfile } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardProfilePage() {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard/profile');

  return <SettingsClient profile={profile} userEmail={session.user.email ?? ''} />;
}
