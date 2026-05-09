/*
  # Fix RLS Auth Initialization Plans and Multiple Permissive Policies

  ## Summary
  1. Replace `auth.uid()` with `(select auth.uid())` in all RLS policies to prevent
     per-row re-evaluation of the auth function, improving query performance at scale.
  2. Consolidate multiple permissive SELECT policies on `profiles`, `perks`, and
     `perk_claims` into single policies to avoid the multiple-permissive-policy
     anti-pattern.

  ## Tables affected
  - `public.profiles` - 4 policies updated
  - `public.categories` - 2 policies updated
  - `public.perks` - 4 policies updated + SELECT consolidation
  - `public.perk_claims` - 3 policies updated + SELECT consolidation
  - `public.bookmarks` - 3 policies updated
  - `public.referrals` - 2 policies updated
*/

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (select auth.uid()) AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================
-- categories
-- ============================================================
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================
-- perks - drop all SELECT policies and replace with one consolidated policy
-- ============================================================
DROP POLICY IF EXISTS "Active perks are publicly readable" ON public.perks;
DROP POLICY IF EXISTS "Admins can read all perks" ON public.perks;
DROP POLICY IF EXISTS "Admins can insert perks" ON public.perks;
DROP POLICY IF EXISTS "Admins can update perks" ON public.perks;
DROP POLICY IF EXISTS "Admins can delete perks" ON public.perks;

-- Consolidated SELECT: active perks for everyone authenticated, all perks for admins
CREATE POLICY "Perks are readable by authenticated users"
  ON public.perks FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert perks"
  ON public.perks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update perks"
  ON public.perks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete perks"
  ON public.perks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- ============================================================
-- perk_claims - consolidate SELECT policies
-- ============================================================
DROP POLICY IF EXISTS "Users can read own claims" ON public.perk_claims;
DROP POLICY IF EXISTS "Users can insert own claims" ON public.perk_claims;
DROP POLICY IF EXISTS "Admins can read all claims" ON public.perk_claims;

-- Consolidated SELECT: own claims for users, all claims for admins
CREATE POLICY "Perk claims are readable by owner or admin"
  ON public.perk_claims FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert own claims"
  ON public.perk_claims FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================
-- bookmarks
-- ============================================================
DROP POLICY IF EXISTS "Users can read own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.bookmarks;

CREATE POLICY "Users can read own bookmarks"
  ON public.bookmarks FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================
-- referrals
-- ============================================================
DROP POLICY IF EXISTS "Users can read own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert referrals" ON public.referrals;

CREATE POLICY "Users can read own referrals"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = referrer_id
    OR (select auth.uid()) = referred_id
  );

CREATE POLICY "Users can insert referrals"
  ON public.referrals FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = referrer_id);
