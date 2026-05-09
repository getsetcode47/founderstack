import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Founder Stack Hub',
  description: 'Terms governing the use of Founder Stack Hub memberships, deals, and platform features.',
};

export default function TermsPage() {
  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[28px] border border-gray-800 bg-black p-6 sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Legal</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
          <p>
            By using Founder Stack Hub, you agree to use the platform lawfully and in accordance with these terms.
            Membership access, claim flows, and dashboard features are provided for legitimate founder, builder,
            student, and partner use only.
          </p>
          <p>
            Deal availability, pricing, eligibility rules, and redemption requirements are controlled by the partner
            providing each offer and may change without notice. Founder Stack Hub does not guarantee that every
            partner offer will remain active, available in every region, or approved for every applicant.
          </p>
          <p>
            You are responsible for maintaining the security of your account and for any activity that occurs under it.
            We may suspend or terminate access in cases of abuse, fraud, scraping, resale of restricted offers, or
            violation of partner terms.
          </p>
          <p>
            The platform is provided on an as-available basis. To the maximum extent allowed by law, Founder Stack Hub
            disclaims warranties regarding uninterrupted availability, fitness for a particular purpose, and results
            obtained from third-party deal programs.
          </p>
          <p>
            Questions about these terms can be sent to
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
