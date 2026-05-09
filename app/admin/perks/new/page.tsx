import { createClient } from '@/lib/supabase/server';
import { PerkForm } from '@/components/admin/PerkForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Perk — Admin',
};

export default async function NewPerkPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Add New Perk</h1>
      <PerkForm categories={categories ?? []} />
    </div>
  );
}
