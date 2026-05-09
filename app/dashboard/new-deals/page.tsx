import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CustomAdminDealForm } from '@/components/founderstack/CustomAdminDealForm';
import { ExistingDealsEditorClient } from '@/components/founderstack/ExistingDealsEditorClient';
import { isAdminRole } from '@/lib/founderstack';
import { getAdminDeals, getAuthenticatedProfile } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardNewDealsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/new-deals');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const deals = await getAdminDeals();
  const initialQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gray-800 bg-black p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">New Deals</p>
            <h1 className="mt-3 text-4xl text-white">Custom deals workspace</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
              Add new founder offers with their description, redeem link, claim behavior, and preview card styling. This is separate from the existing deals CMS, and the form is available right here.
            </p>
          </div>
          <Link href="/dashboard/deals" className="inline-flex h-11 items-center justify-center rounded-md border border-gray-700 px-5 text-sm font-medium text-white transition hover:border-gray-500">
            Open existing CMS
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Create</p>
          <h2 className="mt-3 text-3xl text-white">Add a custom deal</h2>
        </div>
        <CustomAdminDealForm />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Existing Deals</p>
          <h2 className="mt-3 text-3xl text-white">Edit current offers and links</h2>
        </div>
        <ExistingDealsEditorClient deals={deals} initialQuery={initialQuery} />
      </div>
    </div>
  );
}
