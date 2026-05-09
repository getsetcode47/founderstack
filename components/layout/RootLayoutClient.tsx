'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';

const AUTH_PATHS = ['/sign-in', '/signup', '/login', '/register', '/forgot-password', '/reset-password'];

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p));

  return (
    <AuthProvider>
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && <Footer />}
      <CookieConsentBanner />
      <Toaster />
    </AuthProvider>
  );
}
