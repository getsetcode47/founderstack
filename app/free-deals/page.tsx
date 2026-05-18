import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { FreeDealsLanding } from '@/components/giveaway/FreeDealsLanding';
import { FREE_DEALS_VERIFIED_COOKIE, readVerifiedFreeDealsToken } from '@/lib/free-deals';
import { getFreeDeals } from '@/lib/site-data';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Free Startup Deals and Software Credits',
  description: 'Get free startup deals, software credits, SaaS discounts, and founder perks curated by FounderStackHub.',
  alternates: { canonical: '/free-deals' },
  openGraph: {
    title: 'Free Startup Deals and Software Credits | FounderStackHub',
    description: 'Get free startup deals, software credits, SaaS discounts, and founder perks curated by FounderStackHub.',
    url: absoluteUrl('/free-deals'),
    type: 'website',
  },
};

export default async function FreeDealsPage() {
  const verifiedLead = readVerifiedFreeDealsToken(cookies().get(FREE_DEALS_VERIFIED_COOKIE)?.value);
  const deals = await getFreeDeals();

  return <FreeDealsLanding deals={deals} verifiedEmail={verifiedLead?.email ?? null} />;
}
