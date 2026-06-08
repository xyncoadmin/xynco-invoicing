# xynco Invoice Platform — Design Spec

**Date:** 2026-06-03  
**Author:** Sam (xynco)  
**Status:** Approved for implementation

---

## Context

xynco (AI consulting & web development firm) needs an internal invoicing platform to replace manual invoice creation. The system must support one-off project invoices and recurring retainer/subscription billing, automatically deliver branded invoices via email with pay-by-link, and accept the full range of payment methods clients expect. The system is used only by the xynco team — clients only interact with the invoice email and the payment page.

---

## Architecture

**Approach:** Stripe-powered core. Stripe Billing handles all card payment logic, PCI-DSS compliance, subscription/recurring billing, and automatic retry on failed payments. Other payment methods are layered on top without requiring additional licensing.

### Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Internal dashboard |
| Styling | Tailwind CSS + xynco design tokens | Brand-consistent UI |
| Database | Supabase (PostgreSQL) | Clients, invoices, payment records |
| Auth | Supabase Auth | Team login (email/password) |
| Billing engine | Stripe Billing | Cards, Amex, subscriptions, webhooks |
| Alt. payments | PayPal SDK | PayPal checkout |
| Crypto | Coinbase Commerce | BTC, ETH, USDC |
| Email | Resend + React Email | Branded invoice delivery |
| PDF generation | Puppeteer or `@react-pdf/renderer` | Downloadable invoice PDFs |
| Hosting | Vercel | Next.js deployment |

---

## Payment Methods

| Method | Integration | Notes |
|---|---|---|
| Credit / debit card | Stripe | PCI-DSS handled by Stripe |
| Amex | Stripe | Included automatically |
| PayPal | PayPal JS SDK | API integration, auto-confirms |
| Crypto (BTC, ETH, USDC) | Coinbase Commerce | No money transmitter license required |
| Venmo | Manual confirmation | Show xynco Venmo Business handle; team marks paid |
| E-Transfer | Manual confirmation | Show banking instructions; team marks paid |
| Direct deposit / wire | Manual confirmation | Show banking details; team marks paid |

**Legal compliance:**
- Stripe: PCI-DSS Level 1 — card data never touches xynco servers
- Crypto via Coinbase Commerce: operates under Coinbase's licenses — no additional licensing needed
- Venmo: must use a Venmo Business profile (not personal) per Venmo ToS
- E-transfer & direct deposit: tracked as manual payments, no payment processing license required
- No personal data stored beyond what's necessary (PIPEDA / GDPR principle of data minimisation)

---

## Core Features

### 1. Client Manager
- Create/edit clients: name, email, address, default payment terms
- View all invoices per client
- Client currency preference (CAD / USD)

### 2. Invoice Builder
- Line items: description, quantity, rate, subtotal
- Invoice number (auto-incremented, e.g. INV-041)
- Issue date, due date, payment terms (Net 7 / Net 14 / Net 30 / custom)
- Notes field (e.g. project reference, PO number)
- Tax line (GST/HST toggle for Canadian clients)
- Preview before sending

### 3. Recurring Subscriptions / Retainers
- Create a subscription: client, amount, interval (weekly / monthly / quarterly / annual)
- Stripe Billing generates and sends invoices automatically on schedule
- Dunning: Stripe retries failed card payments automatically (3 attempts over 7 days)
- Cancel or pause subscriptions from dashboard

### 4. Email Delivery
- Automatic send on invoice creation (or scheduled for recurring)
- xynco-branded email template (white, clean — matches invoice style A)
- Email contains: invoice summary, due date, "Pay Now" button → payment page
- Delivery powered by Resend; domain: `invoices@xynco.io`

### 5. Payment Page
- URL: `pay.xynco.io/inv/[invoice-id]`
- White/light background, xynco branding, cyan accent
- Payment method tabs: Card · PayPal · Crypto · E-Transfer · Direct Deposit · Venmo
- Card tab: Stripe Elements (hosted, secure)
- PayPal tab: PayPal button component
- Crypto tab: Coinbase Commerce checkout link
- E-Transfer / Direct Deposit / Venmo tabs: show payment instructions + "I've paid" button (flags for team to confirm)
- On successful payment: confirmation page + email receipt to client

### 6. Invoice Document (PDF + Web)
- White background, minimal design (Style A approved)
- xynco logo top-left, cyan rule below header
- Invoice number, issue date, due date top-right
- Bill To / From columns
- Line items table with IBM Plex Mono numbers
- Total in cyan
- "Pay Now" button linking to payment page
- PDF download available

### 7. Dashboard
- Navigation: icon sidebar (Style A approved)
- Stats bar: Outstanding · Paid this month · Active clients · Overdue
- Recent invoices list with status badges (Pending / Paid / Overdue / Draft)
- Upcoming recurring invoices panel
- Quick action: "+ New Invoice" button (cyan, top right)

### 8. Payment Tracking
- All payments (card, PayPal, crypto, manual) recorded to Supabase
- Manual payments (e-transfer, Venmo, direct deposit) marked confirmed by team
- Invoice status: Draft → Sent → Paid / Overdue / Void
- Stripe webhooks update payment status in real time

---

## Data Model (simplified)

```
clients          id, name, email, address, currency, created_at
invoices         id, client_id, number, status, issue_date, due_date, total, stripe_invoice_id
invoice_items    id, invoice_id, description, quantity, rate, subtotal
subscriptions    id, client_id, stripe_subscription_id, amount, interval, status
payments         id, invoice_id, method, amount, status, confirmed_at, stripe_payment_intent_id
```

---

## Invoice Design (approved)

- **Background:** white (#FFFFFF)
- **Header:** xynco logo (light-bg variant, `#0099BB` cyan x) + cyan rule (`#00D4FF`, 2px)
- **Typography:** Inter for labels/body, IBM Plex Mono for numbers/amounts
- **Total:** `#0099BB` cyan, bold
- **Pay button:** `#0099BB` background, white text, 6px border-radius
- **Line items table:** `#F9FAFB` header row, `#E5E7EB` borders

---

## Pages / Routes

| Route | Description |
|---|---|
| `/` | Dashboard (stats + recent invoices) |
| `/invoices` | All invoices, filterable by status |
| `/invoices/new` | Invoice builder |
| `/invoices/[id]` | Invoice detail + send / download |
| `/clients` | Client list |
| `/clients/new` | New client form |
| `/clients/[id]` | Client detail + invoice history |
| `/subscriptions` | Recurring subscriptions manager |
| `/subscriptions/new` | New subscription form |
| `/settings` | Team settings, payment method config, banking details |
| `pay.xynco.io/inv/[id]` | Public payment page (no auth) |

---

## Verification

To confirm the system works end-to-end:

1. Create a test client and invoice in the dashboard
2. Send the invoice — verify branded email arrives with pay link
3. Click pay link → verify payment page loads with all method tabs
4. Complete a Stripe test card payment → verify invoice status updates to Paid in real time
5. Test a PayPal sandbox payment → verify confirmation
6. Test a Coinbase Commerce crypto charge → verify webhook confirms
7. Use "I've paid" on e-transfer tab → verify team can manually confirm in dashboard
8. Create a recurring subscription → verify invoice auto-generates on schedule
9. Download PDF → verify formatting matches approved invoice design
10. Test overdue state: advance due date → verify status badge updates and overdue count increments on dashboard
