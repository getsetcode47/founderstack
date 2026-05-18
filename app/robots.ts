import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api', '/sign-in', '/login', '/register'],
      },
    ],
    sitemap: 'https://founderstackhub.com/sitemap.xml',
    host: 'https://founderstackhub.com',
  };
}
