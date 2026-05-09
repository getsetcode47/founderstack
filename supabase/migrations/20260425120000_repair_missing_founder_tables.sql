/*
  # Repair missing founder platform tables

  Some remote environments were marked as having applied the original
  Founder Stack Hub migration, but the core tables were still absent
  from PostgREST's schema cache. This migration safely recreates the
  missing tables and policies in an idempotent way.
*/

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  logo_type text NOT NULL DEFAULT 'initial' CHECK (logo_type IN ('image', 'initial')),
  logo_image_url text,
  logo_text text,
  brand_color text NOT NULL DEFAULT '#ffffff',
  description text NOT NULL,
  full_description text NOT NULL,
  category text NOT NULL,
  deal_headline text NOT NULL,
  deal_details text NOT NULL,
  eligibility text NOT NULL,
  discount_method text NOT NULL DEFAULT 'link' CHECK (discount_method IN ('link', 'code', 'locked')),
  discount_code text,
  discount_url text,
  out_of_credits boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 100,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT deals_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT deals_discount_payload CHECK (
    (discount_method = 'code' AND discount_code IS NOT NULL AND length(trim(discount_code)) > 0)
    OR (discount_method = 'link' AND discount_url IS NOT NULL AND length(trim(discount_url)) > 0)
    OR (discount_method = 'locked')
  )
);

CREATE TABLE IF NOT EXISTS public.deal_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id uuid NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, deal_id)
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  hero_tagline text NOT NULL,
  hero_description text NOT NULL,
  cta_primary_text text NOT NULL,
  cta_primary_link text NOT NULL,
  cta_secondary_text text NOT NULL,
  cta_secondary_link text NOT NULL,
  footer_text text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partner_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  website_url text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  category text,
  details text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS deals_published_sort_idx ON public.deals(published, sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS deals_featured_idx ON public.deals(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS deals_category_idx ON public.deals(category);
CREATE INDEX IF NOT EXISTS deals_slug_idx ON public.deals(slug);
CREATE INDEX IF NOT EXISTS deal_claims_user_idx ON public.deal_claims(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS partner_submissions_status_idx ON public.partner_submissions(status, created_at DESC);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published deals are readable by everyone" ON public.deals;
CREATE POLICY "Published deals are readable by everyone"
  ON public.deals FOR SELECT
  TO anon, authenticated
  USING (
    published = true
    OR public.is_admin((select auth.uid()))
  );

DROP POLICY IF EXISTS "Admins can insert deals" ON public.deals;
CREATE POLICY "Admins can insert deals"
  ON public.deals FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Admins can update deals" ON public.deals;
CREATE POLICY "Admins can update deals"
  ON public.deals FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Admins can delete deals" ON public.deals;
CREATE POLICY "Admins can delete deals"
  ON public.deals FOR DELETE
  TO authenticated
  USING (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Users can read own deal claims or admins" ON public.deal_claims;
CREATE POLICY "Users can read own deal claims or admins"
  ON public.deal_claims FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR public.is_admin((select auth.uid()))
  );

DROP POLICY IF EXISTS "Users can insert own deal claims" ON public.deal_claims;
CREATE POLICY "Users can insert own deal claims"
  ON public.deal_claims FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Anyone can submit partners" ON public.partner_submissions;
CREATE POLICY "Anyone can submit partners"
  ON public.partner_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read partner submissions" ON public.partner_submissions;
CREATE POLICY "Admins can read partner submissions"
  ON public.partner_submissions FOR SELECT
  TO authenticated
  USING (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS "Admins can update partner submissions" ON public.partner_submissions;
CREATE POLICY "Admins can update partner submissions"
  ON public.partner_submissions FOR UPDATE
  TO authenticated
  USING (public.is_admin((select auth.uid())))
  WITH CHECK (public.is_admin((select auth.uid())));

DROP TRIGGER IF EXISTS handle_deals_updated_at ON public.deals;
CREATE TRIGGER handle_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS handle_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER handle_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

INSERT INTO public.site_settings (
  id,
  hero_title,
  hero_subtitle,
  hero_tagline,
  hero_description,
  cta_primary_text,
  cta_primary_link,
  cta_secondary_text,
  cta_secondary_link,
  footer_text
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Founder Stack Hub',
  'The premium founder perks platform for software, cloud, GTM, and AI deals.',
  'Founder-only partner deals',
  'Claim curated software offers, startup credits, and trusted founder perks through a clean, fast, premium marketplace built to help startup teams spend less and move faster.',
  'Explore deals',
  '/deals',
  'Submit your tool',
  '/submit-tool',
  'Founder Stack Hub curates practical software deals for serious startup teams.'
) ON CONFLICT (id) DO UPDATE
SET
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_description = EXCLUDED.hero_description,
  cta_primary_text = EXCLUDED.cta_primary_text,
  cta_primary_link = EXCLUDED.cta_primary_link,
  cta_secondary_text = EXCLUDED.cta_secondary_text,
  cta_secondary_link = EXCLUDED.cta_secondary_link,
  footer_text = EXCLUDED.footer_text;
