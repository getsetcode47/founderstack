import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const sourceDeals = [
  {
    software: 'Anthropic (Economic Futures)',
    approx_credits: '$5,000',
    conditions:
      'Funding and Anthropic credits for AI economic impact research. Apply via the forms linked in the program page and email, then wait for approval.',
    step_by_step_link:
      'https://forms.gle/jsyseT2mXtD578gM9; https://forms.gle/KLJ6FzBcpwUNxFVX7; mailto:economicfutures@anthropic.com',
    promo_code: '',
  },
  {
    software: 'ChatGPT (via partner)',
    approx_credits: '$300',
    conditions:
      'Up to $300 in free OpenAI API credits for AI builders via LLM API. Eligibility: new users signing up with corporate email plus top up $50-$300 in first month for matched credits.',
    step_by_step_link: 'https://llmapi.ai/ai-perks/',
    promo_code: '',
  },
  {
    software: 'Claude (via program)',
    approx_credits: '$1,000',
    conditions:
      'For early-stage founders, with higher tiers for funded startups. Apply via AWS Activate credits for Claude usage through AWS services.',
    step_by_step_link: 'https://aws.amazon.com/startups/lp/aws-activate-credits',
    promo_code: '',
  },
  {
    software: 'ElevenLabs',
    approx_credits: '$4,000',
    conditions:
      'For full-time startups with fewer than 25 employees. One grant per company, no existing enterprise customers, and no child-related projects as described in the grant.',
    step_by_step_link: 'https://elevenlabs.io/startup-grants',
    promo_code: '11AIPERKS939',
  },
  {
    software: 'Gemini (via program)',
    approx_credits: '$10,000',
    conditions:
      'For early-stage founders building with Gemini. Apply to Google for Startups Cloud Program and redeem credits.',
    step_by_step_link: 'https://cloud.google.com/startup',
    promo_code: '',
  },
  {
    software: 'Granola',
    approx_credits: '$168',
    conditions:
      'For pre-seed and seed startups with fewer than 30 employees. Apply via Granola startup program and include team size and funding stage.',
    step_by_step_link: 'https://www.granola.ai/startups',
    promo_code: '',
  },
  {
    software: 'Make',
    approx_credits: '$1,188',
    conditions:
      'Free Make Teams for up to 1 year. Apply via the Make startup program form, then redeem the coupon in subscription and billing.',
    step_by_step_link: 'https://tally.so/r/wLWVBJ?via=AIPerks',
    promo_code: '',
  },
  {
    software: 'JoinSecret',
    approx_credits: '$150',
    conditions:
      'JoinSecret membership free for 1 year, valued at $150, with access to startup perks and partner savings.',
    step_by_step_link: 'https://arbaz-khan.joinsecret.com/',
    promo_code: '',
    featured: true,
  },
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
    software: 'OpenAI (via program)',
    approx_credits: '$2,500',
    conditions:
      'Verified US company with funded account. Redeem via the partner rewards flow shown.',
    step_by_step_link: 'https://ramp.com/rewards/openai',
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
    software: 'xAI (via partner)',
    approx_credits: '$300',
    conditions:
      'Up to $300 in free xAI API credits for AI builders via LLM API. Eligibility: new users with corporate email plus deposit $50-$300 in first month for matched credits.',
    step_by_step_link: 'https://llmapi.ai/ai-perks/',
    promo_code: '',
  },
  {
    software: 'AI21 Labs',
    approx_credits: '$10,000',
    conditions:
      'For startups using Google Cloud. Apply to Google for Startups Cloud Program and redeem credits for AI21 usage.',
    step_by_step_link: 'https://cloud.google.com/startup',
    promo_code: '',
  },
  {
    software: 'Amazon Bedrock',
    approx_credits: '$50,000',
    conditions:
      'For startups using AWS. Apply to AWS Activate startup program and use credits on Bedrock services.',
    step_by_step_link: 'https://aws.amazon.com/activate',
    promo_code: '',
  },
  {
    software: 'Anam AI',
    approx_credits: '$4,300',
    conditions:
      'For existing and new customers. Use the promo code during checkout for the discount.',
    step_by_step_link: 'https://lab.anam.ai/register',
    promo_code: 'ANAM45WELCOME',
  },
  {
    software: 'Anthropic (AI for Science)',
    approx_credits: '$25,000',
    conditions:
      'Funding and Anthropic credits for scientific research. Check eligibility, then submit the Google form and wait for approval.',
    step_by_step_link:
      'https://www.anthropic.com/news/ai-for-science-program; https://docs.google.com/forms/d/e/1FAIpQLSfwDGfVg2lHJ0cc0oF_ilEnjvr_r4_paYi7VLlr5cLNXASdvA/viewform?usp=header',
    promo_code: '',
  },
  {
    software: 'AssemblyAI',
    approx_credits: '$150,000',
    conditions:
      'For early-stage startups. Apply via the startup program contact form.',
    step_by_step_link: 'https://assemblyai.com/contact/startup-program',
    promo_code: '',
  },
  {
    software: 'AWS Generative AI',
    approx_credits: '$1,000,000',
    conditions:
      '10-week accelerator program. Apply via the AWS Generative AI startup program page.',
    step_by_step_link: 'https://aws.amazon.com/startups/programs/generative-ai',
    promo_code: '',
  },
  {
    software: 'AWS Trainium',
    approx_credits: '$300,000',
    conditions:
      'For startups using AI chips. Apply to AWS Activate and use credits toward Trainium.',
    step_by_step_link: 'https://aws.amazon.com/activate',
    promo_code: '',
  },
  {
    software: 'Azure OpenAI',
    approx_credits: '$150,000',
    conditions:
      'For startups affiliated with the Microsoft for Startups Investor Network. Apply via Microsoft Founders Hub.',
    step_by_step_link: 'https://www.foundershub.startups.microsoft.com/',
    promo_code: '',
  },
  {
    software: 'Claude (Campus)',
    approx_credits: '$1,750',
    conditions:
      'For student AI community builders; cohort-based and approval required. Apply to the Claude Campus program.',
    step_by_step_link: 'https://www.claude.com/programs/campus',
    promo_code: '',
  },
  {
    software: 'Claude (VC program)',
    approx_credits: '$29,999',
    conditions:
      'Selective VC program with funding, credits, and support. Apply via the Anthology Fund program link.',
    step_by_step_link: 'https://menlovc.com/anthology-fund/',
    promo_code: '',
  },
  {
    software: 'Claude (Startups)',
    approx_credits: '$100,000',
    conditions:
      'Free API credits and priority rate limits for VC-backed startups. Apply via the Claude startups program.',
    step_by_step_link: 'https://claude.com/programs/startups',
    promo_code: '',
  },
  {
    software: 'Cohere',
    approx_credits: '$2,500',
    conditions:
      'For early-stage startups over 12 months. Apply via the Cohere startup program.',
    step_by_step_link: 'https://cohere.com/startup-program',
    promo_code: '',
  },
  {
    software: 'Deepgram',
    approx_credits: '$100,000',
    conditions:
      'Applications are reviewed individually, and credit allocation is tailored to your stage, use case, and traction. This offer includes $1,000 in Deepgram credits, scaling to $5,000 once activated, and $15,000 with continued usage. Higher allocations are sales-matched on a per-startup basis, with a path up to $100,000 tied to actual deployment and growth. You must be building a voice AI or AI-native product that is either in production or launching within the next 6 months, must have raised under $10M, and agencies or services companies are not eligible.',
    step_by_step_link: 'https://deepgram.com/startup-program',
    promo_code: '',
  },
  {
    software: 'Emergent',
    approx_credits: '$12,500',
    conditions:
      'For new customers. Apply via the Antler AI Disrupt program page.',
    step_by_step_link: 'https://www.antler.co/blog/ai-disrupt',
    promo_code: '',
  },
  {
    software: 'i10X AI',
    approx_credits: '$5,000',
    conditions:
      'Available for startups at any stage. Apply via the i10X website.',
    step_by_step_link: 'https://i10x.ai/',
    promo_code: '',
  },
  {
    software: 'Intrascope',
    approx_credits: '$150',
    conditions:
      'AI workspace with multi-LLM support and a 7 day free trial with no card. $150 off annual BYOK with GETAI150 or 2 months free monthly BYOK with GETAI2M.',
    step_by_step_link: 'https://platform.intrascope.app/',
    promo_code: 'GETAI150 (annual); GETAI2M (monthly)',
  },
  {
    software: 'LLM API',
    approx_credits: '$300',
    conditions:
      'Access 360+ models via one API. Eligibility: new users with corporate email plus top up $50-$300 in first month for matched credits.',
    step_by_step_link: 'https://llmapi.ai/ai-perks/',
    promo_code: '',
  },
  {
    software: 'MakeForms',
    approx_credits: '$900',
    conditions:
      '50% lifetime discount for all startups and growing businesses. Apply code AIPERKS at checkout.',
    step_by_step_link: 'https://makeforms.io/?via=aiperks',
    promo_code: 'AIPERKS',
  },
  {
    software: 'Manus AI',
    approx_credits: '$4,680',
    conditions:
      'Manus for Startups – 6 months Team Plan free for up to 20 seats plus 19,900 bonus credits.',
    step_by_step_link: 'https://manus.im/startups',
    promo_code: '',
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
  'AI21 Labs': 'AI Tools',
  'Amazon Bedrock': 'Cloud',
  'Anam AI': 'AI Tools',
  'Anthropic (AI for Science)': 'AI Tools',
  'Anthropic (Economic Futures)': 'AI Tools',
  AssemblyAI: 'AI Tools',
  'AWS Generative AI': 'Accelerators',
  'AWS Trainium': 'Cloud',
  'Azure OpenAI': 'Cloud',
  'ChatGPT (via partner)': 'AI Tools',
  'Claude (Campus)': 'AI Tools',
  'Claude (Startups)': 'AI Tools',
  'Claude (VC program)': 'AI Tools',
  'Claude (via program)': 'AI Tools',
  Cohere: 'AI Tools',
  Deepgram: 'AI Tools',
  ElevenLabs: 'AI Tools',
  Emergent: 'AI Tools',
  'Gemini (via program)': 'AI Tools',
  Granola: 'Productivity',
  'i10X AI': 'AI Tools',
  Intrascope: 'AI Tools',
  JoinSecret: 'SaaS',
  'LLM API': 'AI Tools',
  Make: 'Productivity',
  MakeForms: 'Productivity',
  'Manus AI': 'AI Tools',
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
  'xAI (via partner)': 'AI Tools',
};

const slugOverrides = {
  'AI21 Labs:$10,000': 'ai21-labs-google-cloud-program',
  'Amazon Bedrock:$50,000': 'amazon-bedrock-aws-activate',
  'Anthropic (AI for Science):$25,000': 'anthropic-ai-for-science',
  'Anthropic (Economic Futures):$5,000': 'anthropic-economic-futures',
  'AWS Generative AI:$1,000,000': 'aws-generative-ai-accelerator',
  'AWS Trainium:$300,000': 'aws-trainium-credits',
  'Azure OpenAI:$150,000': 'azure-openai-founders-hub',
  'ChatGPT (via partner):$300': 'chatgpt-via-llm-api',
  'Claude (Campus):$1,750': 'claude-campus-program',
  'Claude (Startups):$100,000': 'claude-startups-program',
  'Claude (VC program):$29,999': 'claude-vc-program',
  'Claude (via program):$1,000': 'claude-via-aws-program',
  'Gemini (via program):$10,000': 'gemini-google-cloud-program',
  'OpenAI (via program):$2,500': 'openai-via-ramp',
  'OpenAI:$1,000': 'openai-research-program',
  'OpenAI:$1,200': 'openai-codex-for-oss',
  'OpenAI:$100': 'openai-student-offer',
  'Runway ML:$1,000,000': 'runway-ml-filmmaker-program',
  'xAI (via partner):$300': 'xai-via-llm-api',
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
    featured: Boolean(row.featured),
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
