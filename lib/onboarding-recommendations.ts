import type { Deal } from '@/types';

export interface FounderOnboardingAnswers {
  startupName?: string;
  startupIdea: string;
  startupStage: string;
  teamSize: string;
  customerType: string;
  businessModel: string;
  primaryGoal: string;
  priorityCategories: string[];
  goToMarketChannels: string[];
}

const PRIORITY_TO_DEAL_CATEGORIES: Record<string, string[]> = {
  'AI stack': ['AI Tools', 'Cloud', 'Dev Tools'],
  'Product & engineering': ['Dev Tools', 'Cloud', 'SaaS'],
  'Sales & marketing': ['Marketing', 'Customer Success', 'SaaS'],
  'Design & collaboration': ['Design', 'Productivity', 'SaaS'],
  'Finance & operations': ['Finance', 'Operations', 'SaaS'],
  'Support & analytics': ['Customer Success', 'Marketing', 'SaaS'],
};

const CHANNEL_TO_DEAL_CATEGORIES: Record<string, string[]> = {
  SEO: ['Marketing'],
  'Cold outbound': ['Marketing', 'Customer Success'],
  'Paid acquisition': ['Marketing'],
  'Community growth': ['Marketing', 'Design'],
  Partnerships: ['Customer Success', 'Finance'],
  'Product-led growth': ['Dev Tools', 'Customer Success', 'SaaS'],
};

const CUSTOMER_KEYWORDS: Record<string, string[]> = {
  B2B: ['sales', 'crm', 'analytics', 'customer', 'support'],
  B2C: ['design', 'community', 'content', 'video', 'growth'],
  Marketplace: ['payments', 'compliance', 'analytics', 'workflow'],
  Developers: ['api', 'cloud', 'vector', 'llm', 'dev'],
  Students: ['student', 'education', 'campus'],
};

const MODEL_KEYWORDS: Record<string, string[]> = {
  SaaS: ['crm', 'workspace', 'automation', 'support', 'analytics'],
  AI: ['llm', 'agent', 'voice', 'model', 'inference', 'vector', 'ai'],
  Fintech: ['payments', 'compliance', 'banking', 'finance'],
  Ecommerce: ['checkout', 'store', 'shop', 'design', 'content'],
  Marketplace: ['payments', 'messaging', 'analytics', 'support'],
};

const STAGE_BONUSES: Record<string, string[]> = {
  Idea: ['Cloud', 'Dev Tools', 'AI Tools'],
  MVP: ['Dev Tools', 'Cloud', 'Design'],
  'Early traction': ['Marketing', 'Customer Success', 'Finance'],
  Growth: ['Marketing', 'Finance', 'Operations'],
  Enterprise: ['Security', 'Customer Success', 'Finance'],
};

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function recommendDealsForFounder(
  deals: Deal[],
  answers: FounderOnboardingAnswers,
  limit = 10,
) {
  const normalizedIdea = `${answers.startupIdea} ${answers.startupName ?? ''}`.toLowerCase();
  const priorityCategories = new Set(
    answers.priorityCategories.flatMap((item) => PRIORITY_TO_DEAL_CATEGORIES[item] ?? []),
  );
  const channelCategories = new Set(
    answers.goToMarketChannels.flatMap((item) => CHANNEL_TO_DEAL_CATEGORIES[item] ?? []),
  );
  const stageCategories = new Set(STAGE_BONUSES[answers.startupStage] ?? []);
  const customerKeywords = CUSTOMER_KEYWORDS[answers.customerType] ?? [];
  const modelKeywords = MODEL_KEYWORDS[answers.businessModel] ?? [];

  return [...deals]
    .filter((deal) => deal.published && !deal.out_of_credits)
    .map((deal) => {
      const haystack = `${deal.name} ${deal.category} ${deal.description} ${deal.full_description} ${deal.deal_headline} ${deal.eligibility}`.toLowerCase();
      let score = 0;

      if (deal.featured) score += 8;
      if (deal.discount_method === 'link' || deal.discount_method === 'code') score += 6;
      if (priorityCategories.has(deal.category)) score += 14;
      if (channelCategories.has(deal.category)) score += 8;
      if (stageCategories.has(deal.category)) score += 7;

      if (includesAny(haystack, customerKeywords)) score += 9;
      if (includesAny(haystack, modelKeywords)) score += 11;

      if (normalizedIdea.includes('voice') && includesAny(haystack, ['voice', 'speech', 'audio'])) score += 14;
      if (normalizedIdea.includes('video') && includesAny(haystack, ['video', 'creator', 'film'])) score += 14;
      if (normalizedIdea.includes('agent') && includesAny(haystack, ['agent', 'automation', 'workflow'])) score += 12;
      if (normalizedIdea.includes('search') && includesAny(haystack, ['vector', 'search', 'retrieval'])) score += 12;
      if (normalizedIdea.includes('fintech') && includesAny(haystack, ['payments', 'finance', 'banking'])) score += 12;
      if (normalizedIdea.includes('developer') && includesAny(haystack, ['api', 'cloud', 'compute', 'dev'])) score += 12;

      if (answers.primaryGoal === 'Ship faster' && includesAny(haystack, ['cloud', 'compute', 'dev', 'api', 'workspace'])) score += 12;
      if (answers.primaryGoal === 'Acquire customers' && includesAny(haystack, ['marketing', 'crm', 'growth', 'analytics'])) score += 12;
      if (answers.primaryGoal === 'Reduce infrastructure cost' && includesAny(haystack, ['credits', 'cloud', 'gpu', 'compute'])) score += 12;
      if (answers.primaryGoal === 'Improve retention and support' && includesAny(haystack, ['support', 'customer', 'messaging', 'analytics'])) score += 12;
      if (answers.primaryGoal === 'Set up ops and finance' && includesAny(haystack, ['payments', 'finance', 'operations', 'workspace'])) score += 12;

      if (deal.category === 'AI Tools' && normalizedIdea.match(/\b(ai|llm|agent|voice|model)\b/)) score += 8;
      if (deal.category === 'Cloud' && answers.teamSize !== 'Solo') score += 5;
      if (deal.category === 'Finance' && ['Growth', 'Enterprise'].includes(answers.startupStage)) score += 4;

      return { deal, score };
    })
    .sort((a, b) => b.score - a.score || a.deal.sort_order - b.deal.sort_order)
    .slice(0, Math.max(10, limit))
    .map(({ deal }) => deal);
}
