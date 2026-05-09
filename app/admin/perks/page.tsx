import { createClient } from '@/lib/supabase/server';
import { AdminPerksClient } from '@/components/admin/AdminPerksClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Perks — Admin',
};

export default async function AdminPerksPage() {
  const supabase = createClient();
  const { data: perks } = await supabase
    .from('perks')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  return <AdminPerksClient perks={perks ?? []} />;
}
