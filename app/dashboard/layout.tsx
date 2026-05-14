import Link from 'next/link';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Bookmark, CreditCard, Inbox, Layers3, LayoutDashboard, Mail, PlusSquare, Rocket, Settings, UserCircle2, Users } from 'lucide-react';
import { OnboardingWrapper } from '@/components/dashboard/OnboardingWrapper';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile, getPartnerSubmissions } from '@/lib/site-data';

const accountNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle2 },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
];

const adminNavItems = [
  { href: '/dashboard/deals', label: 'Deals', icon: Layers3 },
  { href: '/dashboard/members', label: 'Members', icon: Users },
  { href: '/dashboard/outreach', label: 'Outreach', icon: Mail },
  { href: '/dashboard/launch-readiness', label: 'Launch Readiness', icon: Rocket },
  { href: '/dashboard/new-deals', label: 'New Deals', icon: PlusSquare },
  { href: '/dashboard/settings', label: 'Site Settings', icon: Settings },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { session, profile } = await getAuthenticatedProfile();

  if (!session) redirect('/sign-in?redirectTo=/dashboard');
  const isAdmin = isAdminRole(profile?.role);

  const submissions = isAdmin ? await getPartnerSubmissions() : [];

  return (
    <main className="min-h-screen bg-black px-4 pb-16 pt-24 text-white sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[24px] border border-gray-800 bg-black p-4">
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Account</p>
            <nav className="mt-4 space-y-2">
              {accountNavItems.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl border border-gray-900 px-4 py-3 text-sm text-gray-300 hover:border-gray-700 hover:text-white">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {isAdmin && (
            <>
              <div className="rounded-[24px] border border-gray-800 bg-black p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Admin CMS</p>
                <nav className="mt-4 space-y-2">
                  {adminNavItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl border border-gray-900 px-4 py-3 text-sm text-gray-300 hover:border-gray-700 hover:text-white">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="rounded-[24px] border border-gray-800 bg-black p-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Inbox className="h-4 w-4" />
                  Partner submissions
                </div>
                <p className="mt-3 text-3xl text-white">{submissions.length}</p>
                <p className="mt-2 text-sm text-gray-500">Inbound partner leads waiting in the database.</p>
              </div>
            </>
          )}
        </aside>

        <div>
          {!profile?.onboarding_completed && session.user.id ? (
            <OnboardingWrapper userId={session.user.id} referralCode={profile?.referral_code || 'FOUNDERSTACK'}>{children}</OnboardingWrapper>
          ) : (
            children
          )}
        </div>
      </div>
    </main>
  );
}
