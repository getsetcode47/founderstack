import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Founder Stack Hub',
  description: 'How Founder Stack Hub collects, uses, and protects user information.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[28px] border border-gray-800 bg-black p-6 sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Legal</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
          <p>
            Founder Stack Hub collects the minimum account, payment, and usage data needed to run memberships,
            unlock deals, respond to support requests, and improve the product.
          </p>
          <p>
            We may store your email address, account profile details, claimed deals, bookmarked offers, and
            billing-related metadata. Payment details are handled by our payment processors and are not stored
            directly in this application.
          </p>
          <p>
            We use this information to provide access to founder deals, maintain account security, personalize the
            dashboard experience, and communicate product or membership updates.
          </p>
          <p>
            We do not sell your personal data. We may share limited information with infrastructure, analytics,
            support, authentication, and billing providers only when needed to operate the service.
          </p>
          <p>
            If you want your account data deleted or need a privacy-related request handled, email
            {' '}
            <a href="mailto:support@founderstackhub.com" className="text-white underline underline-offset-4">
              support@founderstackhub.com
            </a>
            .
          </p>
          <p className="text-gray-500">Last updated: April 21, 2026.</p>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm text-gray-400 hover:text-white">
          Back to home
        </Link>
      </section>
    </main>
  );
}
