'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, ShieldCheck } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/giveaway') || pathname?.startsWith('/free-deals') || pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="border-t border-white/5 bg-[#0A0F1E] px-4 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-white">
              <Image
                src="/ChatGPT_Image_Jul_5,_2025,_02_46_01_PM.png"
                alt="Founder Stack Hub"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="text-lg font-bold">Founder Stack Hub</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Your AI startup savings copilot, matching founders with relevant perks, credits, and software savings.
            </p>
            <div className="mb-4 mt-5 flex items-center gap-3">
              <Link
                href="mailto:support@founderstackhub.com"
                aria-label="Email support"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                Contact
              </Link>
              <Link
                href="/submit-tool"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/5 hover:text-white"
              >
                Partner with Us
              </Link>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              Secure checkout · 30-day refund
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Deals</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/deals" className="block hover:text-white">Browse All</Link>
              <Link href="/free-deals" className="block hover:text-white">Free Savings Audit</Link>
              <Link href="/deals?category=AI+Tools" className="block hover:text-white">AI Tools</Link>
              <Link href="/deals?category=Cloud+Credits" className="block hover:text-white">Cloud</Link>
              <Link href="/deals?category=Marketing" className="block hover:text-white">Marketing</Link>
              <Link href="/deals?category=Dev+Tools" className="block hover:text-white">Dev Tools</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/#how-it-works" className="block hover:text-white">About</Link>
              <Link href="/#audit" className="block hover:text-white">Savings Audit</Link>
              <Link href="mailto:support@founderstackhub.com" className="block hover:text-white">Contact</Link>
              <Link href="/submit-tool" className="block hover:text-white">Partner with Us</Link>
              <Link href="/deals" className="block hover:text-white">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <div className="space-y-2.5 text-sm">
              <Link href="/privacy" className="block hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="block hover:text-white">Terms of Service</Link>
              <Link href="/refund-policy" className="block hover:text-white">Refund Policy</Link>
              <Link href="/cookie-policy" className="block hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate-600 sm:flex-row">
          <p>&copy; 2026 Founder Stack Hub. All rights reserved.</p>
          <p>Powered by AI · Updated daily · $10M+ in perks found</p>
        </div>
      </div>
    </footer>
  );
}
