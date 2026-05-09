import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { BillingClient } from '@/components/dashboard/BillingClient';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { getStripeConfigError, isStripeCheckoutConfigured } from '@/lib/stripe-config';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Billing — FounderStackHub',
};

interface PageProps {
  searchParams: { success?: string; canceled?: string };
}

export default async function BillingPage({ searchParams }: PageProps) {
  const { session } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/billing');
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  const stripeReady = isStripeCheckoutConfigured();
  const stripeMessage = stripeReady ? null : getStripeConfigError();

  return (
    <BillingClient
      profile={profile}
      successParam={searchParams.success === 'true'}
      canceledParam={searchParams.canceled === 'true'}
      stripeReady={stripeReady}
      stripeMessage={stripeMessage}
    />
  );
}
