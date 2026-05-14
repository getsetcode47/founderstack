import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decodeSession } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { buildDealPayloadFromCandidate } from '@/lib/deal-discovery';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = decodeSession(request.headers.get('cookie')?.match(/(?:^|;\s*)fsh_session=([^;]+)/)?.[1]);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
    if (!isAdminRole(profile?.role)) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { data: candidate, error } = await supabase
      .from('deal_discovery_candidates')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !candidate) {
      return NextResponse.json({ error: error?.message || 'Candidate not found.' }, { status: 404 });
    }

    const dealPayload = buildDealPayloadFromCandidate(candidate);
    const { error: dealError } = await supabase
      .from('deals')
      .upsert(dealPayload, { onConflict: 'slug' });

    if (dealError) {
      return NextResponse.json({ error: dealError.message || 'Unable to publish candidate.' }, { status: 400 });
    }

    await supabase
      .from('deal_discovery_candidates')
      .update({ status: 'approved' })
      .eq('id', params.id);

    return NextResponse.json({ ok: true, slug: dealPayload.slug });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to approve candidate.' }, { status: 500 });
  }
}
