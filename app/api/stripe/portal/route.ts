import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, decodeSession } from '@/lib/auth-session';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe';
import { getStripeConfigError, isStripeSecretConfigured } from '@/lib/stripe-config';
import { getRequestOrigin } from '@/lib/security/request';

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
  if (!isStripeSecretConfigured()) {
    return NextResponse.json({ error: getStripeConfigError() }, { status: 503 });
  }

  const stripe = getStripe();
  const session = getSessionFromCookieHeader(req);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
  }

  const origin = getRequestOrigin(req);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
