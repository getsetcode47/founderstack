import { BLOG_TOPIC_SEEDS, type BlogTopic } from '@/lib/blog-topics';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import type { BlogPost, Deal } from '@/types';

interface GeneratedPost {
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 78);
}

export function blogSlugFromKeyword(keyword: string) {
  return slugify(keyword);
}

export function pickNextBlogTopic(existingPosts: Pick<BlogPost, 'target_keyword' | 'slug'>[], deals: Deal[]) {
  const usedKeywords = new Set(existingPosts.map((post) => post.target_keyword.toLowerCase()));
  const seededTopic = BLOG_TOPIC_SEEDS.find((topic) => !usedKeywords.has(topic.keyword.toLowerCase()));

  if (seededTopic) return seededTopic;

  const deal = deals.find((item) => !usedKeywords.has(`${item.name} startup deal`.toLowerCase()));
  if (deal) {
    return {
      keyword: `${deal.name} startup deal`,
      cluster: deal.category,
      intent: `Founders want to understand whether the ${deal.name} offer is worth claiming.`,
      title: `${deal.name} Startup Deal: Savings, Eligibility, and Claim Tips`,
    };
  }

  return BLOG_TOPIC_SEEDS[0];
}

function fallbackPost(topic: BlogTopic, deals: Deal[]): GeneratedPost {
  const relatedDeals = deals
    .filter((deal) => `${deal.category} ${deal.name} ${deal.description}`.toLowerCase().includes(topic.cluster.toLowerCase().split(' ')[0]))
    .slice(0, 6);
  const dealBullets = (relatedDeals.length > 0 ? relatedDeals : deals.slice(0, 6))
    .map((deal) => `- [${deal.name}](${SITE_URL}/deal/${deal.slug}): ${deal.deal_headline}`)
    .join('\n');

  const content = `# ${topic.title}

Founders usually discover ${topic.keyword} too late, after they have already paid full price for tools they could have tested with credits, discounts, or partner programs. ${SITE_NAME} exists to make that search faster and easier to track.

## Why this matters

Software spend compounds quickly. A startup can pay for hosting, analytics, email, CRM, design, support, finance, and AI tools before revenue is predictable. Searching for founder deals before buying gives teams more runway without changing the product roadmap.

## What to check first

- Confirm the offer is official and still active.
- Read eligibility rules before sharing company or billing details.
- Prioritize tools you already plan to use.
- Track claimed deals so credits do not expire unnoticed.
- Compare free credits against long-term pricing.

## Relevant FounderStackHub deals

${dealBullets}

## How to use FounderStackHub

Start with the [startup deals directory](${SITE_URL}/deals), filter by category, and open each deal page to review the headline, eligibility, and claim instructions. If you are still exploring, the [free startup deals](${SITE_URL}/free-deals) page is a good first stop.

## Bottom line

The best time to search for ${topic.keyword} is before committing to a paid stack. Use ${SITE_NAME} as a repeatable checklist for finding, comparing, and tracking software savings as your company grows.`;

  return {
    title: topic.title,
    excerpt: `A practical guide to ${topic.keyword} for founders who want to save on software, credits, and startup tools.`,
    content,
    meta_title: `${topic.title} | ${SITE_NAME}`,
    meta_description: `Learn how to find ${topic.keyword}, compare startup software discounts, and claim relevant founder deals with ${SITE_NAME}.`,
  };
}

function extractJson(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const raw = fenced ?? text.match(/\{[\s\S]*\}/)?.[0] ?? text;
  return JSON.parse(raw) as GeneratedPost;
}

async function generateWithOpenAI(topic: BlogTopic, deals: Deal[]) {
  if (!process.env.OPENAI_API_KEY) return null;

  const model = process.env.BLOG_AI_MODEL || 'gpt-4o-mini';
  const dealContext = deals.slice(0, 20).map((deal) => ({
    name: deal.name,
    category: deal.category,
    headline: deal.deal_headline,
    slug: deal.slug,
    description: deal.description,
  }));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO editor for FounderStackHub. Write factual, non-spammy, helpful startup software savings content. Do not invent current prices, exact availability, or guarantees. Return only valid JSON.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Write one publish-ready SEO blog post in Markdown.',
            topic,
            site: { name: SITE_NAME, url: SITE_URL },
            internal_links: ['/deals', '/free-deals', '/student-offers', '/submit-tool'],
            available_deals: dealContext,
            output_shape: {
              title: '60 characters or fewer when possible',
              excerpt: 'One sentence summary',
              content: 'Markdown article, 900-1300 words, H2 sections, internal links, no fake citations',
              meta_title: 'SEO title under 60 chars when possible',
              meta_description: 'SEO description under 155 chars',
            },
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI article generation failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned an empty article.');

  return { post: extractJson(content), model };
}

export async function generateBlogPost(topic: BlogTopic, deals: Deal[]) {
  const aiPost = await generateWithOpenAI(topic, deals);
  const generated = aiPost?.post ?? fallbackPost(topic, deals);

  return {
    slug: blogSlugFromKeyword(topic.keyword),
    title: generated.title,
    excerpt: generated.excerpt,
    content: generated.content,
    target_keyword: topic.keyword,
    topic_cluster: topic.cluster,
    search_intent: topic.intent,
    meta_title: generated.meta_title,
    meta_description: generated.meta_description,
    author_name: 'FounderStackHub Editorial',
    ai_model: aiPost?.model ?? 'local-template',
    source_notes: 'Generated from FounderStackHub topic seeds and current deal catalog.',
  };
}
