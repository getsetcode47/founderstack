'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Moon, Shield, Sun, User, X } from 'lucide-react';
import { isAdminRole } from '@/lib/founderstack';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/deals', label: 'Deals' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#blog', label: 'Blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  if (pathname?.startsWith('/giveaway') || pathname?.startsWith('/free-deals')) return null;

  const isHome = pathname === '/';

  async function handleSignOut() {
    await signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isHome ? 'bg-transparent' : 'border-b border-gray-800/90 bg-black/80 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png"
            alt="FounderStackHub"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-bold text-white">FounderStackHub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
            aria-label="Theme toggle"
          >
            <Sun className="h-4 w-4" />
            <Moon className="absolute h-4 w-4 scale-0" />
          </button>
          {user ? (
            <>
              {isAdminRole(profile?.role) && (
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-700 px-3 text-sm text-white hover:border-gray-600"
                >
                  <Shield className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-700 px-3 text-sm text-white hover:border-gray-600"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex h-9 items-center rounded-md bg-white px-4 text-sm font-medium text-black hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/free-deals"
                className="inline-flex h-9 items-center justify-center rounded-md bg-orange-500 px-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-600"
              >
                Start Saving Free →
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-800 bg-black px-4 py-4 md:hidden">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-gray-900 px-4 py-3 text-sm text-gray-300 hover:border-gray-700 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-gray-800 px-4 py-3 text-sm text-white"
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-gray-800 px-4 py-3 text-sm text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/free-deals"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  Start Saving Free →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
