import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { DealTradingCard } from '@/components/founderstack/DealTradingCard';
import { StudentOfferInfoCard } from '@/components/student-offers/StudentOfferInfoCard';
import {
  getRelatedStudentOffers,
  getStudentOfferBySlug,
  getStudentOfferHref,
  studentOfferToDeal,
} from '@/lib/student-offers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offer = getStudentOfferBySlug(params.slug);
  if (!offer) {
    return { title: 'Student offer not found | Founder Stack Hub' };
  }

  return {
    title: `${offer.name} | Student Offers | Founder Stack Hub`,
    description: offer.description,
  };
}

export default function StudentOfferDetailPage({ params }: { params: { slug: string } }) {
  const offer = getStudentOfferBySlug(params.slug);
  if (!offer) notFound();

  const deal = studentOfferToDeal(offer, 0);
  const relatedOffers = getRelatedStudentOffers(offer);

  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4">
            <DealTradingCard deal={deal} href={getStudentOfferHref(offer.slug)} />
            <StudentOfferInfoCard offer={offer} />
          </div>

          <div className="rounded-[32px] border border-gray-800 bg-black p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-gray-500">{offer.category}</p>
            <h1 className="mt-4 text-5xl">{offer.name}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-300">{offer.description}</p>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <DetailCard title="Offer value" body={offer.savings} />
              <DetailCard title="Eligibility" body={offer.eligibility.join(' • ')} />
              <DetailCard title="Verification" body={`${offer.verification} • ${offer.timing}`} />
            </div>

            <div className="mt-8 rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-gray-500">How to redeem</p>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                {offer.instructions.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-700 text-xs text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={offer.redeemUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-gray-200"
              >
                Open official redeem page
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10">
              <Link href="/student-offers" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
                Back to all student offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedOffers.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Related student offers</p>
              <h2 className="mt-3 text-3xl">More in {offer.category}</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {relatedOffers.map((item, index) => (
              <div key={item.slug} className="space-y-4">
                <DealTradingCard
                  deal={studentOfferToDeal(item, index)}
                  href={getStudentOfferHref(item.slug)}
                />
                <StudentOfferInfoCard offer={item} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function DetailCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-gray-800 bg-white/[0.02] p-5">
      <p className="text-sm uppercase tracking-[0.22em] text-gray-500">{title}</p>
      <p className="mt-3 text-sm leading-7 text-gray-300">{body}</p>
    </div>
  );
}
