import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | Founder Stack Hub',
  description: 'Refund policy for Founder Stack Hub memberships and paid access.',
};

export default function RefundPolicyPage() {
  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[28px] border border-gray-800 bg-black p-6 sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Legal</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Refund Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
          <p>
            Founder Stack Hub offers a 30-day money-back guarantee on eligible paid memberships unless otherwise
            stated at checkout or in a specific promotional offer.
          </p>
          <p>
            To request a refund, contact
            {' '}
            <a href="mailto:support@founderstackhub.com" className="text-white underline underline-offset-4">
              support@founderstackhub.com
            </a>
            {' '}
            from the email address associated with your account and include your purchase details.
          </p>
          <p>
            Refund requests may be denied in cases of abuse, repeated refund claims, chargeback fraud, or if access
            was suspended for policy violations.
          </p>
          <p>
            Approved refunds are returned to the original payment method. Processing times depend on your payment
            provider and bank.
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
