import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AUTH_COOKIE_NAME, decodeSession } from '@/lib/auth-session';
import { hasPaidAccess } from '@/lib/founderstack';

function isMissingDealClaimsTable(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.deal_claims'")
  );
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(AUTH_COOKIE_NAME.length + 1);
  const session = decodeSession(token);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { dealId } = await request.json();
  if (!dealId) {
    return NextResponse.json({ error: 'Missing dealId' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!hasPaidAccess(profile)) {
    return NextResponse.json({ error: 'A paid membership is required to unlock premium deals.' }, { status: 403 });
  }

  const { error } = await supabase.from('deal_claims').insert({
    user_id: session.user.id,
    deal_id: dealId,
  });

  if (isMissingDealClaimsTable(error)) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: 'deal_claims table is not available yet',
    });
  }

  if (error && !error.message.toLowerCase().includes('duplicate')) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
