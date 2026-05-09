import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { AdminMembersClient } from '@/components/dashboard/AdminMembersClient';
import type { DealClaim, Profile } from '@/types';

export const metadata: Metadata = {
  title: 'Members — FounderStackHub',
};

export const dynamic = 'force-dynamic';

type MemberClaimRow = Pick<DealClaim, 'id' | 'user_id' | 'created_at'> & {
  deals?: {
    name: string;
    deal_headline: string;
  } | null;
};

function isMissingDealClaimsTable(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.deal_claims'")
  );
}

export default async function MembersPage() {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard/members');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const supabase = createAdminClient();

  const [{ data: profiles, error: profilesError }, { data: claims, error: claimsError }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, username, avatar_url, role, referral_code, onboarding_completed, interests, created_at, stripe_customer_id, stripe_subscription_id, subscription_status, subscription_period_end, lifetime_access, plan_type')
      .order('created_at', { ascending: false }),
    supabase
      .from('deal_claims')
      .select('id, user_id, created_at, deals(name, deal_headline)')
      .order('created_at', { ascending: false }),
  ]);

  if (profilesError) {
    throw new Error(profilesError.message || 'Failed to load member profiles.');
  }

  if (claimsError && !isMissingDealClaimsTable(claimsError)) {
    throw new Error(claimsError.message || 'Failed to load deal claims.');
  }

  const normalizedClaims: MemberClaimRow[] = (((claimsError ? [] : claims) ?? []) as Array<{
    id: string;
    user_id: string;
    created_at: string;
    deals?: { name: string; deal_headline: string }[] | { name: string; deal_headline: string } | null;
  }>).map((claim) => ({
    id: claim.id,
    user_id: claim.user_id,
    created_at: claim.created_at,
    deals: Array.isArray(claim.deals) ? claim.deals[0] ?? null : claim.deals ?? null,
  }));

  return (
    <AdminMembersClient
      profiles={(profiles ?? []) as Profile[]}
      claims={normalizedClaims}
    />
  );
}
