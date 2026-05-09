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
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <RootLayoutClient>{children}</RootLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
