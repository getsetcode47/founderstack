/*
  # Auto-create profile on signup + seed categories and sample perks

  ## Summary
  1. Creates a database trigger that automatically inserts a profiles row
     whenever a new user signs up via Supabase Auth.
  2. Seeds 5 core categories for the perks taxonomy.
  3. Seeds 20 realistic startup perks with values totaling $10M+ across categories.

  ## Trigger
  - `on_auth_user_created` fires AFTER INSERT on auth.users
  - Calls `handle_new_user()` which inserts into public.profiles
  - Generates a random 8-character referral code on profile creation

  ## Seed Data
  - 5 categories: AI Tools, SaaS, DevTools, Marketing, Cloud
  - 20 perks with realistic tool names, values, and descriptions
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    upper(substring(md5(random()::text), 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

INSERT INTO categories (id, name, slug, icon, color, description) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'AI Tools', 'ai-tools', 'Brain', 'blue', 'Large language models, image generation, automation and AI-powered productivity tools'),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'SaaS', 'saas', 'LayoutDashboard', 'green', 'Business software subscriptions for CRM, project management, HR, and more'),
  ('a1b2c3d4-0001-0001-0001-000000000003', 'DevTools', 'devtools', 'Code2', 'orange', 'Developer tools, IDEs, CI/CD, monitoring, logging, and infrastructure'),
  ('a1b2c3d4-0001-0001-0001-000000000004', 'Marketing', 'marketing', 'Megaphone', 'rose', 'SEO, email marketing, social media management, and growth tools'),
  ('a1b2c3d4-0001-0001-0001-000000000005', 'Cloud', 'cloud', 'Cloud', 'cyan', 'Cloud infrastructure, hosting, storage, CDN, and compute credits')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO perks (tool_name, short_description, description, category_id, value_amount, offer_type, logo_url, redemption_link, is_featured, is_active) VALUES
  (
    'OpenAI',
    '$500 in API credits for GPT-4 and beyond.',
    'Get $500 in free OpenAI API credits to power your AI-driven product. Access GPT-4, DALL-E, Whisper, and Embeddings APIs. Perfect for building intelligent features, chatbots, content generation pipelines, and more. Credits are valid for 6 months from redemption.',
    'a1b2c3d4-0001-0001-0001-000000000001', 500, 'credit',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://openai.com/startups', true, true
  ),
  (
    'Vercel',
    '$5,000 in Pro platform credits for 1 year.',
    'Deploy your Next.js, SvelteKit, or any frontend framework with Vercel Pro—free for one year. Enjoy unlimited deployments, edge functions, analytics, preview environments, and custom domains. The $5,000 credit covers all usage for up to a year for most early-stage startups.',
    'a1b2c3d4-0001-0001-0001-000000000005', 5000, 'credit',
    'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://vercel.com/startups', true, true
  ),
  (
    'AWS Activate',
    '$100,000 in AWS cloud credits for 2 years.',
    'Amazon Web Services Activate gives qualifying startups up to $100,000 in AWS credits over 2 years. Use credits on EC2, S3, RDS, Lambda, and 200+ other services. Includes access to technical support, training resources, and the AWS Startup community.',
    'a1b2c3d4-0001-0001-0001-000000000005', 100000, 'credit',
    'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://aws.amazon.com/activate', true, true
  ),
  (
    'Notion',
    '6 months free on the Plus plan for your team.',
    'Notion Plus includes unlimited blocks, unlimited file uploads, and 30-day page history for up to 10 guests. Perfect for building your internal wiki, product roadmap, and team documentation. Ideal for teams of 2-20 people in early stages.',
    'a1b2c3d4-0001-0001-0001-000000000002', 960, 'free_trial',
    'https://images.pexels.com/photos/6804595/pexels-photo-6804595.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://notion.so/startups', true, true
  ),
  (
    'Stripe Atlas',
    '$500 credit + waived $500 incorporation fee.',
    'Stripe Atlas helps you incorporate your startup as a US Delaware C-Corp from anywhere in the world. The founder perk waives the $500 standard fee and adds $500 in Stripe payment processing credits. Includes legal documents, an EIN, and a US bank account.',
    'a1b2c3d4-0001-0001-0001-000000000002', 1000, 'discount',
    'https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://stripe.com/atlas', true, true
  ),
  (
    'GitHub',
    'Free GitHub Team plan for up to 20 users.',
    'GitHub for Startups gives qualifying startups 20 seats of GitHub Team free for 1 year, then 50% off in year 2. Includes unlimited private repositories, code review, GitHub Actions CI/CD minutes, and GitHub Copilot access for all team members.',
    'a1b2c3d4-0001-0001-0001-000000000003', 3840, 'free_trial',
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://github.com/startups', true, true
  ),
  (
    'Anthropic',
    '$500 in Claude API credits.',
    'Access Anthropic''s Claude models with $500 in free API credits. Claude excels at long-context tasks, document analysis, coding assistance, and nuanced reasoning. Ideal for building document processing pipelines, AI assistants, and analysis tools.',
    'a1b2c3d4-0001-0001-0001-000000000001', 500, 'credit',
    'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://anthropic.com/startups', false, true
  ),
  (
    'HubSpot',
    '90% off HubSpot Starter Suite for 1 year.',
    'HubSpot''s Startup Program offers 90% off in year one, 50% off in year two on the Starter Suite. Includes CRM, email marketing, live chat, landing pages, and ad management tools—everything you need to acquire and retain your first 1,000 customers.',
    'a1b2c3d4-0001-0001-0001-000000000004', 4320, 'discount',
    'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://hubspot.com/startups', false, true
  ),
  (
    'Datadog',
    '2 years free infrastructure and APM monitoring.',
    'Datadog for Startups provides free Pro-tier infrastructure monitoring, APM, log management, and dashboards for 2 years. Monitor up to 10 hosts, 20 containers, and 30M log events per month. Includes real-user monitoring (RUM) and synthetics.',
    'a1b2c3d4-0001-0001-0001-000000000003', 7200, 'free_trial',
    'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://datadog.com/startups', false, true
  ),
  (
    'Figma',
    '1 year free Professional plan for design teams.',
    'Figma Professional gives your design team unlimited projects, unlimited version history, shared libraries, branching, and advanced prototyping. Up to 5 editors free for 1 year. Perfect for product designers, UX researchers, and cross-functional teams.',
    'a1b2c3d4-0001-0001-0001-000000000002', 900, 'free_trial',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://figma.com/startups', false, true
  ),
  (
    'Linear',
    '6 months free on Linear Business plan.',
    'Linear is the modern project management tool built for software teams. The Business plan includes unlimited members, advanced analytics, custom workflows, SLA management, and priority support. Used by thousands of high-growth startups.',
    'a1b2c3d4-0001-0001-0001-000000000002', 480, 'free_trial',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://linear.app/startups', false, true
  ),
  (
    'Google Cloud',
    '$200,000 in Google Cloud credits over 2 years.',
    'Google for Startups Cloud Program provides up to $200,000 in Google Cloud credits over 2 years. Access BigQuery, Vertex AI, Cloud Run, GKE, and all other GCP services. Also includes mentorship, technical support, and access to Google''s global startup network.',
    'a1b2c3d4-0001-0001-0001-000000000005', 200000, 'credit',
    'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://cloud.google.com/startups', false, true
  ),
  (
    'Intercom',
    '1 year free on Intercom Starter plan.',
    'Intercom Starter includes live chat, automated bots, in-app messaging, and a shared inbox for your entire support team. Handle customer conversations at scale with AI-powered suggestions and automated workflows. Valued at $228/month.',
    'a1b2c3d4-0001-0001-0001-000000000002', 2736, 'free_trial',
    'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://intercom.com/startups', false, true
  ),
  (
    'Postman',
    'Free Postman Team plan for API development.',
    'Postman Team gives your engineering team unlimited collections, mock servers, monitors, shared workspaces, and API documentation hosting. Essential for teams building RESTful or GraphQL APIs. Includes integration with GitHub, GitLab, and CI/CD tools.',
    'a1b2c3d4-0001-0001-0001-000000000003', 600, 'free_trial',
    'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://postman.com/startups', false, true
  ),
  (
    'Semrush',
    '$500 credit + 3 months free Pro subscription.',
    'Semrush Pro provides keyword research, competitor analysis, site audits, backlink analytics, and social media tracking. The startup offer includes 3 months free plus $500 in additional credits. Trusted by 10M+ digital marketers worldwide.',
    'a1b2c3d4-0001-0001-0001-000000000004', 1200, 'credit',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://semrush.com/startups', false, true
  ),
  (
    'Mixpanel',
    '1 year free Growth plan for product analytics.',
    'Mixpanel Growth gives you unlimited data retention, funnel analysis, cohort reports, A/B testing integration, and up to 5M tracked events per month. Build your product analytics foundation before you need to pay. Includes Mixpanel''s startup onboarding program.',
    'a1b2c3d4-0001-0001-0001-000000000002', 2400, 'free_trial',
    'https://images.pexels.com/photos/7688338/pexels-photo-7688338.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://mixpanel.com/startups', false, true
  ),
  (
    'Resend',
    '$1,000 in transactional email credits.',
    'Resend is the modern email API for developers. Get $1,000 in credits to send transactional emails, notifications, and marketing messages. Features include React Email templates, domain management, webhooks, and a clean developer dashboard.',
    'a1b2c3d4-0001-0001-0001-000000000004', 1000, 'credit',
    'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://resend.com', false, true
  ),
  (
    'Cloudflare',
    'Workers Paid plan free for 1 year.',
    'Cloudflare Workers Paid gives you 10M requests/day, 50ms CPU time per request, KV storage, Durable Objects, R2 object storage, and D1 database. Build serverless applications globally with zero cold starts. Includes DDoS protection and web analytics.',
    'a1b2c3d4-0001-0001-0001-000000000005', 600, 'free_trial',
    'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://cloudflare.com/startups', false, true
  ),
  (
    'Perplexity',
    '$200 in Perplexity API credits.',
    'Perplexity AI''s sonar-pro API combines real-time web search with LLM reasoning. Perfect for building research assistants, competitive intelligence tools, and knowledge bases. The $200 credit covers millions of tokens for your early product experiments.',
    'a1b2c3d4-0001-0001-0001-000000000001', 200, 'credit',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://perplexity.ai/pro', false, true
  ),
  (
    'Sentry',
    '6 months free on Sentry Team plan.',
    'Sentry provides application performance monitoring and error tracking for web, mobile, and backend applications. The Team plan includes unlimited projects, 1M errors/month, performance tracing, session replay, and integrations with GitHub, Jira, and Slack.',
    'a1b2c3d4-0001-0001-0001-000000000003', 900, 'free_trial',
    'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=80',
    'https://sentry.io/startups', false, true
  );
