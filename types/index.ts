export type UserRole = 'user' | 'free' | 'premium' | 'admin';
export type OfferType = 'credit' | 'discount' | 'free_trial' | 'lifetime';
export type ReferralStatus = 'pending' | 'completed';
export type PlanType = 'free' | 'monthly' | 'annual' | 'lifetime';
export type DealLogoType = 'image' | 'initial';
export type DiscountMethod = 'link' | 'code' | 'locked';
export type DealSortOption = 'custom' | 'alphabetical' | 'newest';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  referral_code: string | null;
  onboarding_completed: boolean;
  interests: string[];
  created_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_period_end: string | null;
  lifetime_access: boolean;
  plan_type: PlanType;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string | null;
  created_at: string;
}

export interface Perk {
  id: string;
  tool_name: string;
  description: string;
  short_description: string | null;
  category_id: string | null;
  value_amount: number;
  offer_type: OfferType;
  logo_url: string | null;
  redemption_link: string | null;
  expiry_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  click_count: number;
  claim_count: number;
  created_at: string;
  categories?: Category;
}

export interface PerkClaim {
  id: string;
  user_id: string;
  perk_id: string;
  claimed_at: string;
  perks?: Perk;
}

export interface Bookmark {
  id: string;
  user_id: string;
  perk_id: string;
  created_at: string;
  perks?: Perk;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referral_code: string;
  status: ReferralStatus;
  created_at: string;
}

export type SortOption = 'newest' | 'highest_value' | 'most_popular' | 'expiring_soon';

export interface FilterState {
  search: string;
  categories: string[];
  valueRange: [number, number];
  offerTypes: OfferType[];
  sortBy: SortOption;
}

export interface Deal {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  logo_type: DealLogoType;
  logo_image_url: string | null;
  logo_text: string | null;
  brand_color: string;
  description: string;
  full_description: string;
  category: string;
  deal_headline: string;
  deal_details: string;
  eligibility: string;
  discount_method: DiscountMethod;
  discount_code: string | null;
  discount_url: string | null;
  out_of_credits: boolean;
  featured: boolean;
  published: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  free_deal?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DealClaim {
  id: string;
  user_id: string;
  deal_id: string;
  created_at: string;
  deals?: Deal;
}

export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  hero_description: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  footer_text: string;
  updated_at: string;
}

export interface PartnerSubmission {
  id: string;
  company_name: string;
  website_url: string;
  contact_name: string;
  contact_email: string;
  category: string | null;
  details: string | null;
  status: 'new' | 'reviewing' | 'approved' | 'rejected';
  created_at: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: BlogPostStatus;
  target_keyword: string;
  topic_cluster: string;
  search_intent: string | null;
  meta_title: string;
  meta_description: string;
  cover_image_url: string | null;
  author_name: string;
  ai_model: string | null;
  source_notes: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
