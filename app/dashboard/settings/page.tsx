import { redirect } from 'next/navigation';
import { SiteSettingsForm } from '@/components/founderstack/SiteSettingsForm';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile, getSiteSettings } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardSettingsPage() {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/settings');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const settings = await getSiteSettings();
  return <SiteSettingsForm settings={settings} />;
}
