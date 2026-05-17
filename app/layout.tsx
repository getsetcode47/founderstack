import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://founderstackhub.com'),
  title: 'Founder Stack Hub | Founder Perks, Startup Deals, and Software Savings',
  description: 'Founder Stack Hub is a premium startup deals platform with curated software perks, founder-only offers, and an admin-managed CMS powered by Supabase.',
  icons: {
    icon: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
    shortcut: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
    apple: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
  },
  openGraph: {
    title: 'Founder Stack Hub',
    description: 'Premium founder deals, startup software savings, and curated partner perks.',
    type: 'website',
    url: '/',
    siteName: 'FounderStackHub',
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FounderStackHub',
    description: 'AI startup perks matched to your stack.',
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaOrg = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FounderStackHub',
      url: 'https://founderstackhub.com',
      logo: 'https://founderstackhub.com/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png',
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
      name: 'FounderStackHub',
      url: 'https://founderstackhub.com',
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
