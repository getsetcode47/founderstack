/*
  # Founder Stack Hub deals platform

  Adds the production deal catalog, claim tracking, site settings, partner submissions,
  and storage support needed for the FounderStackHub.com product.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_role_check'
      AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
  END IF;
END $$;

ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'free', 'premium', 'admin'));

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

INSERT INTO public.deals (
  slug, name, short_name, logo_type, logo_text, brand_color, description, full_description,
  category, deal_headline, deal_details, eligibility, discount_method, discount_code,
  discount_url, out_of_credits, featured, published, sort_order, meta_title, meta_description
) VALUES
  ('notion', 'Notion', 'Notion', 'initial', 'N', '#f6f5f4', 'Startup workspace credits and team plan savings.', 'Get startup-friendly Notion workspace savings for docs, planning, roadmaps, and team collaboration with a clean founder operations stack.', 'Productivity', 'Up to 6 months of workspace credits', 'Includes workspace collaboration perks for internal docs, planning, and lightweight CRM workflows.', 'Early-stage founders and startup teams building their core operating system.', 'link', NULL, 'https://www.notion.so/startups', false, true, true, 10, 'Notion startup deal | Founder Stack Hub', 'Claim the Notion founder perk and save on your startup workspace stack.'),
  ('aws-activate', 'AWS Activate', 'AWS', 'initial', 'AWS', '#ff9900', 'Massive infrastructure credits for qualified startups.', 'AWS Activate helps qualified startups offset cloud spend across compute, storage, databases, and infrastructure services with meaningful credits and founder support.', 'Cloud', 'Cloud credits for eligible startups', 'Use credits across EC2, S3, RDS, and other AWS products while your startup finds product-market fit.', 'VC-backed startups and bootstrapped teams that meet AWS Activate program criteria.', 'link', NULL, 'https://aws.amazon.com/activate/', false, true, true, 20, 'AWS Activate deal | Founder Stack Hub', 'Apply for AWS Activate credits through Founder Stack Hub.'),
  ('hubspot', 'HubSpot', 'HubSpot', 'initial', 'HS', '#ff7a59', 'CRM and GTM discounts for startup teams.', 'HubSpot offers founder-friendly discounts across CRM, marketing automation, and sales tooling so lean teams can build GTM muscle earlier.', 'Sales', 'Startup pricing on CRM and automation', 'Includes discounted access to CRM, sequences, forms, email, and customer lifecycle tooling.', 'Founders building early sales, support, or lifecycle systems.', 'link', NULL, 'https://www.hubspot.com/startups', false, true, true, 30, 'HubSpot startup discount | Founder Stack Hub', 'Save on HubSpot for your startup sales and marketing stack.'),
  ('zendesk', 'Zendesk', 'Zendesk', 'initial', 'Z', '#ffffff', 'Support tooling discount for customer conversations.', 'Zendesk gives startup teams a cleaner way to centralize customer conversations, support workflows, and service reporting with partner pricing.', 'Support', 'Startup discount on support operations', 'Help desk tooling for email, chat, automations, and internal support workflows.', 'Founders building support ops for growing customer bases.', 'link', NULL, 'https://www.zendesk.com/startups/', false, false, true, 40, 'Zendesk founder deal | Founder Stack Hub', 'Unlock Zendesk pricing for startup support teams.'),
  ('github', 'GitHub', 'GitHub', 'initial', 'GH', '#ffffff', 'Developer platform savings for engineering teams.', 'GitHub startup offers help engineering teams reduce collaboration and code platform spend while keeping code reviews, CI, and repos centralized.', 'Dev Tools', 'Team plan savings for builders', 'Useful for engineering teams standardizing around repos, CI, pull requests, and security basics.', 'Startup engineering teams scaling product delivery.', 'link', NULL, 'https://github.com/enterprise/startups', false, true, true, 50, 'GitHub startup offer | Founder Stack Hub', 'Apply for GitHub startup perks and team discounts.'),
  ('gitlab', 'GitLab', 'GitLab', 'initial', 'GL', '#fc6d26', 'All-in-one dev platform credits for growing teams.', 'GitLab founder perks can reduce spend on source control, CI/CD, planning, and security workflows inside one engineering platform.', 'Dev Tools', 'Discounted all-in-one dev platform', 'Combines source control, pipelines, issues, and delivery workflows in one operating layer.', 'Product and engineering teams preferring an all-in-one DevOps stack.', 'link', NULL, 'https://about.gitlab.com/solutions/startups/', false, false, true, 60, 'GitLab startup program | Founder Stack Hub', 'Explore GitLab perks for startup engineering teams.'),
  ('intercom', 'Intercom', 'Intercom', 'initial', 'I', '#7c3aed', 'Conversational support and messaging deal.', 'Intercom helps founders manage in-app support, bots, and lifecycle messaging with startup-friendly pricing and support tooling.', 'Support', 'Savings on support and customer messaging', 'Includes shared inbox, chat workflows, and customer messaging primitives for lean teams.', 'B2B and product-led startups scaling support operations.', 'locked', NULL, NULL, false, true, true, 70, 'Intercom startup deal | Founder Stack Hub', 'Unlock Intercom savings for support and lifecycle messaging.'),
  ('make', 'Make', 'Make', 'initial', 'M', '#a855f7', 'Automation credits for no-code and ops workflows.', 'Make helps founders automate lead routing, support handoffs, CRM syncs, and internal workflows without custom glue code.', 'Operations', 'Automation credits and founder pricing', 'Ideal for startup ops, growth, and product teams connecting tools fast.', 'Founders building internal automations and workflow systems.', 'code', 'FOUNDERSTACK-MAKE', NULL, false, false, true, 80, 'Make founder offer | Founder Stack Hub', 'Get a founder promo code for Make automation workflows.'),
  ('brevo', 'Brevo', 'Brevo', 'initial', 'B', '#0ea5e9', 'Email and CRM savings for lean GTM teams.', 'Brevo gives founders lower-cost email, automation, and CRM tooling for newsletters, transactional sends, and lifecycle campaigns.', 'Marketing', 'Discounted email and lifecycle tooling', 'Includes campaign sending, contact management, and lightweight CRM functionality.', 'Startups building their first repeatable GTM engine.', 'code', 'BREVO-FOUNDERS', NULL, false, false, true, 90, 'Brevo startup promo | Founder Stack Hub', 'Claim the Brevo founder promo code.'),
  ('apollo-io', 'Apollo.io', 'Apollo.io', 'initial', 'AP', '#38bdf8', 'Prospecting platform perk for outbound teams.', 'Apollo.io helps founders build outbound pipelines with prospecting data, sequencing, and sales workflows under one roof.', 'Sales', 'Prospecting and outbound savings', 'Useful for founder-led sales teams building top-of-funnel systems and contact workflows.', 'B2B startups actively doing outbound or founder-led sales.', 'link', NULL, 'https://www.apollo.io/', false, false, true, 100, 'Apollo.io founder deal | Founder Stack Hub', 'Explore Apollo.io savings for startup outbound teams.'),
  ('adcreative-ai', 'AdCreative.ai', 'AdCreative.ai', 'initial', 'AC', '#fb7185', 'Creative generation credits for paid growth.', 'AdCreative.ai helps growth teams move faster on creative testing with AI-generated ad assets, variations, and campaign-ready creative concepts.', 'Marketing', 'Creative generation credits', 'Strong fit for startups testing paid social and performance acquisition loops.', 'Startups actively running paid acquisition campaigns.', 'code', 'ADCREATIVE-FOUNDERS', NULL, false, false, true, 110, 'AdCreative.ai startup deal | Founder Stack Hub', 'Get startup credits for AdCreative.ai.'),
  ('webflow', 'Webflow', 'Webflow', 'initial', 'WF', '#2563eb', 'Website and CMS perk for startup sites.', 'Webflow gives startup teams a premium visual web stack for landing pages, content sites, and flexible CMS-driven marketing builds.', 'Design', 'Save on your startup website stack', 'Use for launch pages, CMS content, and polished marketing sites without a large front-end build.', 'Founders shipping and iterating on brand and marketing sites.', 'link', NULL, 'https://webflow.com/', false, true, true, 120, 'Webflow startup offer | Founder Stack Hub', 'Save on Webflow for your startup site and CMS.'),
  ('lovable', 'Lovable', 'Lovable', 'initial', 'LO', '#22c55e', 'Build-product faster with AI app prototyping perks.', 'Lovable helps founders generate and iterate on app concepts quickly, making it useful for experiments, MVP surfaces, and rapid product validation.', 'AI', 'Founder perk for AI-assisted prototyping', 'Useful for founders moving from idea to prototype without a full product sprint.', 'Founders experimenting with app ideas and early validation.', 'locked', NULL, NULL, false, true, true, 130, 'Lovable founder perk | Founder Stack Hub', 'Unlock Lovable for AI-assisted startup prototyping.'),
  ('descript', 'Descript', 'Descript', 'initial', 'D', '#f97316', 'Editing and content production discount.', 'Descript helps founders produce polished audio, video, and talking-head content without a heavyweight post-production workflow.', 'Marketing', 'Content production savings', 'Great for podcast edits, launch videos, founder interviews, and marketing clips.', 'Founders producing frequent content or educational media.', 'code', 'DESCRIPT-STARTUP', NULL, false, false, true, 140, 'Descript founder deal | Founder Stack Hub', 'Reveal the Descript promo code for startup teams.'),
  ('cloudflare', 'Cloudflare', 'Cloudflare', 'initial', 'CF', '#f59e0b', 'Performance, security, and edge tooling credits.', 'Cloudflare can lower infrastructure complexity with CDN, DNS, security, caching, and edge application tooling for modern startup apps.', 'Cloud', 'Security and edge platform savings', 'Great for startups that need CDN, WAF, DNS, and edge tooling under one provider.', 'Teams shipping modern web products that need speed and protection.', 'link', NULL, 'https://www.cloudflare.com/startups/', false, true, true, 150, 'Cloudflare startup credits | Founder Stack Hub', 'Apply for Cloudflare startup perks and infrastructure savings.'),
  ('stripe', 'Stripe', 'Stripe', 'initial', 'S', '#8b5cf6', 'Payments and finance partner perks.', 'Stripe supports startup teams with payments infrastructure, billing systems, and partner programs that can reduce early finance stack friction.', 'Finance', 'Partner offer for billing and payments', 'Useful for subscriptions, one-off payments, invoicing, and finance operations.', 'Startups monetizing software products or services.', 'locked', NULL, NULL, false, true, true, 160, 'Stripe founder partner deal | Founder Stack Hub', 'Unlock Stripe partner savings for your startup.'),
  ('gemini-api', 'Gemini API', 'Gemini', 'initial', 'G', '#60a5fa', 'Model credits for AI features and experiments.', 'Gemini API credits help founders test multimodal AI features, assistants, and product workflows without carrying all of the early usage cost.', 'AI', 'Credits for multimodal AI features', 'Use for product experiments, copilots, assistants, and internal AI automation.', 'Startups building AI-assisted workflows or product features.', 'link', NULL, 'https://ai.google.dev/', false, false, true, 170, 'Gemini API founder credits | Founder Stack Hub', 'Explore Gemini API credits for startup product teams.'),
  ('claude', 'Claude', 'Claude', 'initial', 'C', '#d4d4d8', 'Claude credits and founder access perks.', 'Claude gives founders a high-quality model option for writing, support, code help, and long-context product workflows with premium model capabilities.', 'AI', 'Credits for Claude-powered workflows', 'Use for assistants, support, product copilots, and document-heavy workflows.', 'Founders building products or internal ops around AI reasoning.', 'link', NULL, 'https://www.anthropic.com/startups', false, true, true, 180, 'Claude startup credits | Founder Stack Hub', 'Claim Claude startup credits and founder perks.'),
  ('clickup', 'ClickUp', 'ClickUp', 'initial', 'CU', '#a78bfa', 'Ops and planning discount for startup execution.', 'ClickUp helps startup teams centralize planning, docs, tasks, and internal workflows with startup pricing for growing teams.', 'Productivity', 'Planning and operations savings', 'Useful for founders replacing spreadsheets and fragmented execution tools.', 'Teams that want one place for planning, docs, and execution.', 'code', 'CLICKUP-FOUNDERS', NULL, false, false, true, 190, 'ClickUp startup discount | Founder Stack Hub', 'Reveal the ClickUp founder promo code.'),
  ('xero', 'Xero', 'Xero', 'initial', 'X', '#10b981', 'Accounting software perk for startup finance.', 'Xero helps founders get clean bookkeeping, invoicing, reconciliations, and finance visibility without heavyweight enterprise tooling.', 'Finance', 'Accounting software savings', 'Useful for startups improving financial hygiene early and staying investor-ready.', 'Founders managing bookkeeping and finance operations in-house.', 'link', NULL, 'https://www.xero.com/', false, false, true, 200, 'Xero founder discount | Founder Stack Hub', 'Explore Xero pricing for startup accounting teams.'),
  ('instantly-ai', 'Instantly.ai', 'Instantly.ai', 'initial', 'IN', '#06b6d4', 'Outbound automation perk for lean GTM teams.', 'Instantly.ai gives startup teams tooling for cold outbound, sender rotation, workflows, and campaign optimization with partner pricing.', 'Sales', 'Outbound automation founder offer', 'Good for founder-led sales teams scaling campaigns and testing outbound motion.', 'B2B founders actively building outbound pipelines.', 'locked', NULL, NULL, false, false, true, 210, 'Instantly.ai founder deal | Founder Stack Hub', 'Unlock the Instantly.ai founder perk.'),
  ('capcut', 'CapCut', 'CapCut', 'initial', 'CC', '#ffffff', 'Video editing perk for growth content teams.', 'CapCut helps founders turn raw recordings into distribution-ready product demos, social clips, and quick launch assets.', 'Marketing', 'Video editing perk', 'Useful for launch content, UGC workflows, and founder-led social video production.', 'Teams producing regular short-form or demo content.', 'code', 'CAPCUT-STARTUP', NULL, false, false, true, 220, 'CapCut startup promo | Founder Stack Hub', 'Reveal the CapCut startup promo code.'),
  ('miro', 'Miro', 'Miro', 'initial', 'MI', '#fde047', 'Collaboration and whiteboarding discount.', 'Miro gives distributed startup teams a visual space for planning, workshops, roadmap reviews, and async collaboration.', 'Productivity', 'Visual collaboration partner offer', 'Great for workshops, planning sessions, sprint mapping, and cross-functional collaboration.', 'Founders coordinating distributed teams and planning systems.', 'link', NULL, 'https://miro.com/startups/', false, false, true, 230, 'Miro startup discount | Founder Stack Hub', 'Get the Miro startup offer for visual collaboration.'),
  ('supabase', 'Supabase', 'Supabase', 'initial', 'SB', '#3ecf8e', 'Backend and database credits for builders.', 'Supabase gives founders a fast path to auth, Postgres, storage, edge functions, and product infrastructure with startup credits and founder-friendly pricing.', 'Dev Tools', 'Startup credits for backend infrastructure', 'Use for auth, Postgres, storage, realtime, and edge product backends.', 'Startup teams building product infrastructure and internal tools.', 'link', NULL, 'https://supabase.com/startups', false, true, true, 240, 'Supabase startup credits | Founder Stack Hub', 'Apply for Supabase startup perks and backend credits.'),
  ('partner-submission', 'Partner Submission', 'Partner', 'initial', '+', '#fafafa', 'Join the Founder Stack Hub marketplace as a featured partner.', 'Partner with Founder Stack Hub to list your founder-friendly offer, reach startup operators, and publish a premium deal card directly into the deals experience.', 'Partner', 'List your tool as a founder perk partner', 'Use this editable database-driven card to invite founders and partners to submit new tools or offers.', 'Open to software companies, partner programs, and startup ecosystem operators.', 'link', NULL, '/submit-tool', false, false, true, 250, 'Submit your tool | Founder Stack Hub', 'Apply to list your founder perk or software offer on Founder Stack Hub.')
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  logo_type = EXCLUDED.logo_type,
  logo_text = EXCLUDED.logo_text,
  brand_color = EXCLUDED.brand_color,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  category = EXCLUDED.category,
  deal_headline = EXCLUDED.deal_headline,
  deal_details = EXCLUDED.deal_details,
  eligibility = EXCLUDED.eligibility,
  discount_method = EXCLUDED.discount_method,
  discount_code = EXCLUDED.discount_code,
  discount_url = EXCLUDED.discount_url,
  out_of_credits = EXCLUDED.out_of_credits,
  featured = EXCLUDED.featured,
  published = EXCLUDED.published,
  sort_order = EXCLUDED.sort_order,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = now();

INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-logos', 'deal-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Deal logos are publicly readable" ON storage.objects;
CREATE POLICY "Deal logos are publicly readable"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'deal-logos');

DROP POLICY IF EXISTS "Admins can upload deal logos" ON storage.objects;
CREATE POLICY "Admins can upload deal logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'deal-logos'
    AND public.is_admin((select auth.uid()))
  );

DROP POLICY IF EXISTS "Admins can update deal logos" ON storage.objects;
CREATE POLICY "Admins can update deal logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'deal-logos'
    AND public.is_admin((select auth.uid()))
  )
  WITH CHECK (
    bucket_id = 'deal-logos'
    AND public.is_admin((select auth.uid()))
  );
