# Deployment Guide

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

Required services to set up:
1. **Supabase** — https://supabase.com → create project → run `supabase/migrations/001_initial_schema.sql` in SQL Editor
2. **Stripe** — https://stripe.com → get test keys → add webhook endpoint for `payment_intent.succeeded`
3. **PayPal** — https://developer.paypal.com → create sandbox app → get client ID + secret
4. **Coinbase Commerce** — https://commerce.coinbase.com → create API key + webhook
5. **Resend** — https://resend.com → verify your domain → create API key

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add all environment variables from `.env.local.example`
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL or custom domain

## Stripe Webhook (Production)

In Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://your-domain.com/api/stripe/webhook`  
- Events: `payment_intent.succeeded`

## Stripe CLI (Local Development)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Supabase Auth

Add your Vercel URL to Supabase → Auth → URL Configuration → Site URL and Redirect URLs.
