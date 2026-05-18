import type { Metadata } from 'next';
import { getAuthenticatedProfile, getPublishedDeals, getSiteSettings, getUserDealClaims } from '@/lib/site-data';
import { DealsExplorer } from '@/components/founderstack/DealsExplorer';
import { DealLogo } from '@/components/founderstack/DealLogo';
import { hasPaidAccess, isAdminRole } from '@/lib/founderstack';
import { absoluteUrl, TARGET_KEYWORDS } from '@/lib/seo';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Startup Deals Directory',
  description: 'Browse startup perks, founder deals, software discounts, cloud credits, AI tool offers, and SaaS discounts for startups.',
  keywords: TARGET_KEYWORDS,
  alternates: { canonical: '/deals' },
  openGraph: {
    title: 'Startup Deals Directory | FounderStackHub',
    description: 'Browse startup perks, founder deals, software discounts, cloud credits, AI tool offers, and SaaS discounts for startups.',
    url: absoluteUrl('/deals'),
    type: 'website',
  },
};

export default async function DealsPage() {
  const [{ session, profile }, deals, settings] = await Promise.all([
    getAuthenticatedProfile(),
    getPublishedDeals(),
    getSiteSettings(),
  ]);

  const claims = session ? await getUserDealClaims(session.user.id) : [];
  const claimedIds = claims.map((claim) => claim.deal_id);

  return (
    <main className="relative overflow-hidden bg-[#07111f] px-4 pb-16 pt-24 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Startup deals and founder perks directory',
            description: metadata.description,
            url: absoluteUrl('/deals'),
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: deals.slice(0, 50).map((deal, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: absoluteUrl(`/deal/${deal.slug}`),
                name: deal.name,
              })),
            },
          }),
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 12%, rgba(56,189,248,0.22), transparent 28%), radial-gradient(circle at 85% 22%, rgba(99,102,241,0.18), transparent 28%), radial-gradient(circle at 50% 100%, rgba(249,115,22,0.12), transparent 44%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 78%)',
        }}
      />

      <section className="relative mx-auto max-w-7xl">
        <div className="rounded-[20px] border border-white/10 bg-black/35 p-6 backdrop-blur-xl sm:rounded-[32px] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">Live directory</p>
              <h1 className="mt-4 text-5xl leading-none sm:text-6xl">
                Startup Perks and Founder Deals
                <br />
                In Your Stack, Right Now.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                Browse AI-curated startup software discounts, cloud credits, SaaS offers, AI tool deals, and founder-only partner perks with live search, category filters, and claim-ready cards.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-300">{deals.length} published deals</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-300">{Array.from(new Set(deals.map((deal) => deal.category))).length} categories</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-slate-300">
                  {isAdminRole(profile?.role)
                    ? 'Admin signed in'
                    : hasPaidAccess(profile)
                      ? 'Paid member access'
                      : session
                        ? 'Signed in · upgrade to unlock'
                        : 'Public browsing'}
                </span>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">Logo strip</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {deals.slice(0, 12).map((deal) => (
                  <span
                    key={deal.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs uppercase tracking-[0.14em] text-gray-200"
                  >
                    <DealLogo
                      deal={deal}
                      className="h-6 w-6 rounded-full border border-white/10 bg-white"
                      textClassName="text-[10px] tracking-[0.12em] text-[#111111]"
                    />
                    {deal.short_name || deal.name}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-300">{settings.footer_text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-10 max-w-7xl">
        <DealsExplorer
          deals={deals}
          initiallyAuthed={!!session}
          claimedDealIds={claimedIds}
        />
      </section>
    </main>
  );
}
