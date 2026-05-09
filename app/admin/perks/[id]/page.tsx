import { createClient } from '@/lib/supabase/server';
import { PerkForm } from '@/components/admin/PerkForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Perk — Admin',
};

export default async function EditPerkPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: perk }, { data: categories }] = await Promise.all([
    supabase.from('perks').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('categories').select('*').order('name'),
  ]);
  if (!perk) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Edit Perk</h1>
      <PerkForm categories={categories ?? []} perk={perk} />
    </div>
  );
}
