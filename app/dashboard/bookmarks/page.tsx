import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { BookmarksClient } from '@/components/dashboard/BookmarksClient';
import { getAuthenticatedProfile } from '@/lib/site-data';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookmarks — FounderStackHub',
};

export default async function BookmarksPage() {
  const { session } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/bookmarks');
  const supabase = createAdminClient();

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*, perks(*, categories(*))')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return <BookmarksClient bookmarks={bookmarks ?? []} />;
}
