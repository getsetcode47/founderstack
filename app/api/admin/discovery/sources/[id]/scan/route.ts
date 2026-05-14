import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { decodeSession } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';

function extractTitle(html: string) {
  return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim() || null;
}

function extractMetaDescription(html: string) {
  return (
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)?.[1]?.trim() ||
    null
  );
}

function toPlainText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateValue(text: string) {
  return text.match(/\$\s?\d[\d,]*(?:\.\d+)?/)?.[0] || null;
}

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

    const { data: source, error: sourceError } = await supabase
      .from('deal_discovery_sources')
      .select('*')
      .eq('id', params.id)
      .single();

    if (sourceError || !source) {
      return NextResponse.json({ error: sourceError?.message || 'Source not found.' }, { status: 404 });
    }

    const { data: run, error: runError } = await supabase
      .from('deal_discovery_runs')
      .insert({
        source_id: source.id,
        status: 'running',
      })
      .select('*')
      .single();

    if (runError || !run) {
      return NextResponse.json({ error: runError?.message || 'Unable to create scan run.' }, { status: 400 });
    }

    try {
      const response = await fetch(source.crawl_url, {
        headers: {
          'User-Agent': 'FounderStackHub Discovery Bot/1.0',
        },
        cache: 'no-store',
      });

      const html = await response.text();
      const title = extractTitle(html);
      const description = extractMetaDescription(html);
      const plainText = toPlainText(html).slice(0, 25000);
      const approxValue = estimateValue(`${title || ''} ${description || ''} ${plainText}`);
      const headline = description || title || `Candidate deal from ${source.name}`;

      await supabase.from('deal_discovery_snapshots').insert({
        run_id: run.id,
        source_id: source.id,
        url: source.crawl_url,
        page_title: title,
        raw_html: html.slice(0, 200000),
        raw_text: plainText,
      });

      const { data: candidate } = await supabase
        .from('deal_discovery_candidates')
        .insert({
          source_id: source.id,
          run_id: run.id,
          software_name: source.name,
          headline,
          approx_value: approxValue,
          conditions: plainText.slice(0, 1200),
          redeem_url: source.homepage_url,
          promo_code: null,
          category: 'AI Tools',
          status: 'pending',
          confidence: 0.45,
          source_url: source.crawl_url,
        })
        .select('*')
        .single();

      await supabase
        .from('deal_discovery_runs')
        .update({
          status: response.ok ? 'completed' : 'failed',
          http_status: response.status,
          discovered_count: candidate ? 1 : 0,
          error_message: response.ok ? null : `HTTP ${response.status}`,
          finished_at: new Date().toISOString(),
        })
        .eq('id', run.id);

      return NextResponse.json({ ok: true, runId: run.id });
    } catch (error: any) {
      await supabase
        .from('deal_discovery_runs')
        .update({
          status: 'failed',
          error_message: error?.message || 'Scan failed.',
          finished_at: new Date().toISOString(),
        })
        .eq('id', run.id);

      return NextResponse.json({ error: error?.message || 'Scan failed.' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to run scan.' }, { status: 500 });
  }
}
