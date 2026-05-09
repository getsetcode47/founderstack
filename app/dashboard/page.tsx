import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Bookmark, CreditCard, Gift, Layers3, Mail, PlusSquare, Rocket, Settings, UserCircle2, Users } from 'lucide-react';
import { isAdminRole } from '@/lib/founderstack';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAuthenticatedProfile, getAdminDeals, getPartnerSubmissions, getSiteSettings, getUserDealClaims } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard');

  const isAdmin = isAdminRole(profile?.role);

  if (isAdmin) {
    const adminClient = createAdminClient();
    const [deals, submissions, settings, profilesCountResponse, claimsCountResponse] = await Promise.all([
      getAdminDeals(),
      getPartnerSubmissions(),
      getSiteSettings(),
      adminClient.from('profiles').select('id', { count: 'exact', head: true }),
      adminClient.from('deal_claims').select('id', { count: 'exact', head: true }),
    ]);

    const featuredCount = deals.filter((deal) => deal.featured).length;
    const publishedCount = deals.filter((deal) => deal.published).length;
    const totalMembers = profilesCountResponse.count ?? 0;
    const totalClaims = claimsCountResponse.count ?? 0;

    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Admin overview</p>
          <h1 className="mt-4 text-4xl">Founder Stack Hub admin dashboard</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
            Manage the founder deals catalog, site settings, and inbound partner submissions from one production-ready CMS surface.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Published deals" value={String(publishedCount)} />
            <StatCard label="Featured deals" value={String(featuredCount)} />
            <StatCard label="Members" value={String(totalMembers)} />
            <StatCard label="Claims" value={String(totalClaims)} />
            <StatCard label="Partner submissions" value={String(submissions.length)} />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-[28px] border border-gray-800 bg-black p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Recent deals</p>
                <h2 className="mt-3 text-2xl">Latest catalog entries</h2>
              </div>
              <Link href="/dashboard/deals" className="text-sm text-gray-300 hover:text-white">
                Manage deals
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {deals.slice(0, 6).map((deal) => (
                <div key={deal.id} className="rounded-2xl border border-gray-900 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base text-white">{deal.name}</p>
                      <p className="mt-1 text-sm text-gray-500">{deal.category}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${deal.published ? 'bg-white text-black' : 'border border-gray-800 text-gray-400'}`}>
                      {deal.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-800 bg-black p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Global content</p>
            <h2 className="mt-3 text-2xl">{settings.hero_title}</h2>
            <p className="mt-4 text-sm leading-7 text-gray-400">{settings.hero_description}</p>
            <div className="mt-6 rounded-2xl border border-gray-900 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Primary CTA</p>
              <p className="mt-2 text-sm text-white">{settings.cta_primary_text}</p>
              <p className="text-sm text-gray-500">{settings.cta_primary_link}</p>
            </div>
            <Link href="/dashboard/settings" className="mt-6 inline-flex h-10 items-center rounded-md border border-gray-700 px-4 text-sm text-white hover:border-gray-500">
              Edit site settings
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <QuickLink
            href="/dashboard/members"
            icon={Users}
            title="Members analytics"
            description="Review plans, signup growth, claimed deals, and the most active members."
          />
          <QuickLink
            href="/dashboard/outreach"
            icon={Mail}
            title="Customer outreach"
            description="Email free-plan users and free-deals leads with upgrade campaigns through Resend."
          />
          <QuickLink
            href="/dashboard/launch-readiness"
            icon={Rocket}
            title="Launch readiness"
            description="Review monitoring, Stripe webhook health, outreach queue status, and final smoke-test links."
          />
          <QuickLink
            href="/dashboard/profile"
            icon={UserCircle2}
            title="Profile details"
            description="Open your account profile, update your display name, and manage password changes."
          />
          <QuickLink
            href="/dashboard/bookmarks"
            icon={Bookmark}
            title="Saved offers"
            description="Review bookmarked offers and keep track of the tools you want to revisit."
          />
          <QuickLink
            href="/dashboard/new-deals"
            icon={PlusSquare}
            title="Custom deals workspace"
            description="Create new offers, attach the right redemption links, and edit existing deal content."
          />
          <QuickLink
            href="/dashboard/settings"
            icon={Settings}
            title="Site settings"
            description="Update homepage copy, CTA text, and other global Founder Stack Hub content."
          />
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  const [claims, bookmarksResponse, referralsResponse] = await Promise.all([
    getUserDealClaims(session.user.id),
    supabase.from('bookmarks').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
    supabase.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_id', session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Account overview</p>
        <h1 className="mt-4 text-4xl">Welcome back, {profile?.username || 'Founder'}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
          Manage your profile, saved offers, subscription, and claimed founder deals from one place.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Claimed deals" value={String(claims.length)} />
          <StatCard label="Bookmarks" value={String(bookmarksResponse.count ?? 0)} />
          <StatCard label="Referrals" value={String(referralsResponse.count ?? 0)} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <QuickLink
          href="/dashboard/profile"
          icon={UserCircle2}
          title="Profile details"
          description="Update your display name, email-adjacent account details, password, and membership status."
        />
        <QuickLink
          href="/dashboard/billing"
          icon={CreditCard}
          title="Billing & subscription"
          description="Check your plan, manage billing, and keep your Founder Stack Hub membership active."
        />
        <QuickLink
          href="/dashboard/bookmarks"
          icon={Bookmark}
          title="Saved offers"
          description="Review the perks and tools you bookmarked while browsing the catalog."
        />
        <QuickLink
          href="/dashboard/referrals"
          icon={Gift}
          title="Referral activity"
          description="Track invites, see referral activity, and share your referral link with other founders."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className="mt-3 text-4xl text-white">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof UserCircle2;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="rounded-[28px] border border-gray-800 bg-black p-6 transition hover:border-gray-700">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-800 bg-white/[0.03]">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h2 className="mt-5 text-2xl text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-gray-400">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm text-gray-200">
        Open section
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
