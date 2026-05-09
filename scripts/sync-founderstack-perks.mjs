import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const dataFile = path.join(root, 'app/deals/data.ts');

function loadLegacyDeals() {
  const source = fs.readFileSync(dataFile, 'utf8');
  const sanitized = source
    .replace(/export type[\s\S]*?;\n\n/g, '')
    .replace(/export const categories:[\s\S]*?=\s*\[/, 'const categories = [')
    .replace(/export const deals:\s*Deal\[\]\s*=\s*\[/, 'const deals = [')
    .concat('\nmodule.exports = { categories, deals };');

  const context = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(sanitized, context);
  return context.module.exports;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function iconForCategory(name) {
  const icons = {
    Cloud: 'Cloud',
    'AI Tools': 'Sparkles',
    SaaS: 'Layers3',
    Design: 'Palette',
    Marketing: 'Megaphone',
    'Dev Tools': 'Code2',
    Finance: 'Landmark',
    'Customer Success': 'Handshake',
    Accelerators: 'Rocket',
    Security: 'Shield',
    Learning: 'GraduationCap',
  };
  return icons[name] || 'Layers';
}

function colorForCategory(name) {
  const colors = {
    Cloud: 'orange',
    'AI Tools': 'violet',
    SaaS: 'blue',
    Design: 'pink',
    Marketing: 'emerald',
    'Dev Tools': 'slate',
    Finance: 'cyan',
    'Customer Success': 'amber',
    Accelerators: 'rose',
    Security: 'zinc',
    Learning: 'indigo',
  };
  return colors[name] || 'blue';
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const { categories, deals } = loadLegacyDeals();
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const categoryRows = categories
    .filter((category) => category.name !== 'All')
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      icon: iconForCategory(category.name),
      color: colorForCategory(category.name),
      description: `${category.name} perks and startup deals`,
    }));

  const { error: categoryUpsertError } = await supabase
    .from('categories')
    .upsert(categoryRows, { onConflict: 'slug' });

  if (categoryUpsertError) throw categoryUpsertError;

  const { data: categoryData, error: categoryFetchError } = await supabase
    .from('categories')
    .select('id,name,slug');

  if (categoryFetchError) throw categoryFetchError;

  const categoryIdByName = new Map(categoryData.map((row) => [row.name, row.id]));

  const { data: existingPerks, error: existingPerksError } = await supabase
    .from('perks')
    .select('id,tool_name');

  if (existingPerksError) throw existingPerksError;

  const perkIdByName = new Map(existingPerks.map((row) => [row.tool_name.toLowerCase(), row.id]));

  let inserted = 0;
  let updated = 0;

  for (const deal of deals) {
    const payload = {
      tool_name: deal.name,
      description: [deal.desc, deal.conditions].filter(Boolean).join('. '),
      short_description: deal.headline,
      category_id: categoryIdByName.get(deal.category) ?? null,
      value_amount: deal.value,
      offer_type: deal.locked ? 'credit' : deal.badge === 'Free' ? 'free_trial' : 'discount',
      logo_url: deal.logoUrl ?? null,
      redemption_link: `https://founderstackhub.com/deal/${slugify(deal.name)}`,
      is_featured: deal.badge === 'Hot' || deal.badge === 'Premium',
      is_active: true,
    };

    const existingId = perkIdByName.get(deal.name.toLowerCase());

    if (existingId) {
      const { error } = await supabase.from('perks').update(payload).eq('id', existingId);
      if (error) throw error;
      updated += 1;
    } else {
      const { error } = await supabase.from('perks').insert(payload);
      if (error) throw error;
      inserted += 1;
    }
  }

  console.log(JSON.stringify({ categoriesUpserted: categoryRows.length, inserted, updated, totalSourceDeals: deals.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
