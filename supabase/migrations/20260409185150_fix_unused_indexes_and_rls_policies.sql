/*
  # Fix Unused Indexes and Multiple Permissive RLS Policies

  ## Summary

  1. **Remove 11 Unused Indexes** — Drops unused indexes across perks, perk_claims,
     bookmarks, profiles, referrals, and subscription_events. These indexes consume
     disk/memory and slow writes without providing query benefit.

  2. **Fix Multiple Permissive SELECT Policies on profiles** — Merges the two
     permissive SELECT policies ("Users can read own profile" and "Admins can read all
     profiles") into a single unified policy using OR logic. Multiple permissive
     policies for the same role/action are a Supabase security advisory.

  ## Indexes Removed
  - idx_perks_category, idx_perks_featured, idx_perks_active
  - idx_perk_claims_user, idx_perk_claims_perk_id
  - idx_bookmarks_user, idx_bookmarks_perk_id
  - idx_profiles_stripe_customer_id
  - idx_referrals_referrer_id, idx_referrals_referred_id
  - idx_subscription_events_stripe_event_id

  ## Notes
  - Auth DB connection strategy and leaked password protection must be configured
    via the Supabase dashboard (Auth > Settings), not via SQL.
*/

-- 1. Drop unused indexes
DROP INDEX IF EXISTS public.idx_perks_category;
DROP INDEX IF EXISTS public.idx_perks_featured;
DROP INDEX IF EXISTS public.idx_perks_active;
DROP INDEX IF EXISTS public.idx_perk_claims_user;
DROP INDEX IF EXISTS public.idx_bookmarks_user;
DROP INDEX IF EXISTS public.idx_subscription_events_stripe_event_id;
DROP INDEX IF EXISTS public.idx_profiles_stripe_customer_id;
DROP INDEX IF EXISTS public.idx_bookmarks_perk_id;
DROP INDEX IF EXISTS public.idx_perk_claims_perk_id;
DROP INDEX IF EXISTS public.idx_referrals_referred_id;
DROP INDEX IF EXISTS public.idx_referrals_referrer_id;

-- 2. Merge dual SELECT policies on profiles into one
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can read own profile or admins read all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
