import type Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { logAppError } from '@/lib/monitoring';

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

function getPeriodEnd(subscription: Stripe.Subscription): string | null {
  const sub = subscription as any;
  const periodEnd = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null;
}

function getPlanTypeFromSubscription(subscription: Stripe.Subscription): 'monthly' | 'annual' {
  const price = subscription.items.data[0]?.price;
  const interval = price?.recurring?.interval;
  return interval === 'year' ? 'annual' : 'monthly';
}

export async function markStripeEventStatus(input: {
  stripeEventId: string;
  processingStatus: 'received' | 'processed' | 'failed' | 'duplicate';
  errorMessage?: string | null;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  await supabaseAdmin
    .from('subscription_events')
    .update({
      processing_status: input.processingStatus,
      error_message: input.errorMessage ?? null,
      processed_at: new Date().toISOString(),
    })
    .eq('stripe_event_id', input.stripeEventId);
}

export async function processStripeEvent(event: Stripe.Event, stripe: Stripe) {
  const supabaseAdmin = getSupabaseAdmin();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan ?? (session.mode === 'payment' ? 'lifetime' : 'monthly');
      if (!userId) break;

      if (session.mode === 'payment' || plan === 'lifetime') {
        await supabaseAdmin
          .from('profiles')
          .update({
            role: 'premium',
            plan_type: 'lifetime',
            lifetime_access: true,
            stripe_customer_id: session.customer as string,
            subscription_status: 'lifetime',
            subscription_period_end: null,
          })
          .eq('id', userId);
      } else if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const resolvedPlan = plan === 'annual' ? 'annual' : getPlanTypeFromSubscription(subscription);
        await supabaseAdmin
          .from('profiles')
          .update({
            role: 'premium',
            plan_type: resolvedPlan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: subscription.status,
            subscription_period_end: getPeriodEnd(subscription),
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const isActive = subscription.status === 'active' || subscription.status === 'trialing';

      const { data: current } = await supabaseAdmin
        .from('profiles')
        .select('lifetime_access')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (current?.lifetime_access) break;

      await supabaseAdmin
        .from('profiles')
        .update({
          role: isActive ? 'premium' : 'free',
          plan_type: isActive ? getPlanTypeFromSubscription(subscription) : 'free',
          subscription_status: subscription.status,
          subscription_period_end: getPeriodEnd(subscription),
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: current } = await supabaseAdmin
        .from('profiles')
        .select('lifetime_access')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (current?.lifetime_access) break;

      await supabaseAdmin
        .from('profiles')
        .update({
          role: 'free',
          plan_type: 'free',
          stripe_subscription_id: null,
          subscription_status: 'canceled',
          subscription_period_end: null,
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: current } = await supabaseAdmin
        .from('profiles')
        .select('lifetime_access')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();

      if (current?.lifetime_access) break;

      await supabaseAdmin
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', customerId);
      break;
    }
  }
}

export async function logStripeWebhookFailure(params: {
  eventId?: string | null;
  eventType?: string | null;
  message: string;
}) {
  await logAppError({
    source: 'stripe-webhook',
    route: '/api/stripe/webhook',
    message: params.message,
    metadata: {
      stripeEventId: params.eventId ?? null,
      eventType: params.eventType ?? null,
    },
  });
}
