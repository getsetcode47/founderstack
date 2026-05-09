type CheckoutPlan = 'monthly' | 'annual' | 'lifetime';

export function getStripePriceId(plan: CheckoutPlan): string | null {
  if (plan === 'lifetime') {
    return process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID ?? null;
  }

  if (plan === 'annual') {
    return process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID ?? null;
  }

  return (
    process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ??
    process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID ??
    null
  );
}

export function isStripeSecretConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

export function isStripeCheckoutConfigured(plan?: CheckoutPlan): boolean {
  if (plan) {
    return isStripeSecretConfigured() && Boolean(getStripePriceId(plan));
  }

  return (
    isStripeSecretConfigured() &&
    (Boolean(getStripePriceId('monthly')) ||
      Boolean(getStripePriceId('annual')) ||
      Boolean(getStripePriceId('lifetime')))
  );
}

export function getStripeConfigError(plan?: CheckoutPlan): string {
  if (!isStripeSecretConfigured()) {
    return 'Stripe secret key is not configured on the server.';
  }

  if (plan && !getStripePriceId(plan)) {
    return `Stripe price ID is missing for the ${plan} plan.`;
  }

  return 'Stripe billing is not configured yet.';
}
