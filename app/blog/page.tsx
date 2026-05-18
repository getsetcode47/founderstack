import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublishedBlogPosts } from '@/lib/site-data';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Startup Perks Blog',
  description: 'SEO guides about startup perks, founder deals, cloud credits, AI tool credits, SaaS discounts, and student software offers.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Startup Perks Blog | FounderStackHub',
    description: 'Guides about startup perks, founder deals, cloud credits, AI tool credits, SaaS discounts, and student software offers.',
    url: absoluteUrl('/blog'),
    type: 'website',
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="bg-[#07111f] px-4 pb-20 pt-24 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'FounderStackHub Startup Perks Blog',
            url: absoluteUrl('/blog'),
            blogPost: posts.slice(0, 25).map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
              datePublished: post.published_at,
            })),
          }),
        }}
      />
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">FounderStackHub blog</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-none sm:text-6xl">SEO guides for startup perks, founder deals, and software savings.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
          Learn how to find cloud credits, SaaS discounts, AI tool offers, student software deals, and startup programs before your team pays full price.
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 && (
          <div className="rounded-[28px] border border-white/10 bg-black/35 p-6">
            <h2 className="text-2xl">The blog autopilot is ready.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Run the blog autopilot endpoint to publish the first keyword-focused article.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-[28px] border border-white/10 bg-black/35 p-6 transition hover:border-cyan-300/50">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">{post.topic_cluster}</p>
            <h2 className="mt-4 text-2xl leading-tight text-white">{post.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{post.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100">
              Read guide
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
