/*
  # Add Stripe Subscription Fields

  ## Summary
  Extends the `profiles` table with Stripe-specific fields needed to track
  subscription state, and creates an audit table for Stripe webhook events
  to ensure idempotent processing.

  ## Changes

  ### Modified Tables
  - `profiles`
    - `stripe_customer_id` (text, nullable) — Stripe customer ID linked to this user
    - `stripe_subscription_id` (text, nullable) — Active Stripe subscription ID
    - `subscription_status` (text, nullable) — One of: active, canceled, past_due, trialing, incomplete
    - `subscription_period_end` (timestamptz, nullable) — When the current billing period ends

  ### New Tables
  - `subscription_events`
    - `id` (uuid, primary key)
    - `stripe_event_id` (text, unique) — Stripe event ID for idempotency checks
    - `event_type` (text) — e.g. checkout.session.completed
    - `payload` (jsonb) — Full event payload for debugging
    - `processed_at` (timestamptz) — When we processed this event

  ## Security
  - RLS enabled on `subscription_events`
  - Only service role can insert/read subscription_events (admin-only audit table)
  - `profiles` already has RLS; new columns are protected by existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_subscription_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_period_end'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_period_end timestamptz;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS subscription_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  processed_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage subscription events"
  ON subscription_events
  FOR SELECT
  TO authenticated
  USING (false);

CREATE INDEX IF NOT EXISTS idx_subscription_events_stripe_event_id ON subscription_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
