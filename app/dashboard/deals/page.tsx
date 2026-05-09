import { redirect } from 'next/navigation';
import { AdminDealsClient } from '@/components/founderstack/AdminDealsClient';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { getAdminDeals } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardDealsPage() {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/deals');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const deals = await getAdminDeals();
  return <AdminDealsClient deals={deals} />;
}
