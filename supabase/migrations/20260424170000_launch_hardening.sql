/*
  # Launch hardening

  Adds production-focused observability, queueing, and index coverage:
  - app_error_events: lightweight internal error monitoring
  - outreach_campaigns: queue-backed admin email campaigns
  - subscription_events monitoring fields for Stripe webhook visibility
  - performance indexes for launch traffic
*/

CREATE TABLE IF NOT EXISTS public.app_error_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'app',
  route text,
  message text NOT NULL,
  digest text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_error_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read app error events" ON public.app_error_events;
CREATE POLICY "Admins can read app error events"
  ON public.app_error_events FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

CREATE TABLE IF NOT EXISTS public.outreach_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject text NOT NULL,
  message text NOT NULL,
  cta_label text,
  cta_url text,
  include_free_members boolean NOT NULL DEFAULT true,
  include_free_deal_leads boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  recipient_count integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  error_summary jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read outreach campaigns" ON public.outreach_campaigns;
CREATE POLICY "Admins can read outreach campaigns"
  ON public.outreach_campaigns FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Admins can insert outreach campaigns" ON public.outreach_campaigns;
CREATE POLICY "Admins can insert outreach campaigns"
  ON public.outreach_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Admins can update outreach campaigns" ON public.outreach_campaigns;
CREATE POLICY "Admins can update outreach campaigns"
  ON public.outreach_campaigns FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscription_events' AND column_name = 'processing_status'
  ) THEN
    ALTER TABLE public.subscription_events
      ADD COLUMN processing_status text NOT NULL DEFAULT 'received' CHECK (processing_status IN ('received', 'processed', 'failed', 'duplicate'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscription_events' AND column_name = 'error_message'
  ) THEN
    ALTER TABLE public.subscription_events
      ADD COLUMN error_message text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscription_events' AND column_name = 'received_at'
  ) THEN
    ALTER TABLE public.subscription_events
      ADD COLUMN received_at timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_plan_type ON public.profiles(plan_type);
CREATE INDEX IF NOT EXISTS idx_deal_claims_user_created_at ON public.deal_claims(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_published_featured_sort ON public.deals(published, featured, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_error_events_created_at ON public.app_error_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_status_created_at ON public.outreach_campaigns(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_events_processing_status ON public.subscription_events(processing_status, received_at DESC);

DROP TRIGGER IF EXISTS handle_outreach_campaigns_updated_at ON public.outreach_campaigns;
CREATE TRIGGER handle_outreach_campaigns_updated_at
  BEFORE UPDATE ON public.outreach_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
