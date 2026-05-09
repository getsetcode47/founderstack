/*
  # Create perks, claims, and bookmarks tables

  ## Summary
  Creates the core perks system including the perks catalog, user claim tracking,
  bookmark functionality, and referral program.

  ## New Tables

  ### perks
  - Main catalog of startup tools and discounts
  - `id` (uuid, primary key)
  - `tool_name` - product/tool name (text)
  - `description` - full description (text)
  - `short_description` - 2-line preview (text)
  - `category_id` - FK to categories (uuid)
  - `value_amount` - USD value of the perk (numeric)
  - `offer_type` - 'credit', 'discount', 'free_trial', 'lifetime' (text)
  - `logo_url` - tool logo image URL (text)
  - `redemption_link` - URL to claim the perk (text)
  - `expiry_date` - when the offer expires (timestamptz, nullable)
  - `is_featured` - show on homepage (boolean)
  - `is_active` - perk is live and claimable (boolean)
  - `click_count` - total link clicks tracked (integer)
  - `claim_count` - total claims tracked (integer)
  - `created_at` (timestamptz)

  ### perk_claims
  - Tracks which users claimed which perks
  - `id` (uuid)
  - `user_id` FK to auth.users
  - `perk_id` FK to perks
  - `claimed_at` (timestamptz)
  - Unique constraint on (user_id, perk_id) prevents duplicate claims

  ### bookmarks
  - User saved perks for later
  - `id` (uuid)
  - `user_id` FK to auth.users
  - `perk_id` FK to perks
  - `created_at` (timestamptz)
  - Unique constraint on (user_id, perk_id)

  ### referrals
  - Referral program tracking
  - `id` (uuid)
  - `referrer_id` - user who shared the code
  - `referred_id` - new user who signed up
  - `referral_code` - the code used
  - `status` - 'pending', 'completed' (text)
  - `created_at` (timestamptz)

  ## Security
  - Active perks are publicly readable (discovery without login)
  - Claims and bookmarks are private to the owning user
  - Admins can perform full CRUD on perks
*/

CREATE TABLE IF NOT EXISTS perks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  description text NOT NULL,
  short_description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  value_amount numeric NOT NULL DEFAULT 0,
  offer_type text NOT NULL DEFAULT 'credit' CHECK (offer_type IN ('credit', 'discount', 'free_trial', 'lifetime')),
  logo_url text,
  redemption_link text,
  expiry_date timestamptz,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  click_count integer NOT NULL DEFAULT 0,
  claim_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE perks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active perks are publicly readable"
  ON perks FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can read all perks"
  ON perks FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert perks"
  ON perks FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update perks"
  ON perks FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete perks"
  ON perks FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS perk_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  perk_id uuid NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, perk_id)
);

ALTER TABLE perk_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own claims"
  ON perk_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims"
  ON perk_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all claims"
  ON perk_claims FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  perk_id uuid NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, perk_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE INDEX IF NOT EXISTS idx_perks_category ON perks(category_id);
CREATE INDEX IF NOT EXISTS idx_perks_featured ON perks(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_perks_active ON perks(is_active);
CREATE INDEX IF NOT EXISTS idx_perk_claims_user ON perk_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
