import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeSession } from '@/lib/auth-session';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';
import { getStripeConfigError, getStripePriceId, isStripeCheckoutConfigured } from '@/lib/stripe-config';
import { getRequestOrigin } from '@/lib/security/request';
import { applyRateLimit } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';

type Plan = 'monthly' | 'annual' | 'lifetime';

function getSessionFromCookieHeader(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(AUTH_COOKIE_NAME.length + 1);

  return decodeSession(token);
}

export async function POST(req: Request) {
  try {
    const session = getSessionFromCookieHeader(req);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const requestLimit = applyRateLimit(`stripe:checkout:user:${session.user.id}`, { windowMs: 60 * 1000, max: 10 });

    if (!requestLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(requestLimit.retryAfterSeconds) } }
      );
    }

    let plan: Plan = 'monthly';
    try {
      const body = await req.json();
      if (body?.plan === 'lifetime' || body?.plan === 'monthly' || body?.plan === 'annual') {
        plan = body.plan;
      }
    } catch {
    }

    if (!isStripeCheckoutConfigured(plan)) {
      return NextResponse.json(
        { error: getStripeConfigError(plan) },
        { status: 503 }
      );
    }

    const stripe = getStripe();

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, username, lifetime_access')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profile?.lifetime_access) {
      return NextResponse.json({ error: 'You already have lifetime access.' }, { status: 400 });
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: profile?.username ?? undefined,
        metadata: { supabase_user_id: session.user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    const origin = getRequestOrigin(req);

    const priceId = getStripePriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { error: getStripeConfigError(plan) },
        { status: 503 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: plan === 'lifetime' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard/billing?success=true&plan=${plan}`,
      cancel_url: `${origin}/#pricing?canceled=true`,
      metadata: { supabase_user_id: session.user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Checkout failed' },
      { status: 500 }
    );
  }
}
