import { createClient } from '@/lib/supabase/server';
import { AdminAnalyticsClient } from '@/components/admin/AdminAnalyticsClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics — Admin',
};

export default async function AdminAnalyticsPage() {
  const supabase = createClient();

  const [
    { data: topPerks },
    { data: categoryStats },
    { data: recentClaims },
  ] = await Promise.all([
    supabase
      .from('perks')
      .select('tool_name, claim_count, value_amount')
      .order('claim_count', { ascending: false })
      .limit(10),
    supabase
      .from('perks')
      .select('value_amount, categories(name)')
      .eq('is_active', true),
    supabase
      .from('perk_claims')
      .select('claimed_at, perks(value_amount)')
      .order('claimed_at', { ascending: false })
      .limit(30),
  ]);

  const categoryMap: Record<string, number> = {};
  (categoryStats ?? []).forEach((p: any) => {
    const name = p.categories?.name ?? 'Unknown';
    categoryMap[name] = (categoryMap[name] ?? 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

  return (
    <AdminAnalyticsClient
      topPerks={topPerks ?? []}
      categoryData={categoryData}
      recentClaims={recentClaims ?? []}
    />
  );
}
