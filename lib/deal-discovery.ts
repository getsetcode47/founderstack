import { createAdminClient } from '@/lib/supabase/admin';
import { getOfficialDealLogoUrl } from '@/lib/founderstack';

export interface DiscoverySource {
  id: string;
  name: string;
  source_type: string;
  homepage_url: string;
  crawl_url: string;
  parser_hint: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoveryRun {
  id: string;
  source_id: string;
  status: string;
  http_status: number | null;
  discovered_count: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
  created_at: string;
}

export interface DiscoveryCandidate {
  id: string;
  source_id: string;
  run_id: string | null;
  software_name: string;
  headline: string;
  approx_value: string | null;
  conditions: string | null;
  redeem_url: string | null;
  promo_code: string | null;
  category: string | null;
  status: string;
  confidence: number;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export function slugifyDiscoveryName(value: string) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getDiscoverySources() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deal_discovery_sources')
    .select('*')
    .order('active', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message || 'Failed to load discovery sources.');
  return (data ?? []) as DiscoverySource[];
}

export async function getDiscoveryRuns(limit = 20) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deal_discovery_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message || 'Failed to load discovery runs.');
  return (data ?? []) as DiscoveryRun[];
}

export async function getDiscoveryCandidates(limit = 50) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('deal_discovery_candidates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message || 'Failed to load discovery candidates.');
  return (data ?? []) as DiscoveryCandidate[];
}

export async function getDiscoveryOverview() {
  const supabase = createAdminClient();
  const [sources, runs, pendingCandidates, approvedCandidates] = await Promise.all([
    supabase.from('deal_discovery_sources').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('deal_discovery_runs').select('id', { count: 'exact', head: true }),
    supabase.from('deal_discovery_candidates').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('deal_discovery_candidates').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
  ]);

  return {
    activeSources: sources.count ?? 0,
    totalRuns: runs.count ?? 0,
    pendingCandidates: pendingCandidates.count ?? 0,
    approvedCandidates: approvedCandidates.count ?? 0,
  };
}

export function buildDealPayloadFromCandidate(candidate: DiscoveryCandidate) {
  const slugBase = candidate.approx_value
    ? `${candidate.software_name} ${candidate.approx_value}`
    : candidate.software_name;
  const headline = candidate.approx_value
    ? `${candidate.approx_value} in perks, credits, or savings`
    : candidate.headline;
  const description = candidate.conditions || candidate.headline;

  const hasPromoCode = Boolean(candidate.promo_code?.trim());
  const hasRedeemUrl = Boolean(candidate.redeem_url?.trim());

  const discount_method = hasPromoCode ? 'code' : hasRedeemUrl ? 'link' : 'locked';

  return {
    slug: slugifyDiscoveryName(slugBase),
    name: candidate.software_name,
    short_name: candidate.software_name,
    logo_type: 'image',
    logo_image_url: getOfficialDealLogoUrl({ name: candidate.software_name, logo_image_url: null }),
    logo_text: null,
    brand_color: '#ffffff',
    description,
    full_description: `${headline}. ${description}`,
    category: candidate.category || 'AI Tools',
    deal_headline: headline,
    deal_details: description,
    eligibility: description,
    discount_method,
    discount_code: hasPromoCode ? candidate.promo_code : null,
    discount_url: !hasPromoCode && hasRedeemUrl ? candidate.redeem_url : null,
    out_of_credits: false,
    featured: false,
    published: true,
    sort_order: 20000,
    meta_title: `${candidate.software_name} startup deal | Founder Stack Hub`,
    meta_description: `${headline}. ${description}`.slice(0, 160),
  };
}
