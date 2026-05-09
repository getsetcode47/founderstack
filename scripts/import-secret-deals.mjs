import fs from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Usage: node scripts/import-secret-deals.mjs <path-to-csv>');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const CATEGORY_OVERRIDES = {
  AssemblyAI: 'AI',
  Airwallex: 'Finance',
  'Instantly.ai': 'Marketing',
  Amplitude: 'Marketing',
  Xero: 'Finance',
  'Google Workspace': 'Productivity',
  Omnisend: 'Marketing',
  doola: 'Operations',
  'OpenAI – ChatGPT': 'AI',
  'LLM API': 'AI',
  Pitch: 'Design',
  Durable: 'Operations',
  'Kit (ex. ConvertKit)': 'Marketing',
  'Claude AI (Anthropic)': 'AI',
  OpenRouter: 'AI',
  'Granola AI': 'Productivity',
  'Google Cloud (GCP)': 'Cloud',
};

const SLUG_OVERRIDES = {
  'OpenAI – ChatGPT': 'openai-chatgpt',
  'OpenAI – ChatGPT': 'openai-chatgpt',
  'Claude AI (Anthropic)': 'claude-ai-anthropic',
  'Claude AI (Anthropic)': 'claude-ai-anthropic',
  'Google Cloud (GCP)': 'google-cloud',
  'Google Cloud (GCP)': 'google-cloud',
  'Kit (ex. ConvertKit)': 'kit-convertkit',
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

function toShortName(name) {
  return normalizeWhitespace(name)
    .replace(/\(.*?\)/g, '')
    .replace(/\s+-\s+.*/g, '')
    .trim()
    .slice(0, 40);
}

function extractHeadline(description) {
  const clean = normalizeWhitespace(description);
  const match = clean.match(/: (.+)$/);
  return (match?.[1] ?? clean).replace(/\.$/, '');
}

function splitEligibility(howToAvail) {
  const clean = normalizeWhitespace(howToAvail);
  const marker = clean.match(/eligibility:\s*/i);
  if (!marker || marker.index == null) {
    return {
      dealDetails: clean,
      eligibility: 'See partner terms for current eligibility requirements and redemption details.',
    };
  }

  const start = marker.index;
  const labelLength = marker[0].length;
  const dealDetails = clean.slice(0, start).trim().replace(/[.:;-]+$/, '');
  const eligibility = clean.slice(start + labelLength).trim();

  return {
    dealDetails: dealDetails || clean,
    eligibility: eligibility || 'See partner terms for current eligibility requirements and redemption details.',
  };
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function buildDeal(row, index) {
  const name = normalizeWhitespace(row['Deal Name']);
  const description = normalizeWhitespace(row.Description);
  const logoUrl = normalizeWhitespace(row['Logo URL']) || null;
  const howToAvail = normalizeWhitespace(row['How to Avail (Steps & Eligibility)']);
  const headline = extractHeadline(description);
  const { dealDetails, eligibility } = splitEligibility(howToAvail);
  const slug = SLUG_OVERRIDES[name] ?? slugify(name);
  const category = CATEGORY_OVERRIDES[name] ?? 'Productivity';

  return {
    slug,
    name,
    short_name: toShortName(name),
    logo_type: logoUrl ? 'image' : 'initial',
    logo_image_url: logoUrl,
    logo_text: null,
    brand_color: '#ffffff',
    description: headline,
    full_description: `${headline}. ${howToAvail}`,
    category,
    deal_headline: headline,
    deal_details: dealDetails,
    eligibility,
    discount_method: 'locked',
    discount_code: null,
    discount_url: null,
    out_of_credits: false,
    featured: false,
    published: true,
    sort_order: 500 + index,
    meta_title: `${name} startup deal | Founder Stack Hub`,
    meta_description: headline,
  };
}

const csvText = await fs.readFile(csvPath, 'utf8');
const rows = parseCsv(csvText);
const deals = rows.map(buildDeal);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase
  .from('deals')
  .upsert(deals, { onConflict: 'slug' })
  .select('id, slug, name');

if (error) {
  console.error(JSON.stringify(error, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ imported: data?.length ?? 0, deals: data ?? [] }, null, 2));
