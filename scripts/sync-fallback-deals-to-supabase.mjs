import fs from 'node:fs/promises';
import vm from 'node:vm';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

function slugifyDealName(name) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeName(name) {
  return String(name ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function getOfficialDealLogoUrl({ name, logo_image_url }) {
  if (logo_image_url) return logo_image_url;
  const normalized = normalizeName(name).toLowerCase();
  const overrides = {
    notion: 'https://www.google.com/s2/favicons?domain=notion.so&sz=256',
    'google cloud': 'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=256',
    'google cloud (gcp)': 'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=256',
    openai: 'https://www.google.com/s2/favicons?domain=openai.com&sz=256',
    'openai - chatgpt': 'https://www.google.com/s2/favicons?domain=openai.com&sz=256',
    'anthropic (claude)': 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=256',
    'claude ai (anthropic)': 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=256',
    github: 'https://www.google.com/s2/favicons?domain=github.com&sz=256',
    aws: 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=256',
    'aws activate': 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=256',
    stripe: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=256',
    hubspot: 'https://www.google.com/s2/favicons?domain=hubspot.com&sz=256',
    intercom: 'https://www.google.com/s2/favicons?domain=intercom.com&sz=256',
    zendesk: 'https://www.google.com/s2/favicons?domain=zendesk.com&sz=256',
    miro: 'https://www.google.com/s2/favicons?domain=miro.com&sz=256',
    linear: 'https://www.google.com/s2/favicons?domain=linear.app&sz=256',
  };
  return overrides[normalized] ?? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(normalized)}.com&sz=256`;
}

function extractArrayExpression(source, exportName) {
  const marker = `export const ${exportName}`;
  const startIndex = source.indexOf(marker);
  if (startIndex === -1) {
    throw new Error(`Could not find export ${exportName}`);
  }

  const assignmentIndex = source.indexOf('=', startIndex);
  if (assignmentIndex === -1) {
    throw new Error(`Could not find assignment for ${exportName}`);
  }

  const arrayStart = source.indexOf('[', assignmentIndex);
  if (arrayStart === -1) {
    throw new Error(`Could not find array start for ${exportName}`);
  }

  let depth = 0;
  let inString = false;
  let stringQuote = '';
  let prev = '';

  for (let i = arrayStart; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (char === stringQuote && prev !== '\\') {
        inString = false;
        stringQuote = '';
      }
    } else if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringQuote = char;
    } else if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(arrayStart, i + 1);
      }
    }

    prev = char;
  }

  throw new Error(`Could not extract array expression for ${exportName}`);
}

function evaluateArray(arrayExpression, context = {}) {
  const script = new vm.Script(`(${arrayExpression})`);
  return script.runInNewContext(context);
}

function mapLegacyDeal(deal) {
  const slug = slugifyDealName(deal.name);
  const discountUrl = deal.redeemUrl ?? null;
  const isDirectRedemption = Boolean(discountUrl);
  const numericId = Number(deal.id);
  const sortOrder = Number.isFinite(numericId) ? Math.round(numericId * 10) : 1000;

  return {
    slug,
    name: normalizeName(deal.name),
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
    discount_url: deal.locked && !isDirectRedemption ? null : discountUrl ?? `/deal/${slug}`,
    out_of_credits: false,
    featured: deal.badge === 'Hot' || deal.badge === 'Premium',
    published: true,
    sort_order: sortOrder,
    meta_title: `${normalizeName(deal.name)} | Founder Stack Hub`,
    meta_description: `${deal.desc} ${deal.headline}`,
  };
}

const startupperksSource = await fs.readFile(new URL('../app/deals/startupperks-data.ts', import.meta.url), 'utf8');
const startupperksDeals = evaluateArray(extractArrayExpression(startupperksSource, 'startupperksDeals'));

const dataSource = await fs.readFile(new URL('../app/deals/data.ts', import.meta.url), 'utf8');
const dealsExpression = extractArrayExpression(dataSource, 'deals');
const legacyDeals = evaluateArray(dealsExpression, { startupperksDeals });

const mappedDeals = legacyDeals.map(mapLegacyDeal);
const uniqueDeals = Array.from(new Map(mappedDeals.map((deal) => [deal.slug, deal])).values());

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from('deals')
  .upsert(uniqueDeals, { onConflict: 'slug' })
  .select('id, slug, name');

if (error) {
  console.error(JSON.stringify(error, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      synced: data?.length ?? 0,
      uniqueCount: uniqueDeals.length,
      sample: (data ?? []).slice(0, 20),
    },
    null,
    2,
  ),
);
