import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { CheckoutLauncher } from '@/components/billing/CheckoutLauncher';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout — FounderStackHub',
};

const VALID_PLANS = new Set(['monthly', 'annual', 'lifetime']);

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams.plan;
  if (!plan || !VALID_PLANS.has(plan)) {
    redirect('/dashboard/billing');
  }

  const { session } = await getAuthenticatedProfile();
  if (!session) {
    redirect(`/sign-in?mode=signup&redirectTo=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
  }

  return <CheckoutLauncher plan={plan as 'monthly' | 'annual' | 'lifetime'} />;
}
