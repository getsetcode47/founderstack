export const config = {
  schedule: '0 4 * * 1,4',
};

export default async function handler() {
  const siteUrl = process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://founderstackhub.com';
  const secret = process.env.BLOG_AUTOPILOT_SECRET || process.env.CRON_SECRET;

  if (!secret) {
    return new Response('BLOG_AUTOPILOT_SECRET or CRON_SECRET is required.', { status: 500 });
  }

  const response = await fetch(`${siteUrl}/api/admin/blog/autopilot`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publish: true }),
  });

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
  });
}
