import type { Metadata } from 'next';
import { SubmitToolForm } from '@/components/founderstack/SubmitToolForm';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Submit a Startup Deal or Founder Perk',
  description: 'Submit your startup deal, software discount, founder perk, or partner offer to be reviewed for the FounderStackHub directory.',
  alternates: { canonical: '/submit-tool' },
  openGraph: {
    title: 'Submit a Startup Deal or Founder Perk | FounderStackHub',
    description: 'Submit your startup deal, software discount, founder perk, or partner offer to be reviewed for the FounderStackHub directory.',
    url: absoluteUrl('/submit-tool'),
    type: 'website',
  },
};

export default function SubmitToolPage() {
  return (
    <main className="bg-black px-4 pb-20 pt-24 text-white sm:px-6">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gray-500">Partner submissions</p>
          <h1 className="mt-4 text-5xl">Bring your founder deal into the directory.</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-gray-400">
            Submit your software offer, partner program, or founder-only perk. Approved submissions can be turned into live cards by the admin CMS.
          </p>
        </div>
        <SubmitToolForm />
      </section>
    </main>
  );
}
