import { notFound, redirect } from 'next/navigation';
import { AdminDealForm } from '@/components/founderstack/AdminDealForm';
import { isAdminRole } from '@/lib/founderstack';
import { getAdminDealById, getAuthenticatedProfile } from '@/lib/site-data';

export const dynamic = 'force-dynamic';

export default async function EditDealPage({ params }: { params: { id: string } }) {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect(`/sign-in?redirectTo=/dashboard/deals/${params.id}`);
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const deal = await getAdminDealById(params.id);
  if (!deal) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Edit deal</p>
        <h1 className="mt-3 text-4xl text-white">{deal.name}</h1>
      </div>
      <AdminDealForm deal={deal} />
    </div>
  );
}
