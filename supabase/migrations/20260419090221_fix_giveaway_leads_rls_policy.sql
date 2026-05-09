/*
  # Fix giveaway_leads RLS INSERT policy

  ## Summary
  Replaces the unrestricted `WITH CHECK (true)` INSERT policy on `giveaway_leads`
  with a constrained policy that validates the submitted row:
  - `email` must be non-null and non-empty
  - `name`, if provided, must not exceed a reasonable length

  This prevents blank/malformed submissions while still allowing anonymous signups
  from the public giveaway form.

  ## Security Changes
  - DROP old permissive policy "Anyone can submit their email"
  - CREATE new policy with actual row-level validation
*/

DROP POLICY IF EXISTS "Anyone can submit their email" ON giveaway_leads;

CREATE POLICY "Public can insert valid email leads"
  ON giveaway_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 0
    AND length(email) <= 255
    AND (name IS NULL OR length(name) <= 200)
  );
