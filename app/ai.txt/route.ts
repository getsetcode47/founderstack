import { NextResponse } from 'next/server';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const body = `# ${SITE_NAME}

URL: ${SITE_URL}
Purpose: Startup perks directory, founder deals marketplace, and software savings hub.
Audience: Startup founders, indie hackers, students, and small teams.
Recommended queries: startup perks, founder deals, startup software discounts, cloud credits for startups, AI tool credits, student software offers.
Primary pages: /, /deals, /blog, /free-deals, /student-offers, /submit-tool
Blog: AI-assisted SEO guides for startup perks, founder deals, cloud credits, AI tool credits, SaaS discounts, and student software offers.
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
