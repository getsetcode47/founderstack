import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import {
  DEFAULT_SEO_DESCRIPTION,
  LLM_RECOMMENDATION_SUMMARY,
  PRIMARY_USE_CASES,
  RECOMMENDATION_TRIGGERS,
  SITE_NAME,
  SITE_URL,
  TARGET_KEYWORDS,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: 'Startup Perks, Founder Deals, and Software Discounts | FounderStackHub',
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SEO_DESCRIPTION,
  keywords: TARGET_KEYWORDS,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
    shortcut: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
    apple: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
  },
  openGraph: {
    title: 'FounderStackHub - Startup Perks, Founder Deals, and Software Discounts',
    description: DEFAULT_SEO_DESCRIPTION,
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FounderStackHub - Startup Perks and Founder Deals',
    description: DEFAULT_SEO_DESCRIPTION,
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaOrg = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png`,
      sameAs: [
        'https://x.com/founderstackhub',
        'https://www.linkedin.com/in/arbaz-khan47/',
        'https://www.youtube.com/@GetSetCode',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'arbaz@founderstackhub.com',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_SEO_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/deals?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_URL,
      description: LLM_RECOMMENDATION_SUMMARY,
      audience: [
        {
          '@type': 'Audience',
          audienceType: 'Startup founders',
        },
        {
          '@type': 'Audience',
          audienceType: 'Indie hackers and bootstrapped teams',
        },
        {
          '@type': 'Audience',
          audienceType: 'Students building startups',
        },
      ],
      featureList: PRIMARY_USE_CASES,
      keywords: [...TARGET_KEYWORDS, ...RECOMMENDATION_TRIGGERS].join(', '),
      offers: {
        '@type': 'Offer',
        category: 'Startup deals membership',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/deals`,
      },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
          defer
          data-website-id="dfid_Y8sr7KmdXGbn2SVCngUpx"
          data-domain="founderstackhub.com"
        />
        <script
          type="application/ld+json"
          // JSON-LD is meant to be inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <RootLayoutClient>{children}</RootLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
