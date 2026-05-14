import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decodeSession } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';

export async function POST(request: Request) {
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

    const body = await request.json();
    const payload = {
      name: String(body?.name ?? '').trim(),
      source_type: String(body?.sourceType ?? 'startup_program').trim(),
      homepage_url: String(body?.homepageUrl ?? '').trim(),
      crawl_url: String(body?.crawlUrl ?? '').trim(),
      parser_hint: String(body?.parserHint ?? '').trim() || null,
      notes: String(body?.notes ?? '').trim() || null,
      active: body?.active !== false,
    };

    if (!payload.name || !payload.homepage_url || !payload.crawl_url) {
      return NextResponse.json({ error: 'Name, homepage URL, and crawl URL are required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('deal_discovery_sources')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Unable to create source.' }, { status: 400 });
    }

    return NextResponse.json({ source: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to create source.' }, { status: 500 });
  }
}
