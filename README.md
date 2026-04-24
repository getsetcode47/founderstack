# founderstackhub

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-t7gplgy5)

## Founder Stack Hub setup

This repository now includes the full Founder Stack Hub deals platform on top of the existing Next.js + Supabase stack.

### What was added

- A database-backed `deals` catalog with public deal pages and admin CMS support
- `site_settings` for editable homepage and footer content
- `deal_claims` for auth-aware claim tracking
- `partner_submissions` for the `/submit-tool` workflow
- A Supabase storage bucket policy setup for `deal-logos`
- Seed data for the initial Founder Stack Hub deal directory

### Apply the database changes

Run the Supabase migrations, including:

- `supabase/migrations/20260420103000_create_founderstackhub_deals.sql`

### Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` for webhook/admin server flows
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID`

You can start from `.env.example`.

### Stripe production checklist

The app already includes:

- `POST /api/stripe/checkout`
- `POST /api/stripe/portal`
- `POST /api/stripe/webhook`

To make live payments work in production:

1. Create your Stripe products and prices for monthly, annual, and lifetime.
2. Add the matching price IDs to your environment variables.
3. Set `STRIPE_SECRET_KEY` on the server.
4. Add a Stripe webhook endpoint pointing to:
   - `/api/stripe/webhook`
5. Subscribe the webhook to at least:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
6. Set `STRIPE_WEBHOOK_SECRET` from the webhook endpoint in Stripe.
7. Ensure your Supabase `profiles` table includes the billing fields used by the webhook:
   - `stripe_customer_id`
   - `stripe_subscription_id`
   - `subscription_status`
   - `subscription_period_end`
   - `lifetime_access`
   - `plan_type`

### Stripe testing note

Live payment verification cannot be completed unless valid Stripe keys and price IDs are present in the environment. In environments where Stripe is not configured, the billing UI and API routes now fail gracefully with explicit setup messages instead of broken checkout behavior.

### Remote sync fallback

If your Supabase project already has the legacy `categories` and `perks` tables but not the newer Founder Stack Hub `deals` table migration, you can still sync the catalog into the live remote database with:

- `npm run sync:founderstack`

This reads the source dataset from `app/deals/data.ts` and upserts it into the remote `categories` and `perks` tables using `SUPABASE_SERVICE_ROLE_KEY`.

### Current Supabase note

The app now supports a server-side fallback that reads Founder Stack Hub catalog data from the remote `perks` table when `public.deals` is missing. Browser auth still requires a valid public Supabase key, so if sign-in or middleware reads fail, replace `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the correct publishable or anon key from your Supabase project API settings.

### Validation commands

- `npm run typecheck`
- `npm run lint`
- `npm run build`
# founderstack
# founderstack
