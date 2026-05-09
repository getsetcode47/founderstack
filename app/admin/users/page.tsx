import { createClient } from '@/lib/supabase/server';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users — Admin',
};

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminUsersClient profiles={profiles ?? []} />;
}
