import { cache } from 'react';
import { cookies } from 'next/headers';
import { deals as legacyDeals } from '@/app/deals/data';
import { decodeSession } from '@/lib/auth-session';
import { hasFreeDealFlag } from '@/lib/free-deals';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SITE_SETTINGS, getOfficialDealLogoUrl } from '@/lib/founderstack';
import type { BlogPost, Category, Deal, DealClaim, PartnerSubmission, Perk, Profile, SiteSettings } from '@/types';

const DIRECT_REDEMPTION_OVERRIDES: Record<string, string> = {
  'AWS Activate': 'https://aws.amazon.com/activate/',
  'Microsoft for Startups': 'https://www.microsoft.com/startups',
  'Google Cloud': 'https://cloud.google.com/startup',
  Stripe: 'https://stripe.com/startups',
  HubSpot: 'https://www.hubspot.com/startups',
  Intercom: 'https://www.intercom.com/startups',
  Zendesk: 'https://www.zendesk.com/startups/',
  Algolia: 'https://www.algolia.com/startups/',
  Datadog: 'https://www.datadoghq.com/startups/',
  Mixpanel: 'https://mixpanel.com/startups',
  Render: 'https://render.com/startups',
  PostHog: 'https://posthog.com/startups',
  Notion: 'https://www.notion.com/startups',
  Miro: 'https://miro.com/startups/',
  Linear: 'https://linear.app/startups',
  Atlassian: 'https://www.atlassian.com/software/startups',
};

function slugifyDealName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapLegacyDeal(deal: (typeof legacyDeals)[number]): Deal {
  const slug = slugifyDealName(deal.name);
  const directRedemptionUrl = deal.redeemUrl ?? DIRECT_REDEMPTION_OVERRIDES[deal.name];
  const isDirectRedemption = Boolean(directRedemptionUrl);

  return {
    id: `legacy-${deal.id}`,
    slug,
    name: deal.name,
    short_name: null,
    logo_type: 'image',
    logo_image_url: getOfficialDealLogoUrl({
      name: deal.name,
      logo_image_url: deal.logoUrl ?? null,
    }),
    logo_text: null,
    brand_color: deal.color,
    description: deal.desc,
    full_description: [deal.desc, deal.conditions].filter(Boolean).join('. '),
    category: deal.category,
    deal_headline: deal.headline,
    deal_details: deal.conditions ?? 'See partner terms for eligibility and redemption details.',
    eligibility: deal.conditions ?? 'Startup founders and teams eligible under the partner terms.',
    discount_method: deal.locked && !isDirectRedemption ? 'locked' : 'link',
    discount_code: null,
    discount_url: deal.locked && !isDirectRedemption ? null : directRedemptionUrl ?? `/deal/${slug}`,
    out_of_credits: false,
    featured: deal.badge === 'Hot' || deal.badge === 'Premium',
    published: true,
    sort_order: deal.id,
    meta_title: `${deal.name} | Founder Stack Hub`,
    meta_description: `${deal.desc} ${deal.headline}`,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date().toISOString(),
  };
}

const legacyFallbackDeals = legacyDeals.map(mapLegacyDeal);
const legacyByName = new Map(legacyDeals.map((deal) => [deal.name.toLowerCase(), deal]));

function normalizePerkCategory(category?: Pick<Category, 'name' | 'slug'> | null) {
  if (!category) return 'SaaS';

  const byName: Record<string, string> = {
    'AI Tools': 'AI Tools',
    SaaS: 'SaaS',
    DevTools: 'Dev Tools',
    Marketing: 'Marketing',
    Cloud: 'Cloud',
    Design: 'Design',
    Finance: 'Finance',
    'Customer Success': 'Customer Success',
    Accelerators: 'Accelerators',
    Security: 'Security',
    Learning: 'Learning',
  };

  return byName[category.name] ?? byName[category.slug] ?? category.name ?? 'SaaS';
}

function mapPerkToDeal(perk: Perk & { categories?: Pick<Category, 'name' | 'slug'> | null }): Deal {
  const legacy = legacyByName.get(perk.tool_name.toLowerCase());
  const slug = slugifyDealName(perk.tool_name);
  const headline = perk.short_description || legacy?.headline || perk.description;
  const description = legacy?.desc || perk.short_description || perk.description;
  const fullDescription = [perk.description, legacy?.conditions].filter(Boolean).join('. ');
  const category = normalizePerkCategory(perk.categories ?? null);
  const isLocked = !perk.redemption_link || legacy?.locked;

  return {
    id: perk.id,
    slug,
    name: perk.tool_name,
    short_name: null,
    logo_type: perk.logo_url ? 'image' : 'initial',
    logo_image_url: getOfficialDealLogoUrl({
      name: perk.tool_name,
      logo_image_url: perk.logo_url ?? legacy?.logoUrl ?? null,
    }),
    logo_text: null,
    brand_color: legacy?.color || '#ffffff',
    description,
    full_description: fullDescription || description,
    category,
    deal_headline: headline,
    deal_details: perk.description,
    eligibility: legacy?.conditions || 'See partner terms for current eligibility and redemption details.',
    discount_method: isLocked ? 'locked' : 'link',
    discount_code: null,
    discount_url: isLocked ? null : perk.redemption_link,
    out_of_credits: false,
    featured: perk.is_featured,
    published: perk.is_active,
    sort_order: legacy?.id ?? 1000,
    meta_title: `${perk.tool_name} | Founder Stack Hub`,
    meta_description: `${description} ${headline}`,
    created_at: perk.created_at,
    updated_at: perk.created_at,
  };
}

function shouldUseLegacyFallback(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.deals'") ||
    error.message?.includes("Could not find the table 'public.deal_claims'") ||
    error.message?.includes("Could not find the table 'public.site_settings'") ||
    error.message?.includes('Invalid API key')
  );
}

function logDataError(context: string, error: { message?: string; code?: string } | null) {
  if (!error) return;
  if (shouldUseLegacyFallback(error)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`${context} fallback active`, error.message);
    }
    return;
  }
  console.error(context, error.message);
}

async function getPublishedDealsFromPerks() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('perks')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    logDataError('Failed to load perks fallback', error);
    return legacyFallbackDeals;
  }

  return ((data ?? []) as (Perk & { categories?: Pick<Category, 'name' | 'slug'> | null })[]).map(mapPerkToDeal);
}

export const getPublishedDeals = cache(async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    logDataError('Failed to load published deals', error);
    if (shouldUseLegacyFallback(error)) return getPublishedDealsFromPerks();
    return [] as Deal[];
  }

  return (data ?? []) as Deal[];
});

export const getFeaturedDeals = cache(async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .limit(6);

  if (error) {
    logDataError('Failed to load featured deals', error);
    if (shouldUseLegacyFallback(error)) {
      const perkDeals = await getPublishedDealsFromPerks();
      return perkDeals.filter((deal) => deal.featured).slice(0, 6);
    }
    return [] as Deal[];
  }

  return (data ?? []) as Deal[];
});

function scoreHomepageDeal(deal: Deal) {
  const text = `${deal.deal_headline} ${deal.description} ${deal.full_description} ${deal.category}`.toLowerCase();
  let score = 0;

  if (deal.discount_method === 'link') score += 8;
  if (deal.featured) score += 4;
  if (text.includes('free credit') || text.includes('credits')) score += 10;
  if (text.includes('free')) score += 8;
  if (text.includes('waived')) score += 7;
  if (text.includes('discount')) score += 3;
  if (text.includes('aws') || text.includes('openai') || text.includes('anthropic') || text.includes('google cloud')) score += 3;
  if (deal.category === 'Cloud' || deal.category === 'AI Tools' || deal.category === 'Dev Tools' || deal.category === 'SaaS') score += 2;
  if (deal.out_of_credits) score -= 20;
  if (deal.discount_method === 'locked') score -= 6;

  return score;
}

function scoreFreeDeal(deal: Deal) {
  const text = `${deal.deal_headline} ${deal.description} ${deal.full_description}`.toLowerCase();
  let score = 0;

  if (text.includes('free credit')) score += 12;
  if (text.includes('free')) score += 10;
  if (text.includes('credits')) score += 9;
  if (text.includes('months free') || text.includes('month free')) score += 7;
  if (text.includes('api credit')) score += 6;
  if (deal.discount_method === 'link') score += 5;
  if (deal.out_of_credits) score -= 20;

  return score;
}

export const getHomepageFeaturedDeals = cache(async () => {
  const deals = await getPublishedDeals();
  const manuallySelectedDeals = deals
    .filter((deal) => deal.published && deal.featured && !deal.out_of_credits)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 6);

  if (manuallySelectedDeals.length > 0) {
    return manuallySelectedDeals;
  }

  return [...deals]
    .filter((deal) => deal.published && !deal.out_of_credits)
    .sort((a, b) => scoreHomepageDeal(b) - scoreHomepageDeal(a))
    .slice(0, 6);
});

export const getFreeDeals = cache(async () => {
  const deals = await getPublishedDeals();
  const markedDeals = deals
    .filter((deal) => deal.published && !deal.out_of_credits && hasFreeDealFlag(deal.meta_description))
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 6)
    .map((deal) => ({ ...deal, free_deal: true }));

  if (markedDeals.length > 0) {
    return markedDeals;
  }

  return [...deals]
    .filter((deal) => deal.published && !deal.out_of_credits)
    .sort((a, b) => scoreFreeDeal(b) - scoreFreeDeal(a))
    .slice(0, 6)
    .map((deal) => ({ ...deal, free_deal: true }));
});

export const getSiteSettings = cache(async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    logDataError('Failed to load site settings', error);
  }

  return (data ?? { id: 'local-default', updated_at: new Date().toISOString(), ...DEFAULT_SITE_SETTINGS }) as SiteSettings;
});

export async function getDealBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    logDataError(`Failed to load deal ${slug}`, error);
    if (shouldUseLegacyFallback(error)) {
      const perkDeals = await getPublishedDealsFromPerks();
      return perkDeals.find((deal) => deal.slug === slug) ?? null;
    }
    return null;
  }

  return data as Deal | null;
}

export async function getAdminDealById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    logDataError(`Failed to load admin deal ${id}`, error);
    if (shouldUseLegacyFallback(error)) {
      const perkDeals = await getPublishedDealsFromPerks();
      return perkDeals.find((deal) => deal.id === id) ?? null;
    }
    return null;
  }

  return data as Deal | null;
}

export async function getAdminDeals() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    logDataError('Failed to load admin deals', error);
    if (shouldUseLegacyFallback(error)) return getPublishedDealsFromPerks();
    return [] as Deal[];
  }

  return (data ?? []) as Deal[];
}

export async function getPartnerSubmissions() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('partner_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logDataError('Failed to load partner submissions', error);
    return [] as PartnerSubmission[];
  }

  return (data ?? []) as PartnerSubmission[];
}

export async function getAuthenticatedProfile() {
  const sessionToken = cookies().get('fsh_session')?.value;
  const session = decodeSession(sessionToken);

  if (!session?.user?.id) {
    return { session: null, profile: null as Profile | null };
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  return { session, profile: (profile as Profile | null) ?? (session.profile as Profile | null) ?? null };
}

export async function getUserDealClaims(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deal_claims')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    logDataError('Failed to load user deal claims', error);
    return [] as DealClaim[];
  }

  return (data ?? []) as DealClaim[];
}

export const getPublishedBlogPosts = cache(async () => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    logDataError('Failed to load blog posts', error);
    return [] as BlogPost[];
  }

  return (data ?? []) as BlogPost[];
});

export async function getBlogPostBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    logDataError(`Failed to load blog post ${slug}`, error);
    return null;
  }

  return data as BlogPost | null;
}

export async function getAllBlogPostsForAutomation() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logDataError('Failed to load blog automation posts', error);
    return [] as BlogPost[];
  }

  return (data ?? []) as BlogPost[];
}
