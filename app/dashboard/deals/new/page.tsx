import { redirect } from 'next/navigation';
import { AdminDealForm } from '@/components/founderstack/AdminDealForm';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';

export default async function NewDealPage() {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/deals/new');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">New deal</p>
        <h1 className="mt-3 text-4xl text-white">Create a founder deal</h1>
      </div>
      <AdminDealForm />
    </div>
  );
}
