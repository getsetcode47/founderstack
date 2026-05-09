/*
  # Create Giveaway Leads Table

  ## Summary
  Creates a table to capture email leads for the ChatGPT Business 1-month free giveaway.

  ## New Tables
  - `giveaway_leads`
    - `id` (uuid, primary key)
    - `email` (text, unique, required) - user's email address
    - `name` (text, optional) - user's name
    - `created_at` (timestamptz) - when they signed up

  ## Security
  - RLS enabled
  - Anyone can insert (public signup form)
  - Only admins can read leads
*/

CREATE TABLE IF NOT EXISTS giveaway_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE giveaway_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit their email"
  ON giveaway_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all leads"
  ON giveaway_leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
