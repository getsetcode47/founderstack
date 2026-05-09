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

function normalizeDealPayload(body: any) {
  return {
    name: String(body.name ?? '').trim(),
    slug: String(body.slug ?? '').trim(),
    short_name: body.short_name ? String(body.short_name).trim() : null,
    logo_type: body.logo_type === 'image' ? 'image' : 'initial',
    logo_image_url: body.logo_image_url ? String(body.logo_image_url).trim() : null,
    logo_text: body.logo_text ? String(body.logo_text).trim() : null,
    brand_color: String(body.brand_color ?? '#ffffff').trim(),
    description: String(body.description ?? '').trim(),
    full_description: String(body.full_description ?? '').trim(),
    category: String(body.category ?? '').trim(),
    deal_headline: String(body.deal_headline ?? '').trim(),
    deal_details: String(body.deal_details ?? '').trim(),
    eligibility: String(body.eligibility ?? '').trim(),
    discount_method: body.discount_method === 'code' || body.discount_method === 'locked' ? body.discount_method : 'link',
    discount_code: body.discount_method === 'code' && body.discount_code ? String(body.discount_code).trim() : null,
    discount_url: body.discount_url ? String(body.discount_url).trim() : null,
    out_of_credits: Boolean(body.out_of_credits),
    featured: Boolean(body.featured),
    published: Boolean(body.published),
    sort_order: Number(body.sort_order) || 100,
    meta_title: body.meta_title ? String(body.meta_title).trim() : null,
    meta_description: body.meta_description ? String(body.meta_description).trim() : null,
  };
}

function validateDealPayload(payload: ReturnType<typeof normalizeDealPayload>) {
  if (!payload.name || !payload.slug || !payload.description || !payload.full_description) {
    return 'Please complete the required deal details.';
  }
  if (!payload.category || !payload.deal_headline || !payload.deal_details || !payload.eligibility) {
    return 'Please complete the offer content fields.';
  }
  if (payload.discount_method === 'link' && !payload.discount_url) {
    return 'An external redeem link is required for link-based offers.';
  }
  if (payload.discount_method === 'code' && !payload.discount_code) {
    return 'A promo code is required for code-based offers.';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = normalizeDealPayload(body);
    const validationError = validateDealPayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('deals')
      .insert(payload)
      .select('*')
      .maybeSingle();

    if (error) {
      if (isMissingDealsTable(error)) {
        return NextResponse.json(
          {
            error:
              'The deals table is not available in Supabase yet. Apply the latest migration before creating custom deals.',
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deal: data });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to create deal.' }, { status: 500 });
  }
}
