import type {
  Deal,
  DealSortOption,
  DiscountMethod,
  Profile,
  SiteSettings,
  UserRole,
} from '@/types';

export const DEFAULT_SITE_SETTINGS: Omit<SiteSettings, 'id' | 'updated_at'> = {
  hero_title: 'Founder Stack Hub',
  hero_subtitle: 'Premium startup perks, credits, and founder-only offers.',
  hero_tagline: 'Curated founder deals',
  hero_description:
    'Discover premium software deals, cloud credits, marketing perks, and partner offers in one polished founder hub.',
  cta_primary_text: 'Browse deals',
  cta_primary_link: '/deals',
  cta_secondary_text: 'Submit your tool',
  cta_secondary_link: '/submit-tool',
  footer_text: 'Built for founders who move fast and buy carefully.',
};

export const DEFAULT_DEAL_CATEGORIES = [
  'Productivity',
  'Cloud',
  'Sales',
  'Support',
  'Dev Tools',
  'Marketing',
  'Finance',
  'AI',
  'Design',
  'Operations',
  'Partner',
] as const;

export function isAdminRole(role: UserRole | string | null | undefined) {
  return role === 'admin';
}

export function isMemberRole(role: UserRole | string | null | undefined) {
  return role === 'admin' || role === 'premium';
}

export function hasPaidAccess(profile: Partial<Profile> | null | undefined) {
  if (!profile) return false;
  if (profile.role === 'admin' || profile.role === 'premium') return true;
  if (profile.lifetime_access) return true;
  if (profile.plan_type === 'monthly' || profile.plan_type === 'annual' || profile.plan_type === 'lifetime') return true;
  return profile.subscription_status === 'active' || profile.subscription_status === 'trialing';
}

export function getDealInitials(deal: Pick<Deal, 'logo_text' | 'short_name' | 'name'>) {
  if (deal.logo_text?.trim()) return deal.logo_text.trim().slice(0, 3).toUpperCase();
  if (deal.short_name?.trim()) return deal.short_name.trim().slice(0, 3).toUpperCase();
  return deal.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

const DEAL_DOMAIN_OVERRIDES: Record<string, string> = {
  'AWS Activate': 'aws.amazon.com',
  'Google Cloud': 'cloud.google.com',
  'Microsoft Azure': 'azure.microsoft.com',
  DigitalOcean: 'digitalocean.com',
  Cloudflare: 'cloudflare.com',
  Supabase: 'supabase.com',
  Vercel: 'vercel.com',
  Railway: 'railway.com',
  OpenAI: 'openai.com',
  'Anthropic (Claude)': 'anthropic.com',
  'Claude AI (Anthropic)': 'anthropic.com',
  'Claude via Partner': 'anthropic.com',
  'Gemini (Google)': 'ai.google.dev',
  'Gemini API': 'ai.google.dev',
  ElevenLabs: 'elevenlabs.io',
  'Manus AI': 'manus.im',
  Perplexity: 'perplexity.ai',
  'Grok (xAI)': 'x.ai',
  'Hugging Face': 'huggingface.co',
  AssemblyAI: 'assemblyai.com',
  Notion: 'notion.so',
  Airtable: 'airtable.com',
  Slack: 'slack.com',
  Asana: 'asana.com',
  'Google Workspace': 'workspace.google.com',
  'Monday.com': 'monday.com',
  Monday: 'monday.com',
  ClickUp: 'clickup.com',
  'Notion AI': 'notion.so',
  Make: 'make.com',
  Zapier: 'zapier.com',
  n8n: 'n8n.io',
  Figma: 'figma.com',
  Framer: 'framer.com',
  Webflow: 'webflow.com',
  Canva: 'canva.com',
  Miro: 'miro.com',
  Whimsical: 'whimsical.com',
  HubSpot: 'hubspot.com',
  Brevo: 'brevo.com',
  Mailchimp: 'mailchimp.com',
  Semrush: 'semrush.com',
  'Apollo.io': 'apollo.io',
  Lemlist: 'lemlist.com',
  lemlist: 'lemlist.com',
  Smartlead: 'smartlead.ai',
  GitHub: 'github.com',
  GitLab: 'gitlab.com',
  JetBrains: 'jetbrains.com',
  MongoDB: 'mongodb.com',
  Replit: 'replit.com',
  'Bolt.new': 'bolt.new',
  'BLACKBOX AI': 'blackbox.ai',
  'CustomGPT.ai': 'customgpt.ai',
  'AdCreative.ai': 'adcreative.ai',
  'Instantly.ai': 'instantly.ai',
  Intercom: 'intercom.com',
  Zendesk: 'zendesk.com',
  Mixpanel: 'mixpanel.com',
  PostHog: 'posthog.com',
  Segment: 'segment.com',
  Airwallex: 'airwallex.com',
  Stripe: 'stripe.com',
  Brex: 'brex.com',
  Ramp: 'ramp.com',
  Mercury: 'mercury.com',
  Xero: 'xero.com',
  Lovable: 'lovable.dev',
  Freepik: 'freepik.com',
  Amplitude: 'amplitude.com',
  Emergent: 'emergent.sh',
  Anything: 'anything.world',
  Descript: 'descript.com',
  QuillBot: 'quillbot.com',
  'Fathom AI': 'fathom.video',
  Grammarly: 'grammarly.com',
  Clay: 'clay.com',
  CapCut: 'capcut.com',
  Gamma: 'gamma.app',
  'Riverside.fm': 'riverside.fm',
  LetsEnhance: 'letsenhance.io',
  Animoto: 'animoto.com',
  Freshworks: 'freshworks.com',
  Picsart: 'picsart.com',
  'Pippit AI': 'pippit.capcut.com',
  Kittl: 'kittl.com',
  Zoviz: 'zoviz.com',
  'Drag\'n Survey': 'dragnsurvey.com',
  DevRev: 'devrev.ai',
  'Winston AI': 'gowinston.ai',
  Synthesia: 'synthesia.io',
  Auth0: 'auth0.com',
  'NordVPN Teams': 'nordlayer.com',
  '1Password': '1password.com',
  Brand24: 'brand24.com',
};

export function getDealDomain(
  deal: Pick<Deal, 'name'> & { logo_image_url?: string | null }
) {
  const override = DEAL_DOMAIN_OVERRIDES[deal.name];
  if (override) return override;

  if (deal.logo_image_url) {
    try {
      const url = new URL(deal.logo_image_url);
      if (url.hostname === 'logo.clearbit.com') {
        return url.pathname.replace(/^\//, '');
      }
      return url.hostname.replace(/^www\./, '');
    } catch {}
  }

  return `${deal.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`;
}

export function getOfficialDealLogoUrl(
  deal: Pick<Deal, 'name'> & { logo_image_url?: string | null }
) {
  if (deal.logo_image_url) {
    if (!deal.logo_image_url.includes('logo.clearbit.com')) {
      return deal.logo_image_url;
    }
  }

  return getFallbackDealLogoUrl(deal);
}

export function getFallbackDealLogoUrl(
  deal: Pick<Deal, 'name'> & { logo_image_url?: string | null }
) {
  const domain = getDealDomain(deal);
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`;
}

export function getGeneratedDealLogoUrl(
  deal: Pick<Deal, 'name' | 'short_name' | 'logo_text' | 'brand_color'>
) {
  const params = new URLSearchParams({
    name: deal.name,
    brand: deal.brand_color || '#111111',
  });

  if (deal.short_name?.trim()) {
    params.set('short', deal.short_name.trim());
  }

  if (deal.logo_text?.trim()) {
    params.set('logoText', deal.logo_text.trim());
  }

  return `/api/logo?${params.toString()}`;
}

export function getDealPosterUrl(
  deal: Pick<Deal, 'name' | 'short_name' | 'logo_text' | 'brand_color'> & {
    logo_image_url?: string | null;
  }
) {
  const params = new URLSearchParams({
    name: deal.name,
    brand: deal.brand_color || '#111111',
    logo: getOfficialDealLogoUrl(deal),
  });

  if (deal.short_name?.trim()) {
    params.set('short', deal.short_name.trim());
  }

  if (deal.logo_text?.trim()) {
    params.set('logoText', deal.logo_text.trim());
  }

  return `/api/platform-art?${params.toString()}`;
}

export function getDealAvatarLabel(deal: Pick<Deal, 'short_name' | 'name'>) {
  return deal.short_name?.trim() || deal.name.slice(0, 18);
}

export function getDiscountCtaLabel(method: DiscountMethod, isAuthed: boolean, claimed: boolean) {
  if (claimed && method === 'code') return 'Code unlocked';
  if (claimed) return 'View claim';
  if (!isAuthed) return method === 'locked' ? 'Unlock offer' : 'Sign in to claim';
  if (method === 'code') return 'Reveal code';
  if (method === 'locked') return 'Unlock offer';
  return 'Claim deal';
}

export function getDealHref(deal: Pick<Deal, 'slug'>) {
  return `/deal/${deal.slug}`;
}

export function getVisibleDeals(deals: Deal[]) {
  return deals
    .filter((deal) => deal.published)
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export function getSortedDeals(deals: Deal[], sort: DealSortOption) {
  const copy = [...deals];
  if (sort === 'alphabetical') {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === 'newest') {
    return copy.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ||
        a.sort_order - b.sort_order
    );
  }
  return copy.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export function matchesDealQuery(deal: Deal, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    deal.name,
    deal.short_name ?? '',
    deal.category,
    deal.description,
    deal.deal_headline,
    deal.deal_details,
  ].some((value) => value.toLowerCase().includes(q));
}
