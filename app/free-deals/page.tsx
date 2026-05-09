import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { FreeDealsLanding } from '@/components/giveaway/FreeDealsLanding';
import { FREE_DEALS_VERIFIED_COOKIE, readVerifiedFreeDealsToken } from '@/lib/free-deals';
import { getFreeDeals } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Free Startup Deals | FounderStackHub',
  description: 'Unlock a curated set of free startup deals and credits after quick email verification.',
};

export default async function FreeDealsPage() {
  const verifiedLead = readVerifiedFreeDealsToken(cookies().get(FREE_DEALS_VERIFIED_COOKIE)?.value);
  const deals = await getFreeDeals();

  return <FreeDealsLanding deals={deals} verifiedEmail={verifiedLead?.email ?? null} />;
}
