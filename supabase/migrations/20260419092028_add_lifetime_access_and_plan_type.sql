/*
  # Add lifetime access and plan type to profiles

  1. Changes
    - Add `lifetime_access` (boolean, default false) - marks profiles that purchased the $50 lifetime plan
    - Add `plan_type` (text, default 'free') - tracks whether a user is on 'free', 'monthly', or 'lifetime'
  2. Notes
    - No destructive changes. Existing rows default to free.
    - RLS policies are unchanged; existing profile policies already gate reads/writes by auth.uid().
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'lifetime_access'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN lifetime_access boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN plan_type text NOT NULL DEFAULT 'free';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS profiles_plan_type_idx ON public.profiles(plan_type);
