import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { DealInfoCard } from '@/components/founderstack/DealInfoCard';
import { DealTradingCard } from '@/components/founderstack/DealTradingCard';
import { getDealDomain, hasPaidAccess } from '@/lib/founderstack';
import { stripFreeDealFlag } from '@/lib/free-deals';
import { getAuthenticatedProfile, getDealBySlug, getPublishedDeals, getUserDealClaims } from '@/lib/site-data';
import { absoluteUrl, truncateDescription } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const deal = await getDealBySlug(params.slug);
  if (!deal) {
    return { title: 'Deal not found | Founder Stack Hub' };
  }
  const description = truncateDescription(stripFreeDealFlag(deal.meta_description) ?? `${deal.name} startup deal: ${deal.description} ${deal.deal_headline}`);
  return {
    title: deal.meta_title ?? `${deal.name} Startup Deal`,
    description,
    alternates: { canonical: `/deal/${deal.slug}` },
    openGraph: {
      title: deal.meta_title ?? `${deal.name} Startup Deal | FounderStackHub`,
      description,
      url: absoluteUrl(`/deal/${deal.slug}`),
      type: 'article',
      images: deal.logo_image_url ? [{ url: deal.logo_image_url }] : undefined,
    },
  };
}

export default async function DealDetailPage({ params }: { params: { slug: string } }) {
  const deal = await getDealBySlug(params.slug);
  if (!deal) notFound();
  const officialUrl = `https://${getDealDomain({ name: deal.name, logo_image_url: deal.logo_image_url ?? null })}`;

  const [{ session, profile }, allDeals] = await Promise.all([
    getAuthenticatedProfile(),
    getPublishedDeals(),
  ]);

  const claims = session ? await getUserDealClaims(session.user.id) : [];
  const claimed = claims.some((claim) => claim.deal_id === deal.id);
  const relatedDeals = allDeals.filter((item) => item.id !== deal.id && item.category === deal.category).slice(0, 3);

  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Offer',
            name: `${deal.name} startup deal`,
            description: stripFreeDealFlag(deal.meta_description) ?? deal.description,
            category: deal.category,
            url: absoluteUrl(`/deal/${deal.slug}`),
            availability: deal.out_of_credits ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'FounderStackHub',
              url: absoluteUrl('/'),
            },
            itemOffered: {
              '@type': 'SoftwareApplication',
              name: deal.name,
              applicationCategory: deal.category,
            },
          }),
        }}
      />
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4">
            <DealTradingCard deal={deal} />
            <DealInfoCard deal={deal} initiallyAuthed={!!session} initiallyClaimed={claimed} />
          </div>

          <div className="rounded-[32px] border border-gray-800 bg-black p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">{deal.category}</p>
            <h1 className="mt-4 text-5xl">{deal.name}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-300">{deal.full_description}</p>
            {!hasPaidAccess(profile) && (
              <div className="mt-6 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">FounderStackHub access</p>
                <p className="mt-3 text-sm leading-7 text-gray-300">
                  Review the offer details below. Sign in or upgrade when you are ready to claim this startup perk and track it in your dashboard.
                </p>
                <Link
                  href={session ? '/dashboard/billing' : `/sign-in?mode=signup&redirectTo=${encodeURIComponent(`/deal/${deal.slug}`)}`}
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  Unlock this deal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <DetailCard title="Deal headline" body={deal.deal_headline} />
              <DetailCard title="Eligibility" body={deal.eligibility} />
              <DetailCard title="How to claim" body={deal.deal_details} />
            </div>

            {deal.discount_method === 'link' && deal.discount_url && hasPaidAccess(profile) && (
              <div className="mt-8 rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Redeem link</p>
                <p className="mt-3 text-sm leading-7 text-gray-300">
                  Open the official redemption page for this offer.
                </p>
                <Link
                  href={deal.discount_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  Open official redeem page
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}

            {(deal.discount_method === 'locked' || !hasPaidAccess(profile)) && (
              <div className="mt-8 rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Official link</p>
                <p className="mt-3 text-sm leading-7 text-gray-300">
                  This offer is gated inside Founder Stack Hub, but you can still visit the company&apos;s official startup page
                  or website to review the program and current eligibility details.
                </p>
                <Link
                  href={officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  Visit official site
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}

            <div className="mt-10">
              <Link href="/deals" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                Back to all deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedDeals.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Related deals</p>
              <h2 className="mt-3 text-3xl">More in {deal.category}</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedDeals.map((item) => (
              <div key={item.id} className="space-y-4">
                <DealTradingCard deal={item} />
                <DealInfoCard
                  deal={item}
                  initiallyAuthed={!!session}
                  initiallyClaimed={claims.some((claim) => claim.deal_id === item.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DetailCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-gray-500">{title}</p>
      <p className="mt-3 text-sm leading-7 text-gray-300">{body}</p>
    </div>
  );
}
