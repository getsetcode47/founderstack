import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { isAdminRole } from '@/lib/founderstack';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { markStripeEventStatus, processStripeEvent, logStripeWebhookFailure } from '@/lib/stripe-webhooks';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase admin environment is not configured.');
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id || !isAdminRole(session.profile?.role)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  try {
    const body = await request.json();
    const stripeEventId = String(body.stripeEventId ?? '').trim();
    if (!stripeEventId) {
      return NextResponse.json(
        { error: 'stripeEventId is required.' },
        { status: 400, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: eventRow, error } = await supabase
      .from('subscription_events')
      .select('stripe_event_id, event_type, payload')
      .eq('stripe_event_id', stripeEventId)
      .maybeSingle();

    if (error || !eventRow) {
      return NextResponse.json(
        { error: error?.message || 'Stripe event not found.' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const stripe = getStripe();
    const event = eventRow.payload as Stripe.Event;
    await processStripeEvent(event, stripe);
    await markStripeEventStatus({ stripeEventId, processingStatus: 'processed' });

    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error: any) {
    const stripeEventId = (() => {
      try {
        return String((error as any)?.stripeEventId ?? '');
      } catch {
        return '';
      }
    })();
    if (stripeEventId) {
      await markStripeEventStatus({
        stripeEventId,
        processingStatus: 'failed',
        errorMessage: error?.message || 'Stripe replay failed',
      });
    }
    await logStripeWebhookFailure({
      message: error?.message || 'Stripe replay failed',
    });
    return NextResponse.json(
      { error: error?.message || 'Unable to replay Stripe event.' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
