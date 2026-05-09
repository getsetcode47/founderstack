import { startupperksDeals } from '@/app/deals/startupperks-data';

export type DealBadge = 'Hot' | 'New' | 'Free' | 'Premium';

export type DealCategory =
  | 'Cloud'
  | 'AI Tools'
  | 'SaaS'
  | 'Design'
  | 'Marketing'
  | 'Dev Tools'
  | 'Finance'
  | 'Customer Success'
  | 'Accelerators'
  | 'Security'
  | 'Learning';

export type Deal = {
  id: number;
  name: string;
  category: DealCategory;
  headline: string;
  value: number;
  valueLabel: string;
  desc: string;
  conditions?: string;
  badge: DealBadge;
  locked: boolean;
  color: string;
  logoUrl?: string;
  redeemUrl?: string;
};

export const categories: { name: DealCategory | 'All'; slug: string }[] = [
  { name: 'All', slug: 'all' },
  { name: 'Cloud', slug: 'cloud' },
  { name: 'AI Tools', slug: 'ai' },
  { name: 'SaaS', slug: 'saas' },
  { name: 'Design', slug: 'design' },
  { name: 'Marketing', slug: 'marketing' },
  { name: 'Dev Tools', slug: 'dev' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Customer Success', slug: 'success' },
  { name: 'Accelerators', slug: 'accelerators' },
  { name: 'Security', slug: 'security' },
  { name: 'Learning', slug: 'learning' },
];

export const deals: Deal[] = [
  { id: 1, name: 'AWS Activate', category: 'Cloud', headline: '$100,000 in credits', value: 100000, valueLabel: '$100K', desc: 'Leading cloud platform for startups', conditions: 'Eligible startups only', badge: 'Hot', locked: true, color: '#FF9900', logoUrl: 'https://logo.clearbit.com/aws.amazon.com', redeemUrl: 'https://aws.amazon.com/activate/' },
  { id: 2, name: 'Google Cloud', category: 'Cloud', headline: '$200,000 in credits', value: 200000, valueLabel: '$200K', desc: 'For startups building on GCP', conditions: 'Google for Startups program', badge: 'Hot', locked: true, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/cloud.google.com', redeemUrl: 'https://cloud.google.com/startup' },
  { id: 3, name: 'Microsoft Azure', category: 'Cloud', headline: '$150,000 in credits', value: 150000, valueLabel: '$150K', desc: 'Azure startup program', conditions: 'Microsoft Founders Hub', badge: 'Hot', locked: true, color: '#0078D4', logoUrl: 'https://logo.clearbit.com/azure.microsoft.com' },
  { id: 4, name: 'DigitalOcean', category: 'Cloud', headline: '$500 in credits', value: 500, valueLabel: '$500', desc: 'Simple cloud for developers', conditions: 'Valid for 12 months', badge: 'New', locked: false, color: '#0080FF', logoUrl: 'https://logo.clearbit.com/digitalocean.com' },
  { id: 5, name: 'Cloudflare', category: 'Cloud', headline: '1 year free (up to $250K value)', value: 250000, valueLabel: '$250K', desc: 'Leading CDN & security', conditions: 'Startup plan eligibility', badge: 'Hot', locked: true, color: '#F38020', logoUrl: 'https://logo.clearbit.com/cloudflare.com' },
  { id: 6, name: 'Supabase', category: 'Cloud', headline: '1 year free Pro', value: 3000, valueLabel: '$3K', desc: 'Open source Firebase alternative', conditions: 'Startup program', badge: 'New', locked: false, color: '#3ECF8E', logoUrl: 'https://logo.clearbit.com/supabase.com' },
  { id: 7, name: 'Vercel', category: 'Cloud', headline: 'Pro plan free', value: 2400, valueLabel: '$2.4K', desc: 'Frontend deployment platform', conditions: '6 months free Pro', badge: 'Free', locked: false, color: '#000000', logoUrl: 'https://logo.clearbit.com/vercel.com' },
  { id: 8, name: 'Railway', category: 'Cloud', headline: '$500 credits', value: 500, valueLabel: '$500', desc: 'Deploy apps in seconds', conditions: 'New accounts only', badge: 'Free', locked: false, color: '#7B3FE4', logoUrl: 'https://logo.clearbit.com/railway.app' },

  { id: 9, name: 'OpenAI', category: 'AI Tools', headline: '$1,000 in API credits', value: 1000, valueLabel: '$1K', desc: 'GPT-4 & DALL-E access', conditions: 'For eligible startups', badge: 'Hot', locked: true, color: '#10A37F', logoUrl: 'https://logo.clearbit.com/openai.com' },
  { id: 10, name: 'Anthropic (Claude)', category: 'AI Tools', headline: '$500 in API credits', value: 500, valueLabel: '$500', desc: 'For every founder', conditions: 'Valid business email', badge: 'Hot', locked: true, color: '#D97757', logoUrl: 'https://logo.clearbit.com/anthropic.com' },
  { id: 11, name: 'Claude via Partner', category: 'AI Tools', headline: '$15,000 in credits', value: 15000, valueLabel: '$15K', desc: 'Premium Anthropic partnership', conditions: 'Interview required', badge: 'Premium', locked: true, color: '#D97757', logoUrl: 'https://logo.clearbit.com/anthropic.com' },
  { id: 12, name: 'Gemini (Google)', category: 'AI Tools', headline: '$10,000 in credits', value: 10000, valueLabel: '$10K', desc: 'For startups building with Gemini', conditions: 'Google for Startups', badge: 'Hot', locked: true, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/deepmind.google' },
  { id: 13, name: 'ElevenLabs', category: 'AI Tools', headline: '$4,000 in credits', value: 4000, valueLabel: '$4K', desc: 'AI voice generation', conditions: 'New teams', badge: 'Hot', locked: true, color: '#000000', logoUrl: 'https://logo.clearbit.com/elevenlabs.io' },
  { id: 14, name: 'Manus AI', category: 'AI Tools', headline: '$4,680 in credits', value: 4680, valueLabel: '$4.6K', desc: 'Autonomous AI agent', conditions: 'Valid business email required', badge: 'New', locked: true, color: '#6366F1', logoUrl: 'https://logo.clearbit.com/manus.im' },
  { id: 15, name: 'Perplexity', category: 'AI Tools', headline: '3 months Enterprise Pro free', value: 600, valueLabel: '$600', desc: 'AI answer engine', conditions: 'Teams 5+', badge: 'New', locked: true, color: '#20808D', logoUrl: 'https://logo.clearbit.com/perplexity.ai' },
  { id: 16, name: 'Grok (xAI)', category: 'AI Tools', headline: 'Credits available', value: 1000, valueLabel: '$1K', desc: "xAI's frontier model", conditions: 'API access required', badge: 'New', locked: false, color: '#000000', logoUrl: 'https://logo.clearbit.com/x.ai' },
  { id: 17, name: 'Hugging Face', category: 'AI Tools', headline: 'Free compute credits', value: 500, valueLabel: '$500', desc: 'Open source AI platform', conditions: 'Pro account', badge: 'Free', locked: false, color: '#FFD21E', logoUrl: 'https://logo.clearbit.com/huggingface.co' },
  { id: 18, name: 'AssemblyAI', category: 'AI Tools', headline: '$500 in credits', value: 500, valueLabel: '$500', desc: 'AI speech recognition', conditions: 'New accounts', badge: 'New', locked: false, color: '#2196F3', logoUrl: 'https://logo.clearbit.com/assemblyai.com' },

  { id: 19, name: 'Notion', category: 'SaaS', headline: '6 months free', value: 1000, valueLabel: '$1K', desc: 'All-in-one workspace', conditions: 'Teams up to 50', badge: 'Hot', locked: true, color: '#000000', logoUrl: 'https://logo.clearbit.com/notion.so', redeemUrl: 'https://www.notion.com/startups' },
  { id: 20, name: 'Airtable', category: 'SaaS', headline: '1 year free', value: 2400, valueLabel: '$2.4K', desc: 'Database meets spreadsheet', conditions: 'Pro plan', badge: 'Hot', locked: true, color: '#F82B60', logoUrl: 'https://logo.clearbit.com/airtable.com' },
  { id: 21, name: 'Slack', category: 'SaaS', headline: '25% off', value: 1000, valueLabel: '$1K', desc: 'Team communication platform', conditions: 'First year', badge: 'Hot', locked: true, color: '#4A154B', logoUrl: 'https://logo.clearbit.com/slack.com' },
  { id: 22, name: 'Asana', category: 'SaaS', headline: '80% off', value: 2000, valueLabel: '$2K', desc: 'Project management tool', conditions: 'First year', badge: 'Hot', locked: true, color: '#F06A6A', logoUrl: 'https://logo.clearbit.com/asana.com' },
  { id: 23, name: 'Monday.com', category: 'SaaS', headline: '40% off', value: 1500, valueLabel: '$1.5K', desc: 'Work OS for teams', conditions: 'First year', badge: 'New', locked: false, color: '#FF3D57', logoUrl: 'https://logo.clearbit.com/monday.com' },
  { id: 24, name: 'ClickUp', category: 'SaaS', headline: 'Free Unlimited plan', value: 600, valueLabel: '$600', desc: 'Everything app for work', conditions: 'Forever', badge: 'Free', locked: false, color: '#7B68EE', logoUrl: 'https://logo.clearbit.com/clickup.com' },
  { id: 25, name: 'Notion AI', category: 'SaaS', headline: 'Bundled with Notion', value: 500, valueLabel: '$500', desc: 'AI writing assistant', conditions: 'With Notion deal', badge: 'Hot', locked: true, color: '#000000', logoUrl: 'https://logo.clearbit.com/notion.so' },
  { id: 26, name: 'Make', category: 'SaaS', headline: '12 months free', value: 1200, valueLabel: '$1.2K', desc: 'No-code automation', conditions: 'Teams plan', badge: 'Hot', locked: true, color: '#6D1FD8', logoUrl: 'https://logo.clearbit.com/make.com' },
  { id: 27, name: 'Zapier', category: 'SaaS', headline: '40% off first year', value: 2000, valueLabel: '$2K', desc: 'Automation platform', conditions: 'First year only', badge: 'Hot', locked: true, color: '#FF4A00', logoUrl: 'https://logo.clearbit.com/zapier.com' },
  { id: 28, name: 'n8n', category: 'SaaS', headline: '6 months free', value: 500, valueLabel: '$500', desc: 'Open source automation', conditions: 'Cloud plan', badge: 'New', locked: false, color: '#EA4B71', logoUrl: 'https://logo.clearbit.com/n8n.io' },

  { id: 29, name: 'Figma', category: 'Design', headline: 'Professional plan free (1 year)', value: 900, valueLabel: '$900', desc: 'Collaborative design tool', conditions: 'New accounts', badge: 'Hot', locked: true, color: '#F24E1E', logoUrl: 'https://logo.clearbit.com/figma.com' },
  { id: 30, name: 'Framer', category: 'Design', headline: '1 year free', value: 600, valueLabel: '$600', desc: 'No-code web builder', conditions: 'Pro plan', badge: 'New', locked: true, color: '#0055FF', logoUrl: 'https://logo.clearbit.com/framer.com' },
  { id: 31, name: 'Webflow', category: 'Design', headline: '1 year free', value: 1200, valueLabel: '$1.2K', desc: 'Visual web development', conditions: 'CMS plan', badge: 'Hot', locked: true, color: '#146EF5', logoUrl: 'https://logo.clearbit.com/webflow.com' },
  { id: 32, name: 'Canva', category: 'Design', headline: '1 year Pro free', value: 150, valueLabel: '$150', desc: 'Design for everyone', conditions: 'New accounts', badge: 'Hot', locked: false, color: '#00C4CC', logoUrl: 'https://logo.clearbit.com/canva.com' },
  { id: 33, name: 'Miro', category: 'Design', headline: '$1,000 credits', value: 1000, valueLabel: '$1K', desc: 'Online whiteboard', conditions: 'Teams 5+', badge: 'Hot', locked: true, color: '#FFD02F', logoUrl: 'https://logo.clearbit.com/miro.com', redeemUrl: 'https://miro.com/startups/' },
  { id: 34, name: 'Whimsical', category: 'Design', headline: '50% off', value: 250, valueLabel: '$250', desc: 'Wireframes & diagrams', conditions: 'First year', badge: 'New', locked: false, color: '#9D4EDD', logoUrl: 'https://logo.clearbit.com/whimsical.com' },

  { id: 35, name: 'HubSpot', category: 'Marketing', headline: '90% off first year', value: 10000, valueLabel: '$10K', desc: 'Leading CRM platform', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#FF7A59', logoUrl: 'https://logo.clearbit.com/hubspot.com', redeemUrl: 'https://www.hubspot.com/startups' },
  { id: 36, name: 'Brevo', category: 'Marketing', headline: '75% off', value: 900, valueLabel: '$900', desc: 'Email marketing platform', conditions: 'First year', badge: 'Hot', locked: true, color: '#0B996E', logoUrl: 'https://logo.clearbit.com/brevo.com' },
  { id: 37, name: 'Mailchimp', category: 'Marketing', headline: '50% off 6 months', value: 500, valueLabel: '$500', desc: 'Email marketing', conditions: '6-month discount', badge: 'Hot', locked: true, color: '#FFE01B', logoUrl: 'https://logo.clearbit.com/mailchimp.com' },
  { id: 38, name: 'Semrush', category: 'Marketing', headline: '14-day free trial + 17% off', value: 400, valueLabel: '$400', desc: 'SEO & marketing toolkit', conditions: 'New accounts', badge: 'New', locked: false, color: '#FF642D', logoUrl: 'https://logo.clearbit.com/semrush.com' },
  { id: 39, name: 'Apollo.io', category: 'Marketing', headline: '50% off ($2,370 value)', value: 2370, valueLabel: '$2.3K', desc: 'Sales intelligence platform', conditions: 'First year', badge: 'Hot', locked: true, color: '#0052CC', logoUrl: 'https://logo.clearbit.com/apollo.io' },
  { id: 40, name: 'Lemlist', category: 'Marketing', headline: '50% off', value: 600, valueLabel: '$600', desc: 'Cold outreach automation', conditions: 'First year', badge: 'New', locked: false, color: '#FFCB00', logoUrl: 'https://logo.clearbit.com/lemlist.com' },
  { id: 41, name: 'Smartlead', category: 'Marketing', headline: '20% off', value: 300, valueLabel: '$300', desc: 'Cold email platform', conditions: 'First year', badge: 'New', locked: false, color: '#5B5FEF', logoUrl: 'https://logo.clearbit.com/smartlead.ai' },

  { id: 42, name: 'GitHub', category: 'Dev Tools', headline: '12 months free (Enterprise)', value: 2500, valueLabel: '$2.5K', desc: 'Developer platform', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#181717', logoUrl: 'https://logo.clearbit.com/github.com' },
  { id: 43, name: 'GitLab', category: 'Dev Tools', headline: '1 year free Ultimate', value: 1400, valueLabel: '$1.4K', desc: 'DevOps platform', conditions: 'Up to 20 users', badge: 'New', locked: true, color: '#FC6D26', logoUrl: 'https://logo.clearbit.com/gitlab.com' },
  { id: 44, name: 'JetBrains', category: 'Dev Tools', headline: '6 months free', value: 300, valueLabel: '$300', desc: 'Developer IDEs', conditions: 'All products pack', badge: 'Hot', locked: false, color: '#000000', logoUrl: 'https://logo.clearbit.com/jetbrains.com' },
  { id: 45, name: 'MongoDB', category: 'Dev Tools', headline: '$500 free credits', value: 500, valueLabel: '$500', desc: 'Developer data platform', conditions: 'Atlas new accounts', badge: 'Hot', locked: false, color: '#47A248', logoUrl: 'https://logo.clearbit.com/mongodb.com' },
  { id: 46, name: 'Replit', category: 'Dev Tools', headline: '3 months free Replit Core', value: 90, valueLabel: '$90', desc: 'Browser-based IDE', conditions: 'New accounts', badge: 'New', locked: false, color: '#F26207', logoUrl: 'https://logo.clearbit.com/replit.com' },
  { id: 47, name: 'Bolt.new', category: 'Dev Tools', headline: '20% off', value: 100, valueLabel: '$100', desc: 'AI web app builder', conditions: 'First year', badge: 'New', locked: false, color: '#3178C6', logoUrl: 'https://logo.clearbit.com/bolt.new' },
  { id: 48, name: 'Lovable', category: 'Dev Tools', headline: '3 months free', value: 150, valueLabel: '$150', desc: 'AI frontend builder', conditions: 'Pro plan', badge: 'New', locked: false, color: '#EC4899', logoUrl: 'https://logo.clearbit.com/lovable.dev' },
  { id: 48.1, name: 'Render', category: 'Cloud', headline: 'Startup program', value: 5000, valueLabel: '$5K', desc: 'Cloud application platform for fast-moving startups', conditions: 'Apply through the Render startup program', badge: 'New', locked: false, color: '#46E3B7', logoUrl: 'https://logo.clearbit.com/render.com', redeemUrl: 'https://render.com/startups' },
  { id: 48.2, name: 'Atlassian', category: 'Dev Tools', headline: 'Startup program', value: 1000, valueLabel: '$1K', desc: 'Startup software for product, engineering, and collaboration teams', conditions: 'Apply through the Atlassian startup program', badge: 'New', locked: false, color: '#0052CC', logoUrl: 'https://logo.clearbit.com/atlassian.com', redeemUrl: 'https://www.atlassian.com/software/startups' },

  { id: 49, name: 'Stripe', category: 'Finance', headline: '$20,000 in fee waivers', value: 20000, valueLabel: '$20K', desc: 'Online payments', conditions: 'New merchants', badge: 'Hot', locked: true, color: '#635BFF', logoUrl: 'https://logo.clearbit.com/stripe.com', redeemUrl: 'https://stripe.com/startups' },
  { id: 50, name: 'Brex', category: 'Finance', headline: '$1,000 bonus credits', value: 1000, valueLabel: '$1K', desc: 'Corporate card for startups', conditions: 'US entities', badge: 'Hot', locked: true, color: '#FF5A36', logoUrl: 'https://logo.clearbit.com/brex.com' },
  { id: 51, name: 'Ramp', category: 'Finance', headline: '$500 cashback', value: 500, valueLabel: '$500', desc: 'Business expense management', conditions: 'New accounts', badge: 'Hot', locked: false, color: '#FFD600', logoUrl: 'https://logo.clearbit.com/ramp.com' },
  { id: 52, name: 'Mercury', category: 'Finance', headline: 'Fee-free banking', value: 500, valueLabel: '$500', desc: 'Banking for startups', conditions: 'US entities', badge: 'New', locked: false, color: '#5B5FEF', logoUrl: 'https://logo.clearbit.com/mercury.com' },
  { id: 53, name: 'Xero', category: 'Finance', headline: '90% off 6 months', value: 300, valueLabel: '$300', desc: 'Accounting software', conditions: 'New accounts', badge: 'Hot', locked: true, color: '#13B5EA', logoUrl: 'https://logo.clearbit.com/xero.com' },

  { id: 54, name: 'Intercom', category: 'Customer Success', headline: '1 year free ($15K value)', value: 15000, valueLabel: '$15K', desc: 'Customer messaging platform', conditions: 'Early-stage startups', badge: 'Hot', locked: true, color: '#1F8DED', logoUrl: 'https://logo.clearbit.com/intercom.com', redeemUrl: 'https://www.intercom.com/startups' },
  { id: 55, name: 'Zendesk', category: 'Customer Success', headline: '6 months free ($50K value)', value: 50000, valueLabel: '$50K', desc: 'Customer service platform', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#03363D', logoUrl: 'https://logo.clearbit.com/zendesk.com', redeemUrl: 'https://www.zendesk.com/startups/' },
  { id: 56, name: 'Mixpanel', category: 'Customer Success', headline: '$50,000 in credits', value: 50000, valueLabel: '$50K', desc: 'Product analytics', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#7856FF', logoUrl: 'https://logo.clearbit.com/mixpanel.com', redeemUrl: 'https://mixpanel.com/startups' },
  { id: 57, name: 'PostHog', category: 'Customer Success', headline: '$50,000 in credits', value: 50000, valueLabel: '$50K', desc: 'Open source analytics', conditions: 'Startup program', badge: 'Free', locked: false, color: '#F9BD2B', logoUrl: 'https://logo.clearbit.com/posthog.com', redeemUrl: 'https://posthog.com/startups' },
  { id: 58, name: 'Segment', category: 'Customer Success', headline: '$50,000 in credits', value: 50000, valueLabel: '$50K', desc: 'Customer data platform', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#52BD94', logoUrl: 'https://logo.clearbit.com/segment.com' },

  { id: 59, name: 'Y Combinator', category: 'Accelerators', headline: 'Application support & resources', value: 500000, valueLabel: '$500K', desc: "World's top accelerator", conditions: 'Application guides', badge: 'Premium', locked: true, color: '#FF6600', logoUrl: 'https://logo.clearbit.com/ycombinator.com' },
  { id: 60, name: 'Techstars', category: 'Accelerators', headline: 'Program database & tips', value: 120000, valueLabel: '$120K', desc: 'Global startup network', conditions: 'Program access guide', badge: 'Premium', locked: true, color: '#0CA33F', logoUrl: 'https://logo.clearbit.com/techstars.com' },
  { id: 61, name: 'Antler', category: 'Accelerators', headline: 'Program access guide', value: 100000, valueLabel: '$100K', desc: 'Day-0 investor', conditions: 'Application playbook', badge: 'Premium', locked: true, color: '#E5484D', logoUrl: 'https://logo.clearbit.com/antler.co' },
  { id: 62, name: 'SBIR Grants', category: 'Accelerators', headline: 'Up to $2M non-dilutive', value: 2000000, valueLabel: '$2M', desc: 'US government grants', conditions: 'US-based R&D', badge: 'Premium', locked: true, color: '#005EA2', logoUrl: 'https://logo.clearbit.com/sbir.gov' },
  { id: 63, name: 'EU Horizon Grants', category: 'Accelerators', headline: 'Up to €2.5M', value: 2500000, valueLabel: '€2.5M', desc: 'European R&D funding', conditions: 'EU-based companies', badge: 'Premium', locked: true, color: '#003399', logoUrl: 'https://logo.clearbit.com/ec.europa.eu' },
  { id: 64, name: 'Google for Startups', category: 'Accelerators', headline: '$200K cloud credits', value: 200000, valueLabel: '$200K', desc: "Google's startup program", conditions: 'Application required', badge: 'Hot', locked: true, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/google.com' },

  { id: 65, name: 'Auth0', category: 'Security', headline: '1 year free ($20K value)', value: 20000, valueLabel: '$20K', desc: 'Authentication platform', conditions: 'Startup program', badge: 'Hot', locked: true, color: '#EB5424', logoUrl: 'https://logo.clearbit.com/auth0.com' },
  { id: 66, name: 'NordVPN Teams', category: 'Security', headline: '70% off', value: 400, valueLabel: '$400', desc: 'Business VPN', conditions: 'First year', badge: 'New', locked: false, color: '#4687FF', logoUrl: 'https://logo.clearbit.com/nordvpn.com' },
  { id: 67, name: '1Password', category: 'Security', headline: '25% off', value: 150, valueLabel: '$150', desc: 'Password manager', conditions: 'Teams plan', badge: 'New', locked: false, color: '#0572EC', logoUrl: 'https://logo.clearbit.com/1password.com' },

  { id: 68, name: 'Coursera for Teams', category: 'Learning', headline: '30% off', value: 500, valueLabel: '$500', desc: 'Online learning platform', conditions: 'Teams 5+', badge: 'New', locked: false, color: '#0056D2', logoUrl: 'https://logo.clearbit.com/coursera.org' },
  { id: 69, name: 'Udemy for Business', category: 'Learning', headline: '30% off', value: 400, valueLabel: '$400', desc: 'Skills training', conditions: 'First year', badge: 'New', locked: false, color: '#A435F0', logoUrl: 'https://logo.clearbit.com/udemy.com' },
  { id: 70, name: 'Le Wagon', category: 'Learning', headline: '10% off bootcamp', value: 700, valueLabel: '$700', desc: 'Coding & AI bootcamp', conditions: 'Full-time track', badge: 'New', locked: false, color: '#E70067', logoUrl: 'https://logo.clearbit.com/lewagon.com' },

  { id: 71, name: 'Freepik', category: 'Design', headline: '50% off Business plan (Teams) for 1 year', value: 352, valueLabel: '$352', desc: 'Design faster with smart AI', badge: 'New', locked: false, color: '#1273EB', logoUrl: 'https://logo.clearbit.com/freepik.com' },
  { id: 72, name: 'Amplitude', category: 'Customer Success', headline: '3 months free on the Plus plan', value: 183, valueLabel: '$183', desc: 'See how users really experience your product', badge: 'Hot', locked: false, color: '#1B76FF', logoUrl: 'https://logo.clearbit.com/amplitude.com' },
  { id: 73, name: 'Emergent', category: 'Dev Tools', headline: 'First month free on the Standard plan', value: 19, valueLabel: '$19', desc: 'Build software with words, not code', badge: 'New', locked: false, color: '#00C2A8', logoUrl: 'https://logo.clearbit.com/emergent.sh' },
  { id: 74, name: 'Anything', category: 'Dev Tools', headline: '20% off all plans', value: 1798, valueLabel: '$1.8K', desc: 'Build apps like you talk', badge: 'Hot', locked: false, color: '#7C3AED', logoUrl: 'https://logo.clearbit.com/anything.ai' },
  { id: 75, name: 'Gemini API', category: 'AI Tools', headline: '$300 Gemini API credit', value: 300, valueLabel: '$300', desc: 'Infinite AI possibilities', badge: 'Hot', locked: false, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/ai.google.dev' },
  { id: 76, name: 'Descript', category: 'Design', headline: '35% off annual plans', value: 240, valueLabel: '$240', desc: 'Video and audio editing, as easy as a doc', badge: 'New', locked: false, color: '#5B45FF', logoUrl: 'https://logo.clearbit.com/descript.com' },
  { id: 77, name: 'BLACKBOX AI', category: 'Dev Tools', headline: '50% off Pro Plus for 6 months', value: 204, valueLabel: '$204', desc: 'Your AI pair programmer', badge: 'New', locked: false, color: '#000000', logoUrl: 'https://logo.clearbit.com/blackbox.ai' },
  { id: 78, name: 'QuillBot', category: 'AI Tools', headline: '30% off the annual Premium plan', value: 30, valueLabel: '$30', desc: 'Redefining content creation', badge: 'New', locked: false, color: '#2ECC71', logoUrl: 'https://logo.clearbit.com/quillbot.com' },
  { id: 79, name: 'Google Workspace', category: 'SaaS', headline: '20% off Plus plans for 1 year', value: 518, valueLabel: '$518', desc: 'A complete suite to improve employee productivity', badge: 'Hot', locked: false, color: '#4285F4', logoUrl: 'https://logo.clearbit.com/workspace.google.com' },
  { id: 80, name: 'Fathom AI', category: 'AI Tools', headline: 'First month free on the Premium plan', value: 40, valueLabel: '$40', desc: 'Your AI-powered meeting assistant', badge: 'New', locked: false, color: '#0EA5E9', logoUrl: 'https://logo.clearbit.com/fathom.video' },
  { id: 81, name: 'Grammarly', category: 'AI Tools', headline: '20% off monthly or annual plans for 1 year', value: 720, valueLabel: '$720', desc: 'Better writing, better results', badge: 'Hot', locked: false, color: '#15C39A', logoUrl: 'https://logo.clearbit.com/grammarly.com' },
  { id: 82, name: 'Claude AI (Anthropic)', category: 'AI Tools', headline: '$1,000 in credits across Anthropic models through OpenRouter API', value: 1000, valueLabel: '$1K', desc: 'Built for thinking, not just answering', badge: 'Premium', locked: true, color: '#D97757', logoUrl: 'https://logo.clearbit.com/anthropic.com' },
  { id: 83, name: 'AdCreative.ai', category: 'AI Tools', headline: '50% off all annual plans', value: 5296, valueLabel: '$5.3K', desc: 'Ad creative generation using AI', badge: 'Hot', locked: false, color: '#FF4F64', logoUrl: 'https://logo.clearbit.com/adcreative.ai' },
  { id: 84, name: 'Clay', category: 'Marketing', headline: '14 days free + 10% off annual plans', value: 229, valueLabel: '$229', desc: 'AI-powered prospecting', badge: 'New', locked: false, color: '#0F172A', logoUrl: 'https://logo.clearbit.com/clay.com' },
  { id: 85, name: 'CapCut', category: 'Design', headline: '7 days free + 25% off annual plans', value: 65, valueLabel: '$65', desc: 'Your video editing, upgraded', badge: 'Hot', locked: false, color: '#000000', logoUrl: 'https://logo.clearbit.com/capcut.com' },
  { id: 86, name: 'Gamma', category: 'AI Tools', headline: '400 credits + 25% off annual plans for Individuals', value: 52, valueLabel: '$52', desc: 'Design brilliance, powered by AI', badge: 'New', locked: false, color: '#7C3AED', logoUrl: 'https://logo.clearbit.com/gamma.app' },
  { id: 87, name: 'CustomGPT.ai', category: 'AI Tools', headline: '$99 off any purchase', value: 99, valueLabel: '$99', desc: 'No-code AI solutions for business support', badge: 'New', locked: false, color: '#0EA5E9', logoUrl: 'https://logo.clearbit.com/customgpt.ai' },
  { id: 88, name: 'Riverside.fm', category: 'Design', headline: '20% off first payment for any monthly or yearly plan', value: 189, valueLabel: '$189', desc: 'Record, edit, and go live with studio quality', badge: 'New', locked: false, color: '#4F46E5', logoUrl: 'https://logo.clearbit.com/riverside.fm' },
  { id: 89, name: 'LetsEnhance', category: 'AI Tools', headline: '50% off 100 and 300 image monthly subscriptions for 1 year', value: 192, valueLabel: '$192', desc: 'AI-powered image quality enhancement', badge: 'Premium', locked: true, color: '#06B6D4', logoUrl: 'https://logo.clearbit.com/letsenhance.io' },
  { id: 90, name: 'Animoto', category: 'Design', headline: '50% off annual plans', value: 450, valueLabel: '$450', desc: 'Make professional videos the easy way', badge: 'New', locked: false, color: '#E11D48', logoUrl: 'https://logo.clearbit.com/animoto.com' },
  { id: 91, name: 'Monday', category: 'SaaS', headline: 'First month free', value: 80, valueLabel: '$80', desc: 'Easily manage all your projects and become more productive', badge: 'Hot', locked: false, color: '#FF3D57', logoUrl: 'https://logo.clearbit.com/monday.com' },
  { id: 92, name: 'Instantly.ai', category: 'Marketing', headline: 'Additional 20% off monthly and annual plans', value: 860, valueLabel: '$860', desc: 'Smarter outreach, powered by AI', badge: 'Hot', locked: false, color: '#0052CC', logoUrl: 'https://logo.clearbit.com/instantly.ai' },
  { id: 93, name: 'Freshworks', category: 'Customer Success', headline: '14 days free on Freshdesk', value: 20, valueLabel: '$20', desc: 'Software suite for sales, marketing, and customer service teams', badge: 'New', locked: false, color: '#1DA462', logoUrl: 'https://logo.clearbit.com/freshworks.com' },
  { id: 94, name: 'Picsart', category: 'Design', headline: '10% off monthly or annual plans', value: 18, valueLabel: '$18', desc: 'Supercharge your creativity', badge: 'New', locked: false, color: '#FF0050', logoUrl: 'https://logo.clearbit.com/picsart.com' },
  { id: 95, name: 'Pippit AI', category: 'AI Tools', headline: '20% off annual plans', value: 187, valueLabel: '$187', desc: 'AI-powered marketing content creation for everyone', badge: 'New', locked: false, color: '#FF6B35', logoUrl: 'https://logo.clearbit.com/pippit.capcut.com' },
  { id: 96, name: 'Kittl', category: 'Design', headline: '25% off the annual plan for 1 year', value: 90, valueLabel: '$90', desc: 'Create. Collaborate. Captivate.', badge: 'New', locked: false, color: '#E11D48', logoUrl: 'https://logo.clearbit.com/kittl.com' },
  { id: 97, name: 'Zoviz', category: 'Design', headline: '30% off your plan', value: 15, valueLabel: '$15', desc: 'Professional branding made effortless', badge: 'Premium', locked: true, color: '#8B5CF6', logoUrl: 'https://logo.clearbit.com/zoviz.com' },
  { id: 98, name: "Drag'n Survey", category: 'Customer Success', headline: '50% off annual plans', value: 276, valueLabel: '$276', desc: 'AI-driven surveys', badge: 'New', locked: false, color: '#3B82F6', logoUrl: 'https://logo.clearbit.com/dragnsurvey.com' },
  { id: 99, name: 'DevRev', category: 'Dev Tools', headline: '12 months free on the Pro plan', value: 10000, valueLabel: '$10K', desc: 'Break silos, build products, and delight users', badge: 'Premium', locked: true, color: '#6366F1', logoUrl: 'https://logo.clearbit.com/devrev.ai' },
  { id: 100, name: 'Winston AI', category: 'AI Tools', headline: '30% off monthly or annual plans for 1 year', value: 176, valueLabel: '$176', desc: 'Keep your content authentic', badge: 'Premium', locked: true, color: '#1E40AF', logoUrl: 'https://logo.clearbit.com/gowinston.ai' },
  { id: 101, name: 'Synthesia', category: 'AI Tools', headline: '35% off annual Starter plan and 30% off annual Creator plan', value: 284, valueLabel: '$284', desc: 'Turn text into video in minutes with AI', badge: 'New', locked: false, color: '#7C3AED', logoUrl: 'https://logo.clearbit.com/synthesia.io' },
  { id: 102, name: 'lemlist', category: 'Marketing', headline: 'First month free + 20% off across all annual paid plans', value: 291, valueLabel: '$291', desc: 'Send emails that get replies', badge: 'Hot', locked: false, color: '#FFCB00', logoUrl: 'https://logo.clearbit.com/lemlist.com' },
  { id: 103, name: 'Brand24', category: 'Marketing', headline: 'First month free + 25% off annual plans', value: 599, valueLabel: '$599', desc: 'Hear what the world is saying about your brand', badge: 'New', locked: false, color: '#EF4444', logoUrl: 'https://logo.clearbit.com/brand24.com' },
  { id: 104, name: 'Airwallex', category: 'Finance', headline: 'Waived fees on first $50,000 in FX conversions', value: 1000, valueLabel: '$1K', desc: 'Global business payments and financial infrastructure', badge: 'Hot', locked: false, color: '#0F4CFF', logoUrl: 'https://logo.clearbit.com/airwallex.com' },
  ...startupperksDeals,
];
