/*
  # Add missing foreign key indexes

  ## Summary
  Several foreign keys are missing covering indexes, leading to suboptimal query
  performance (especially on DELETE/UPDATE of referenced rows).

  ## New Indexes
  - `idx_bookmarks_perk_id` on `public.bookmarks(perk_id)`
  - `idx_perk_claims_perk_id` on `public.perk_claims(perk_id)`
  - `idx_referrals_referred_id` on `public.referrals(referred_id)`
  - `idx_referrals_referrer_id` on `public.referrals(referrer_id)`
*/

CREATE INDEX IF NOT EXISTS idx_bookmarks_perk_id ON public.bookmarks(perk_id);
CREATE INDEX IF NOT EXISTS idx_perk_claims_perk_id ON public.perk_claims(perk_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
