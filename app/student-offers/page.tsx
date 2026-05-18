import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import {
  getStudentOfferHref,
  studentOffers,
  studentOfferStats,
  studentOfferToDeal,
} from '@/lib/student-offers';
import { DealTradingCard } from '@/components/founderstack/DealTradingCard';
import { StudentOfferInfoCard } from '@/components/student-offers/StudentOfferInfoCard';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Student Software Offers and Startup Perks',
  description: 'Find student software offers, startup perks, official redemption links, and step-by-step instructions for popular founder tools.',
  alternates: { canonical: '/student-offers' },
  openGraph: {
    title: 'Student Software Offers and Startup Perks | FounderStackHub',
    description: 'Find student software offers, startup perks, official redemption links, and step-by-step instructions for popular founder tools.',
    url: absoluteUrl('/student-offers'),
    type: 'website',
  },
};

export default function StudentOffersPage() {
  const deals = studentOffers.map(studentOfferToDeal);

  return (
    <main className="bg-black px-4 pb-16 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[20px] border border-gray-800 bg-black p-6 sm:rounded-[32px] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Student offers</p>
              <h1 className="mt-4 text-5xl leading-none sm:text-6xl">Student software offers and startup perks worth claiming before you graduate.</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-400">
                Explore student software discounts, free credits, and founder-friendly tools with instruction pages and official redemption destinations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="rounded-full border border-gray-800 px-4 py-2">
                  {studentOfferStats.totalOffers} verified offers
                </span>
                <span className="rounded-full border border-gray-800 px-4 py-2">
                  {studentOfferStats.categories} categories
                </span>
                <span className="rounded-full border border-gray-800 px-4 py-2">
                  {studentOfferStats.maxSavingsHighlight} highest listed value
                </span>
              </div>
            </div>

            <div className="rounded-[28px] border border-gray-800 bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gray-500">
                <GraduationCap className="h-4 w-4" />
                What changed
              </div>
              <div className="mt-4 space-y-4 text-sm leading-7 text-gray-400">
                <p>Every student card now uses the exported instructions from your files.</p>
                <p>Each offer links to the official vendor page or official help guide for redemption.</p>
                <p>All FoundersPrime outbound links have been removed from the student-offers experience.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-300">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                Official redemption flow only
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {studentOffers.map((offer, index) => (
            <div key={offer.slug} className="space-y-4">
              <DealTradingCard
                deal={deals[index]}
                href={getStudentOfferHref(offer.slug)}
                priority={index < 3}
              />
              <StudentOfferInfoCard offer={offer} index={index} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl rounded-[28px] border border-gray-800 bg-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gray-500">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Keep exploring
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
              Once you&apos;ve claimed the student stack, jump back into the main founder catalog for cloud credits, startup discounts, and partner perks.
            </p>
          </div>
          <Link
            href="/deals"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-gray-700 px-4 text-sm text-white transition hover:border-gray-500"
          >
            Back to founder deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
