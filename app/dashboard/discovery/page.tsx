import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { getDiscoveryCandidates, getDiscoveryOverview, getDiscoveryRuns, getDiscoverySources } from '@/lib/deal-discovery';
import { AdminDiscoveryClient } from '@/components/dashboard/AdminDiscoveryClient';

export const metadata: Metadata = {
  title: 'Discovery — FounderStackHub',
};

export const dynamic = 'force-dynamic';

export default async function DiscoveryPage() {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard/discovery');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const [overview, sources, runs, candidates] = await Promise.all([
    getDiscoveryOverview(),
    getDiscoverySources(),
    getDiscoveryRuns(),
    getDiscoveryCandidates(),
  ]);

  return (
    <AdminDiscoveryClient
      overview={overview}
      sources={sources}
      runs={runs}
      candidates={candidates}
    />
  );
}
