/*
  # Create profiles and categories tables

  ## Summary
  Sets up the core user profile extension and category taxonomy for Founder Stack Hub.

  ## New Tables

  ### profiles
  - Extends Supabase auth.users with app-specific fields
  - `id` - matches auth.users.id (uuid, primary key)
  - `username` - display name (text)
  - `avatar_url` - profile picture URL (text)
  - `role` - access level: 'free', 'premium', or 'admin' (text, default 'free')
  - `referral_code` - unique 8-char referral code (text)
  - `onboarding_completed` - tracks if user finished onboarding (boolean)
  - `interests` - array of category slugs user selected during onboarding (text[])
  - `created_at` - timestamp

  ### categories
  - Taxonomy for organizing perks
  - `id` (uuid, primary key)
  - `name` - display name (text)
  - `slug` - URL-safe identifier (text, unique)
  - `icon` - lucide icon name (text)
  - `color` - tailwind color class (text)
  - `description` - short description (text)

  ## Security
  - RLS enabled on both tables
  - Users can read their own profile and update it
  - Categories are publicly readable (no auth required)
  - Admins can manage categories
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  avatar_url text,
  role text NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium', 'admin')),
  referral_code text UNIQUE,
  onboarding_completed boolean NOT NULL DEFAULT false,
  interests text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'Layers',
  color text NOT NULL DEFAULT 'blue',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
