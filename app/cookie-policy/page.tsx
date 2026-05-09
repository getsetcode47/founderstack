import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Founder Stack Hub',
  description: 'Cookie usage, purposes, and retention for Founder Stack Hub.',
};

const cookies = [
  {
    name: 'fsh_session',
    purpose: 'Keeps signed-in users authenticated and protects access to premium deals.',
    type: 'Essential',
    retention: '30 days',
  },
  {
    name: 'fsh_free_deals_pending',
    purpose: 'Stores the temporary email-verification state while a user is confirming a free-deals code.',
    type: 'Essential',
    retention: '15 minutes',
  },
  {
    name: 'fsh_free_deals_verified',
    purpose: 'Remembers that a user has successfully verified their email to unlock free deals.',
    type: 'Essential',
    retention: '30 days',
  },
  {
    name: 'fsh_cookie_consent',
    purpose: 'Stores the user’s cookie-consent choice so the banner does not reappear every visit.',
    type: 'Preference',
    retention: '180 days',
  },
  {
    name: 'fsh_user_prefs',
    purpose: 'Stores lightweight preference settings tied to the user’s cookie choice and experience defaults.',
    type: 'Preference',
    retention: '180 days',
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto max-w-5xl rounded-[28px] border border-gray-800 bg-black p-6 sm:p-10">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Legal</p>
        <h1 className="mt-4 text-4xl sm:text-5xl">Cookie Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
          <p>
            Founder Stack Hub uses cookies to keep your account secure, maintain access to premium content,
            verify free-deals signups, and remember your cookie preferences.
          </p>
          <p>
            We do not use cookies to sell personal data. Essential cookies are required for secure login,
            paid access control, and limited verification flows. Preference cookies are used to remember
            settings you have already chosen.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] border border-gray-800">
          <div className="grid grid-cols-12 border-b border-gray-800 bg-white/[0.03] px-5 py-4 text-xs uppercase tracking-[0.18em] text-gray-500">
            <div className="col-span-3">Cookie</div>
            <div className="col-span-5">Purpose</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Retention</div>
          </div>

          {cookies.map((cookie) => (
            <div key={cookie.name} className="grid grid-cols-12 border-b border-gray-800 px-5 py-4 text-sm text-gray-300 last:border-b-0">
              <div className="col-span-3 font-medium text-white">{cookie.name}</div>
              <div className="col-span-5 pr-4">{cookie.purpose}</div>
              <div className="col-span-2">{cookie.type}</div>
              <div className="col-span-2">{cookie.retention}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-6 text-sm leading-7 text-gray-300">
          <p>
            You can change or clear non-essential cookies through your browser settings. If you disable
            essential cookies, some features like sign-in, billing access, and free-deals verification may stop working.
          </p>
          <p>
            For privacy or cookie-related requests, email{' '}
            <a href="mailto:support@founderstackhub.com" className="text-white underline underline-offset-4">
              support@founderstackhub.com
            </a>.
          </p>
          <p className="text-gray-500">Last updated: April 24, 2026.</p>
        </div>

        <Link href="/" className="mt-8 inline-flex text-sm text-gray-400 hover:text-white">
          Back to home
        </Link>
      </section>
    </main>
  );
}
