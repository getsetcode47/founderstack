/*
  # Fix Unindexed Foreign Keys and RLS Performance

  ## Summary

  1. **Add Covering Indexes for Foreign Keys** — Creates indexes on all foreign key
     columns that were flagged as unindexed. Without these, JOINs and cascading
     operations on these columns require full table scans.

  2. **Fix RLS Initialization Plan on profiles** — The SELECT policy was calling
     auth.uid() directly, causing it to be re-evaluated for every row. Wrapping
     auth.uid() in a subquery (SELECT auth.uid()) causes it to be evaluated once
     per query, significantly improving performance at scale.

  ## New Indexes
  - bookmarks(perk_id) — covers bookmarks_perk_id_fkey
  - perk_claims(perk_id) — covers perk_claims_perk_id_fkey
  - perks(category_id) — covers perks_category_id_fkey
  - referrals(referred_id) — covers referrals_referred_id_fkey
  - referrals(referrer_id) — covers referrals_referrer_id_fkey

  ## Notes
  - Leaked Password Protection must be enabled via the Supabase Dashboard:
    Authentication > Settings > enable "Leaked Password Protection"
*/

-- 1. Add covering indexes for unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_bookmarks_perk_id ON public.bookmarks(perk_id);
CREATE INDEX IF NOT EXISTS idx_perk_claims_perk_id ON public.perk_claims(perk_id);
CREATE INDEX IF NOT EXISTS idx_perks_category_id ON public.perks(category_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);

-- 2. Fix RLS initialization plan on profiles
--    Replace direct auth.uid() calls with (select auth.uid()) to evaluate once per query
DROP POLICY IF EXISTS "Authenticated users can read own profile or admins read all" ON public.profiles;

CREATE POLICY "Authenticated users can read own profile or admins read all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );
