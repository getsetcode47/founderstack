import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminRole } from '@/lib/founderstack';
import { getAuthenticatedProfile } from '@/lib/site-data';
import { getRecentOutreachCampaigns } from '@/lib/admin-outreach';
import { isStripeCheckoutConfigured, isStripeSecretConfigured, isStripeWebhookConfigured } from '@/lib/stripe-config';
import { LaunchReadinessClient } from '@/components/dashboard/LaunchReadinessClient';

function isMissingOpsTable(error: { message?: string; code?: string } | null, tableName: string) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes(`Could not find the table 'public.${tableName}'`)
  );
}

export const metadata: Metadata = {
  title: 'Launch Readiness — FounderStackHub',
};

export const dynamic = 'force-dynamic';

export default async function LaunchReadinessPage() {
  const { session, profile } = await getAuthenticatedProfile();
  if (!session) redirect('/sign-in?redirectTo=/dashboard/launch-readiness');
  if (!isAdminRole(profile?.role)) redirect('/dashboard');

  const supabase = createAdminClient();
  const [webhookEventsResponse, appErrorsResponse, campaigns] = await Promise.all([
    supabase
      .from('subscription_events')
      .select('id, stripe_event_id, event_type, processing_status, error_message, received_at, processed_at')
      .order('received_at', { ascending: false })
      .limit(10),
    supabase
      .from('app_error_events')
      .select('id, source, route, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    getRecentOutreachCampaigns(6),
  ]);

  const webhookEvents = isMissingOpsTable(webhookEventsResponse.error, 'subscription_events')
    ? []
    : ((webhookEventsResponse.data ?? []) as any[]);

  const appErrors = isMissingOpsTable(appErrorsResponse.error, 'app_error_events')
    ? []
    : ((appErrorsResponse.data ?? []) as any[]);

  const checks = [
    { label: 'Sentry DSN configured', ok: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) },
    { label: 'Stripe secret configured', ok: isStripeSecretConfigured() },
    { label: 'Stripe checkout prices configured', ok: isStripeCheckoutConfigured() },
    { label: 'Stripe webhook secret configured', ok: isStripeWebhookConfigured() },
    { label: 'Resend configured', ok: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) },
    { label: 'App session secret configured', ok: Boolean(process.env.APP_SESSION_SECRET) },
    { label: 'Outreach queue secret configured', ok: Boolean(process.env.OUTREACH_QUEUE_SECRET) },
  ];

  return (
    <LaunchReadinessClient
      checks={checks}
      webhookEvents={webhookEvents}
      appErrors={appErrors}
      campaigns={campaigns}
    />
  );
}
