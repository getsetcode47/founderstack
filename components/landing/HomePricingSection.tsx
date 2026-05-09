'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const MONTHLY_FEATURES = [
  '500+ verified deals',
  'Free credits and startup perks unlocked',
  'Daily new deal discovery',
  'Priority access to limited offers',
  'Live savings dashboard',
  '30-day money-back guarantee',
];

const ANNUAL_FEATURES = [
  'Everything in Pro Monthly',
  'Best yearly rate',
  'Early access to newly added offers',
  'Better ROI for active founders',
  'Priority alerts on fresh credits',
];

const LIFETIME_FEATURES = [
  'Everything in Pro',
  'One-time payment',
  'Future catalog updates included',
  'Best for long-term operators',
];

export function HomePricingSection() {
  return (
    <section id="pricing" className="border-t border-white/5 bg-black/20 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center sm:mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Your Investment Vs Your Return
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pick The Pro Plan.
            <br />
            Let The Savings Compound.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            We&apos;re focusing on the plans founders actually use: monthly for flexibility, annual for the best recurring value, and lifetime for long-term operators.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <HomepagePricingCard
            title="Pro Monthly"
            price="$10 / month"
            subtitle="Most Flexible"
            cta="Start Pro Monthly"
            href="/checkout?plan=monthly"
            featured
            items={MONTHLY_FEATURES}
          />
          <HomepagePricingCard
            title="Pro Annual"
            price="$50 / year"
            subtitle="Best Value"
            cta="Choose Pro Annual"
            href="/checkout?plan=annual"
            emphasized
            items={ANNUAL_FEATURES}
          />
          <HomepagePricingCard
            title="Pro Lifetime"
            price="$150 one-time"
            subtitle="Pay Once"
            cta="Get Lifetime Access"
            href="/checkout?plan=lifetime"
            items={LIFETIME_FEATURES}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <span>💳 Secure payment via Stripe</span>
          <span>🔄 Cancel anytime on monthly and annual</span>
          <span>✅ 30-day money back guarantee</span>
          <span>🔒 Encrypted checkout</span>
        </div>
      </div>
    </section>
  );
}

function HomepagePricingCard({
  title,
  price,
  cta,
  href,
  items,
  subtitle,
  featured,
  emphasized,
}: {
  title: string;
  price: string;
  cta: string;
  href: string;
  items: string[];
  subtitle?: string;
  featured?: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-[28px] border p-8 ${
        emphasized
          ? 'border-orange-400/40 bg-gradient-to-b from-orange-400/10 to-white/[0.03] shadow-2xl shadow-orange-500/10'
          : featured
            ? 'border-cyan-400/40 bg-gradient-to-b from-cyan-400/10 to-white/[0.03] shadow-2xl shadow-cyan-500/10'
            : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      {subtitle ? (
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${emphasized ? 'text-orange-200' : featured ? 'text-cyan-200' : 'text-slate-300'}`}>
          {subtitle}
        </p>
      ) : null}
      <h3 className="mt-3 text-3xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-4xl font-bold text-white">{price}</p>
      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${emphasized ? 'text-orange-300' : 'text-cyan-300'}`} />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold ${
          emphasized || featured ? 'bg-white text-black hover:bg-slate-100' : 'border border-white/15 bg-white/10 text-white hover:bg-white/15'
        }`}
      >
        {cta} <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </div>
  );
}
