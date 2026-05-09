import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { ReferralsClient } from '@/components/dashboard/ReferralsClient';
import { getAuthenticatedProfile } from '@/lib/site-data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Referrals — FounderStackHub',
};

export default async function ReferralsPage() {
  const { session } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/referrals');
  const supabase = createAdminClient();

  const [{ data: profile }, { data: referrals }] = await Promise.all([
    supabase.from('profiles').select('referral_code').eq('id', session.user.id).maybeSingle(),
    supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', session.user.id)
      .order('created_at', { ascending: false }),
  ]);

  return (
    <ReferralsClient
      referralCode={profile?.referral_code ?? ''}
      referrals={referrals ?? []}
    />
  );
}
