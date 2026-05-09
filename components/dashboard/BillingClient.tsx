'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock, ArrowRight, Infinity as InfinityIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface BillingClientProps {
  profile: Profile | null;
  successParam: boolean;
  canceledParam: boolean;
  stripeReady: boolean;
  stripeMessage: string | null;
}

const premiumFeatures = [
  'Unlimited perk claims',
  'Access to every tool in the catalog',
  'Exclusive member-only deals',
  'Early access to new perks',
  'Priority customer support',
];

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    trialing: { label: 'Trial', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    lifetime: { label: 'Lifetime', className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' },
    past_due: { label: 'Past Due', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    canceled: { label: 'Canceled', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    incomplete: { label: 'Incomplete', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  };
  const config = map[status] ?? { label: status, className: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export function BillingClient({ profile, successParam, canceledParam, stripeReady, stripeMessage }: BillingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'annual' | 'lifetime' | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isLifetime = profile?.lifetime_access === true || profile?.plan_type === 'lifetime';
  const isPremium = profile?.role === 'premium' || profile?.role === 'admin' || isLifetime;
  const isAnnual = profile?.plan_type === 'annual' && !isLifetime;
  const periodEnd = profile?.subscription_period_end
    ? new Date(profile.subscription_period_end).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  async function handleCheckout(plan: 'monthly' | 'annual' | 'lifetime') {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? 'Failed to start checkout');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handlePortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? 'Failed to open billing portal');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-gray-400">Manage your subscription and billing details</p>
      </div>

      {successParam && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              {isLifetime ? 'Welcome to the founder club!' : 'Subscription activated!'}
            </p>
            <p className="mt-0.5 text-sm text-emerald-300">
              {isLifetime
                ? 'You now have lifetime access to every perk — current and future.'
                : 'Welcome to Pro. You now have access to all features.'}
            </p>
          </div>
        </div>
      )}

      {canceledParam && (
        <div className="flex items-start gap-3 rounded-xl border border-gray-800 bg-white/[0.03] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="text-sm font-semibold text-white">Checkout canceled</p>
            <p className="mt-0.5 text-sm text-gray-400">No changes were made to your subscription.</p>
          </div>
        </div>
      )}

      {!stripeReady && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
          <div>
            <p className="text-sm font-semibold text-amber-200">Billing setup incomplete</p>
            <p className="mt-0.5 text-sm text-amber-300">
              {stripeMessage ?? 'Stripe is not configured yet for this environment.'}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-[28px] border border-gray-800 bg-black p-6">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-white">
          <CreditCard className="h-4 w-4 text-emerald-300" />
          Current Plan
        </h2>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <span className="text-xl font-bold text-white">
                {isLifetime ? 'Lifetime' : isAnnual ? 'Pro Annual' : isPremium ? 'Pro Monthly' : 'Free'}
              </span>
              <StatusBadge status={isLifetime ? 'lifetime' : profile?.subscription_status ?? (isPremium ? 'active' : null)} />
            </div>
            {isLifetime && (
              <p className="flex items-center gap-1.5 text-sm text-gray-400">
                <InfinityIcon className="w-3.5 h-3.5" /> One-time $150 — access forever
              </p>
            )}
            {!isLifetime && isPremium && (
              <p className="text-sm text-gray-400">{isAnnual ? '$50 / year' : '$10 / month'}</p>
            )}
            {!isPremium && (
              <p className="text-sm text-gray-400">Free forever — upgrade to unlock everything</p>
            )}
          </div>
        </div>

        {!isLifetime && isPremium && periodEnd && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2.5 text-sm text-gray-400">
            <Clock className="w-4 h-4 flex-shrink-0" />
            {profile?.subscription_status === 'canceled'
              ? `Access until ${periodEnd}`
              : `Next billing date: ${periodEnd}`}
          </div>
        )}

        {!isLifetime && isPremium && profile?.stripe_customer_id && (
            <Button
              onClick={handlePortal}
              disabled={loadingPortal || !stripeReady}
              variant="outline"
              className="h-9 border-gray-700 bg-black text-white hover:bg-white/5"
            >
            {loadingPortal ? 'Opening portal...' : 'Manage subscription'}
          </Button>
        )}

        {isLifetime && (
          <div className="rounded-lg border border-emerald-400/20 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 px-4 py-3 text-sm text-emerald-200">
            Thanks for supporting us at launch. Your founder status never expires.
          </div>
        )}
      </div>

      {!isPremium && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-[28px] border border-gray-800 bg-black p-6">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pro Monthly</span>
            </div>
            <h3 className="mb-1 text-xl font-bold text-white">$10 / month</h3>
            <p className="mb-5 text-sm text-gray-400">Cancel anytime, no lock-in.</p>
            <ul className="space-y-2 mb-6">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout('monthly')}
              disabled={loadingPlan !== null || !stripeReady}
              variant="outline"
              className="h-10 w-full gap-2 border-gray-700 bg-white text-black hover:bg-gray-100"
            >
              {loadingPlan === 'monthly' ? 'Redirecting...' : 'Start Pro Monthly'}
              {loadingPlan !== 'monthly' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

          <div className="rounded-[28px] border border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-white/[0.03] p-6 shadow-lg shadow-orange-500/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-orange-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">Pro Annual</span>
            </div>
            <h3 className="mb-1 text-xl font-bold text-white">$50 / year</h3>
            <p className="mb-5 text-sm text-gray-400">Best recurring value. Just $4.17/month.</p>
            <ul className="space-y-2 mb-6">
              {[
                'Everything in Pro Monthly',
                'Best yearly rate',
                'Early access to newly added offers',
                'Priority alerts on fresh credits',
                '30-day money-back guarantee',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-300" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout('annual')}
              disabled={loadingPlan !== null || !stripeReady}
              className="h-10 w-full gap-2 bg-orange-500 text-white hover:bg-orange-600"
            >
              {loadingPlan === 'annual' ? 'Redirecting...' : 'Choose Pro Annual'}
              {loadingPlan !== 'annual' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

          <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-6 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-2 mb-1">
              <InfinityIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Lifetime — best value</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">$150 once</h3>
            <p className="text-slate-400 text-sm mb-5">Pay once, use forever. Launch pricing.</p>
            <ul className="space-y-2 mb-6">
              {['Everything in Pro Monthly', 'All future perks included', 'Founder member badge', '30-day money-back'].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan !== null || !stripeReady}
              className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white gap-2"
            >
              {loadingPlan === 'lifetime' ? 'Redirecting...' : 'Get Lifetime'}
              {loadingPlan !== 'lifetime' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {!isLifetime && isPremium && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {!isAnnual && (
            <div className="rounded-[28px] border border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-white/[0.03] p-6 shadow-lg shadow-orange-500/10">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-300" />
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">Upgrade to Annual</span>
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">$50 / year</h3>
              <p className="mb-5 text-sm text-gray-400">Save more with the yearly plan and lock in the best recurring rate.</p>
              <Button
                onClick={() => handleCheckout('annual')}
                disabled={loadingPlan !== null || !stripeReady}
                className="h-10 w-full gap-2 bg-orange-500 text-white hover:bg-orange-600"
              >
                {loadingPlan === 'annual' ? 'Redirecting...' : 'Switch to Annual'}
                {loadingPlan !== 'annual' && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <InfinityIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Upgrade to Lifetime</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Pay $150 once for lifetime access</h3>
            <p className="text-slate-400 text-sm mb-5">Lock in launch pricing forever. Includes every future perk.</p>
            <Button
              onClick={() => handleCheckout('lifetime')}
              disabled={loadingPlan !== null || !stripeReady}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-10 px-6 gap-2"
            >
              {loadingPlan === 'lifetime' ? 'Redirecting...' : 'Get Lifetime — $150'}
              {loadingPlan !== 'lifetime' && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
