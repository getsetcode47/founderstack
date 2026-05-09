import { notFound, redirect } from 'next/navigation';
import { CustomAdminDealForm } from '@/components/founderstack/CustomAdminDealForm';
import { isAdminRole } from '@/lib/founderstack';
import { getAdminDealById, getAuthenticatedProfile } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function DashboardCustomEditDealPage({ params }: { params: { id: string } }) {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect(`/sign-in?redirectTo=/dashboard/new-deals/${params.id}`);
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const deal = await getAdminDealById(params.id);
  if (!deal) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">New Deals</p>
        <h1 className="mt-3 text-4xl text-white">Edit {deal.name}</h1>
      </div>
      <CustomAdminDealForm deal={deal} />
    </div>
  );
}
