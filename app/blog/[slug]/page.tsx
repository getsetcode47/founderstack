import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MarkdownArticle } from '@/components/blog/MarkdownArticle';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/site-data';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Blog post not found | FounderStackHub' };

  return {
    title: post.meta_title,
    description: post.meta_description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      authors: [post.author_name],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, posts] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getPublishedBlogPosts(),
  ]);

  if (!post) notFound();

  const related = posts
    .filter((item) => item.id !== post.id && item.topic_cluster === post.topic_cluster)
    .slice(0, 3);

  return (
    <main className="bg-[#07111f] px-4 pb-20 pt-24 text-white sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: {
              '@type': 'Organization',
              name: post.author_name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'FounderStackHub',
              url: absoluteUrl('/'),
            },
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
            keywords: post.target_keyword,
          }),
        }}
      />
      <section className="mx-auto max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-cyan-100 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        <div className="mt-8 rounded-[32px] border border-white/10 bg-black/35 p-6 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">{post.target_keyword}</p>
          <h1 className="mt-4 text-5xl leading-none sm:text-6xl">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-300">{post.excerpt}</p>
          <p className="mt-6 text-sm text-slate-500">
            {post.published_at ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(post.published_at)) : 'FounderStackHub Editorial'}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-4xl rounded-[32px] border border-white/10 bg-black/35 p-6 sm:p-10">
        <MarkdownArticle content={post.content} />
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-10 max-w-4xl">
          <h2 className="text-2xl">Related guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/blog/${item.slug}`} className="rounded-[20px] border border-white/10 bg-black/35 p-5 text-sm leading-6 text-slate-300 hover:border-cyan-300/50">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
