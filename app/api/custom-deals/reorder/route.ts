import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { createAdminClient } from '@/lib/supabase/admin';

function isMissingDealsTable(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.deals'")
  );
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { targetId, targetSortOrder, swapId, swapSortOrder } = await request.json();
    const supabase = createAdminClient();

    const [first, second] = await Promise.all([
      supabase.from('deals').update({ sort_order: swapSortOrder }).eq('id', targetId),
      supabase.from('deals').update({ sort_order: targetSortOrder }).eq('id', swapId),
    ]);

    if (first.error || second.error) {
      if (isMissingDealsTable(first.error) || isMissingDealsTable(second.error)) {
        return NextResponse.json(
          {
            error:
              'The deals table is not available in Supabase yet. Apply the latest migration before reordering deals.',
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: first.error?.message || second.error?.message || 'Unable to reorder deals.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to reorder deals.' }, { status: 500 });
  }
}
