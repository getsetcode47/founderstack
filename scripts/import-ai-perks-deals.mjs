import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const sourceDeals = [
  {
    software: 'MeetGeek',
    approx_credits: '$350',
    conditions:
      'MeetGeek AI Meeting Assistant – 50% off subscription (up to $350 value) for AI-powered meeting recording and transcription.',
    step_by_step_link: 'https://meetgeek.ai/pricing',
    promo_code: 'ANTLER50MG',
  },
  {
    software: 'Miro',
    approx_credits: '$1,000',
    conditions:
      'Miro Startup Program: claim $1,000 credit. Eligibility: incorporated business; startups must have a free Miro account; no service providers.',
    step_by_step_link: 'https://miro.com/startups/partner/apply/?vcode=1062-897-AI%20perks',
    promo_code: '',
  },
  {
    software: 'Mistral AI',
    approx_credits: '$10,000',
    conditions:
      'Up to $10,000 credits for Mistral models; accessed via Google for Startups Cloud Program (Scale Tier) and Vertex AI Model Garden.',
    step_by_step_link: 'https://cloud.google.com/startup',
    promo_code: '',
  },
  {
    software: 'Modal',
    approx_credits: '$50,000',
    conditions:
      'Up to $50,000 in compute credits for serverless GPU/CPU workloads; requires creating a shared workspace and applying to the startup program.',
    step_by_step_link: 'https://modal.com/startups',
    promo_code: '',
  },
  {
    software: 'NVIDIA',
    approx_credits: '$15,000',
    conditions:
      'NVIDIA Inception – 30% off DGX Cloud and 75% off NVIDIA AI Enterprise plus VC exposure and co-marketing.',
    step_by_step_link: 'https://nvidia.com/en-us/startups',
    promo_code: '',
  },
  {
    software: 'OpenAI',
    approx_credits: '$1,000',
    conditions:
      'OpenAI program for researchers studying responsible AI and societal impact (as described in the perk).',
    step_by_step_link: 'https://openai.com',
    promo_code: '(see perk modal)',
  },
  {
    software: 'OpenAI',
    approx_credits: '$1,200',
    conditions:
      'Codex for Open Source – API credits plus 6 months ChatGPT Pro with Codex; eligibility requires a valid ChatGPT account and a public repo; approval not guaranteed.',
    step_by_step_link: 'https://openai.com/form/codex-for-oss/',
    promo_code: '',
  },
  {
    software: 'OpenAI',
    approx_credits: '$100',
    conditions:
      'OpenAI offer for verified university students in the US and Canada (as described in the perk).',
    step_by_step_link: 'https://openai.com',
    promo_code: '(see perk modal)',
  },
  {
    software: 'Perplexity',
    approx_credits: '$5,000',
    conditions:
      'Perplexity for Startups – API credits plus 6 months Enterprise Pro for up to 50 seats; eligibility based on company age and funding details.',
    step_by_step_link: 'https://perplexity.ai/startups',
    promo_code: '',
  },
  {
    software: 'Pinecone',
    approx_credits: '$300',
    conditions:
      'Pinecone Standard Trial – 21 days with full features plus Pro support and dedicated Slack; vector DB for semantic search and RAG.',
    step_by_step_link: 'https://pinecone.io/startup-program',
    promo_code: '',
  },
  {
    software: 'Qdrant',
    approx_credits: '$2,000',
    conditions:
      'Qdrant for Startups – 20% cloud discount for 12 months plus guidance and co-marketing opportunities.',
    step_by_step_link: 'https://qdrant.tech/startups',
    promo_code: '',
  },
  {
    software: 'Replicate',
    approx_credits: '$500',
    conditions: 'For new accounts, no card required.',
    step_by_step_link: 'https://replicate.com',
    promo_code: '',
  },
  {
    software: 'Replit',
    approx_credits: '$25,000',
    conditions: '$25,000 in free credits or free Replit Pro (as described in the perk).',
    step_by_step_link: 'https://replit.com/startups',
    promo_code: '',
  },
  {
    software: 'Runway ML',
    approx_credits: '$1,000,000',
    conditions: 'For filmmakers using AI tools (as described in the perk).',
    step_by_step_link: 'https://runwayml.com',
    promo_code: '',
  },
  {
    software: 'Snippets AI',
    approx_credits: '$200',
    conditions: 'AI Perks paid subscribers only (as described in the perk).',
    step_by_step_link: 'https://snippets.ai',
    promo_code: '(see perk modal)',
  },
  {
    software: 'Typeface',
    approx_credits: '$1,000',
    conditions: 'Typeface for Startups – 3 months free (as described in the perk).',
    step_by_step_link: 'https://typeface.com',
    promo_code: '',
  },
  {
    software: 'Vertex AI',
    approx_credits: '$100,000',
    conditions:
      'Vertex AI – $100k credits for AI startups building with Gemini via the Google for Startups Cloud Program.',
    step_by_step_link: 'https://cloud.google.com/startup',
    promo_code: '',
  },
  {
    software: 'VisibilityPro',
    approx_credits: '$400',
    conditions:
      'AI native agency optimizing for AI answers across models; includes AI Visibility audit plus strategy deliverables.',
    step_by_step_link: 'https://agency.visibilitypro.ai/?utm_source=getaipersk&utm_medium=paid&utm_campaign=content1',
    promo_code: 'GETAIPERKS2026',
  },
  {
    software: 'Weaviate',
    approx_credits: '$100,000',
    conditions:
      'Weaviate Cloud hosted vector DB; up to $100,000 GCP credits applicable via Google for Startups.',
    step_by_step_link: 'https://cloud.google.com/startup',
    promo_code: '',
  },
  {
    software: 'Weights & Biases',
    approx_credits: '$2,000',
    conditions: 'W&B for Startups – 50% discount on Teams plan for 12 months (up to 10 seats).',
    step_by_step_link: 'https://www.microsoft.com/en-us/startups',
    promo_code: '',
  },
];

const categoryOverrides = {
  MeetGeek: 'Productivity',
  Miro: 'Design',
  'Mistral AI': 'AI Tools',
  Modal: 'Cloud',
  NVIDIA: 'AI Tools',
  OpenAI: 'AI Tools',
  Perplexity: 'AI Tools',
  Pinecone: 'Dev Tools',
  Qdrant: 'Dev Tools',
  Replicate: 'AI Tools',
  Replit: 'Dev Tools',
  'Runway ML': 'Design',
  'Snippets AI': 'AI Tools',
  Typeface: 'Marketing',
  'Vertex AI': 'Cloud',
  VisibilityPro: 'Marketing',
  Weaviate: 'Dev Tools',
  'Weights & Biases': 'AI Tools',
};

const slugOverrides = {
  'OpenAI:$1,000': 'openai-research-program',
  'OpenAI:$1,200': 'openai-codex-for-oss',
  'OpenAI:$100': 'openai-student-offer',
  'Runway ML:$1,000,000': 'runway-ml-filmmaker-program',
};

function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferLogoUrl(url, software) {
  if (!url) return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(slugify(software))}.com&sz=256`;

  try {
    const parsed = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=256`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(slugify(software))}.com&sz=256`;
  }
}

function chooseDiscountMethod(promoCode, stepByStepLink) {
  const normalizedPromo = normalizeWhitespace(promoCode).toLowerCase();

  if (normalizedPromo && !normalizedPromo.includes('see perk modal')) {
    return 'code';
  }

  if (stepByStepLink && !normalizedPromo.includes('see perk modal')) {
    return 'link';
  }

  return 'locked';
}

function buildDeal(row, index) {
  const software = normalizeWhitespace(row.software);
  const approxCredits = normalizeWhitespace(row.approx_credits);
  const conditions = normalizeWhitespace(row.conditions);
  const stepByStepLink = normalizeWhitespace(row.step_by_step_link);
  const promoCode = normalizeWhitespace(row.promo_code);
  const slug = slugOverrides[`${software}:${approxCredits}`] ?? slugify(`${software} ${approxCredits}`);
  const discountMethod = chooseDiscountMethod(promoCode, stepByStepLink);
  const headline =
    approxCredits && approxCredits !== '$1'
      ? `${approxCredits} in perks, credits, or savings`
      : 'Exclusive startup perk available';

  return {
    slug,
    name: software,
    short_name: software,
    logo_type: 'image',
    logo_image_url: inferLogoUrl(stepByStepLink, software),
    logo_text: null,
    brand_color: '#ffffff',
    description: conditions,
    full_description: `${headline}. ${conditions}`,
    category: categoryOverrides[software] ?? 'AI Tools',
    deal_headline: headline,
    deal_details: conditions,
    eligibility: conditions.includes('Eligibility:')
      ? conditions.split(/Eligibility:/i)[1].trim()
      : 'See partner terms for current eligibility and redemption details.',
    discount_method: discountMethod,
    discount_code: discountMethod === 'code' ? promoCode : null,
    discount_url: discountMethod === 'link' ? stepByStepLink : null,
    out_of_credits: false,
    featured: false,
    published: true,
    sort_order: 12000 + index,
    meta_title: `${software} startup deal | Founder Stack Hub`,
    meta_description: `${headline}. ${conditions}`.slice(0, 160),
  };
}

const deals = sourceDeals.map(buildDeal);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from('deals')
  .upsert(deals, { onConflict: 'slug' })
  .select('id, slug, name, discount_method');

if (error) {
  console.error(JSON.stringify(error, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      imported: data?.length ?? 0,
      slugs: (data ?? []).map((deal) => deal.slug),
    },
    null,
    2,
  ),
);
