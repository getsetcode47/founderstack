import { NextResponse } from 'next/server';
import { generateBlogPost, pickNextBlogTopic } from '@/lib/blog-autopilot';
import { decodeSession } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { getAllBlogPostsForAutomation, getPublishedDeals } from '@/lib/site-data';
import { createAdminClient, isAdminClientConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

function readSessionCookie(request: Request) {
  return request.headers.get('cookie')?.match(/(?:^|;\s*)fsh_session=([^;]+)/)?.[1];
}

async function isAuthorized(request: Request) {
  const cronSecret = process.env.BLOG_AUTOPILOT_SECRET || process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const session = decodeSession(readSessionCookie(request));
  if (!session?.user?.id) return false;

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
  return isAdminRole(profile?.role);
}

function withUniqueSlug(baseSlug: string, existingSlugs: Set<string>) {
  if (!existingSlugs.has(baseSlug)) return baseSlug;

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const stamped = `${baseSlug}-${stamp}`;
  if (!existingSlugs.has(stamped)) return stamped;

  return `${stamped}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    if (!isAdminClientConfigured()) {
      return NextResponse.json({ error: 'Supabase admin client is not configured.' }, { status: 503 });
    }

    const payload = await request.json().catch(() => ({}));
    const publish = payload.publish !== false;
    const requestedKeyword = typeof payload.keyword === 'string' ? payload.keyword.trim() : '';
    const posts = await getAllBlogPostsForAutomation();
    const deals = await getPublishedDeals();
    const existingSlugs = new Set(posts.map((post) => post.slug));
    const topic = requestedKeyword
      ? {
          keyword: requestedKeyword,
          cluster: payload.cluster || 'startup perks',
          intent: payload.intent || `Readers want a practical guide for ${requestedKeyword}.`,
          title: payload.title || `${requestedKeyword}: A Practical Founder Guide`,
        }
      : pickNextBlogTopic(posts, deals);

    const generated = await generateBlogPost(topic, deals);
    const slug = withUniqueSlug(generated.slug, existingSlugs);
    const now = new Date().toISOString();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...generated,
        slug,
        status: publish ? 'published' : 'draft',
        published_at: publish ? now : null,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      published: publish,
      slug,
      url: `/blog/${slug}`,
      post: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to run blog autopilot.' }, { status: 500 });
  }
}
