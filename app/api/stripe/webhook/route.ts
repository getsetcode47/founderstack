import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';
import { isStripeSecretConfigured, isStripeWebhookConfigured } from '@/lib/stripe-config';
import { logStripeWebhookFailure, markStripeEventStatus, processStripeEvent } from '@/lib/stripe-webhooks';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);
}

export async function POST(req: Request) {
  if (!isStripeSecretConfigured() || !isStripeWebhookConfigured()) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    await logStripeWebhookFailure({
      message: err?.message || 'Stripe signature verification failed',
    });
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from('subscription_events')
    .select('id')
    .eq('stripe_event_id', event.id)
    .maybeSingle();

  if (existing) {
    await markStripeEventStatus({ stripeEventId: event.id, processingStatus: 'duplicate' });
    return NextResponse.json({ received: true });
  }

  await supabaseAdmin.from('subscription_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event as any,
    processing_status: 'received',
  });

  try {
    await processStripeEvent(event, stripe);
    await markStripeEventStatus({ stripeEventId: event.id, processingStatus: 'processed' });

    return NextResponse.json({ received: true });
  } catch (err: any) {
    await markStripeEventStatus({
      stripeEventId: event.id,
      processingStatus: 'failed',
      errorMessage: err?.message || 'Unknown Stripe webhook processing failure',
    });
    await logStripeWebhookFailure({
      eventId: event.id,
      eventType: event.type,
      message: err?.message || 'Stripe webhook processing failed',
    });

    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
