# Certitude

An India-first marketplace for discounted IT certification exam vouchers —
AWS, Microsoft, Google Cloud, Cisco, CompTIA, ISC2, PMI, HashiCorp, CNCF and
Salesforce.

> **Working name.** Everything customer-facing is derived from
> [`lib/brand.ts`](lib/brand.ts). Rename the product there and the metadata,
> legal pages and footer follow.

---

## Why this is quote-first

The category has a trust problem. Deep discounts on exam vouchers usually come
from one of four places: region arbitrage, academic or partner stock that cannot
legally be resold, near-expiry inventory, or outright fraud. Two facts shaped
this build:

- **CompTIA's voucher terms state that vouchers may not be resold.**
- **Xvoucher, one of the largest AWS voucher resellers, entered bankruptcy in
  2025 and lost its AWS authorisation.**

So the storefront is deliberately gated. Every offer carries a `supply_status`:

| Status | Meaning | UI |
| --- | --- | --- |
| `verified` | Written authorisation on file | Buy now (only when the checkout flag is on) |
| `affiliate` | Provider prohibits resale — link to official store | Official store link, no markup |
| `quote` | Source not yet authorised for direct sale | Request a verified quote |
| `unavailable` | Out of stock / expired | Notify me |

With no supplier today, **everything is `quote` or `affiliate`**, and checkout is
behind `NEXT_PUBLIC_ENABLE_CHECKOUT=false`. That is the safe launch position:
the site earns leads and trust, and direct checkout switches on per offer once
authorisation exists.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional; the site runs without it
npm run dev
```

Open http://localhost:3000.

No environment variables are required. Without Supabase configured:

- the catalogue is served from the typed seed in `lib/catalog/`
- `POST /api/leads` validates the request, logs it, and returns a reference with
  `demo: true`

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC, ISR) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS 4 with `@theme` tokens |
| UI | Hand-written shadcn-style primitives (no runtime UI dependency) |
| Icons | Lucide |
| Data | Supabase Postgres (optional) + typed TS seed fallback |
| Validation | Zod |
| Payments | Razorpay (Phase 2, not wired) |
| Email | Resend (Phase 2, not wired) |
| Hosting | Vercel |

---

## Routes

```
/                             landing page
/exams                        catalogue with search, filters, sort
/exams/[slug]                 exam detail + offer + quote CTA
/providers                    provider index
/providers/[slug]             provider catalogue
/categories/[slug]            category catalogue
/trust                        trust centre (supply classes, SLA, verification)
/how-it-works                 five-step process
/faq                          grouped FAQs with FAQPage JSON-LD
/quote                        quote / bulk / notify form
/contact                      contact channels
/track                        reference lookup (manual until checkout ships)
/legal/[slug]                 terms, privacy, refund, delivery, trademarks
/api/leads                    POST — validated, rate-limited lead capture
/sitemap.xml, /robots.txt     generated from the catalogue
```

---

## Where things live

```
app/                      routes, metadata, sitemap, robots
components/               header, footer, cards, catalogue browser, quote form
components/ui/            button, badge, card, form fields
lib/brand.ts              brand name, contact details, URLs
lib/types.ts              the domain model
lib/catalog/              providers, exams, offers, data-access layer
lib/legal.ts              policy copy
lib/flags.ts              feature flags
lib/leads.ts              lead schema + reference generator
supabase/migrations/      schema, RLS, atomic allocation function
```

### Catalogue data flow

`lib/catalog/index.ts` exports cached, async accessors (`getExamCards`,
`getExamPage`, `getCatalogStats`, …). Each one:

1. reads from Supabase when `NEXT_PUBLIC_SUPABASE_URL` and an anon key exist and
   the tables contain rows;
2. otherwise returns the typed TypeScript seed.

A database outage therefore degrades to the static catalogue instead of a 500.
This is intentional: the public catalogue should never be able to go down.

### Adding an exam

Add an entry to `lib/catalog/exams.ts` using the `makeExam` factory. FAQs for
voucher validity, India availability and the replacement promise are generated
automatically; pass `extraFaqs` for exam-specific questions. Offers are derived
from exams in `lib/catalog/offers.ts`, including the discount band by level and
the CompTIA official-store rule.

---

## Database

Apply both migrations with the Supabase CLI, then seed the catalogue:

```bash
supabase link --project-ref <your-project-ref>
supabase db push

npm run seed:sql                       # regenerate supabase/seed.sql from TS
psql "$DATABASE_URL" -f supabase/seed.sql
```

Without the CLI, paste `supabase/migrations/0001_init.sql`, then
`0002_categories.sql`, then `supabase/seed.sql` into the SQL editor — in that
order. The seed is idempotent, so re-running it after a catalogue edit is safe.

After seeding, set the project URL and publishable (anon) key locally and on
Vercel. The app then reads the catalogue from Postgres and falls back to the
TypeScript seed only if the database is unreachable or empty.

### Seeding

`supabase/seed.sql` is generated — never hand-edited. It upserts
`categories`, `providers`, `exams` and `offers` in dependency order, so the
foreign keys hold. To change a price, description or exam:

1. edit `lib/catalog/*.ts`
2. `npm run seed:sql`
3. apply `supabase/seed.sql`

The migration creates three deliberately separate layers:

- **catalogue** — `categories`, `providers`, `exams`
- **offer** — `suppliers`, `offers`, `price_history`
- **inventory** — `voucher_batches`, `voucher_inventory`, `deliveries`

plus commerce (`orders`, `order_items`, `payments`, `refunds`), growth
(`leads`, `coupons`, `reviews`, `saved_items`, `price_alerts`) and `audit_logs`.

### Security posture

- RLS is enabled on every table.
- `voucher_inventory` and `payments` have **no** client policies at all — service
  role only.
- `leads` allows anonymous `insert` and nothing else.
- Public catalogue tables are read-only to clients; writes require `is_staff()`.
- Voucher codes are stored encrypted (`code_encrypted`) with a `code_hash` unique
  constraint and a `code_last4` display column.

### Atomic allocation

`reserve_voucher(offer_id, order_id)` selects with
`FOR UPDATE SKIP LOCKED`, so two concurrent checkouts can never receive the same
code. `release_expired_reservations()` frees reservations older than 20 minutes
and is designed to run on `pg_cron`.

Order lifecycle:

```
pending → paid → allocated → delivered → completed
   ↓        ↓         ↓
expired  refunded  replaced
```

---

## Feature flags

| Flag | Default | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_ENABLE_CHECKOUT` | `false` | Enables the buy button for `verified` offers |
| `NEXT_PUBLIC_ENABLE_REVIEWS` | `true` | Review UI |
| `NEXT_PUBLIC_ENABLE_PRICE_HISTORY` | `false` | Price history chart |
| `NEXT_PUBLIC_ENABLE_WHATSAPP` | `true` | WhatsApp support entry points |

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SITE_URL
vercel --prod
```

Then add the domain in **Project → Settings → Domains**.

⚠️ **Vercel Hobby is licensed for non-commercial use only.** This is a commercial
store, so either upgrade to Pro (~$20/month) before launch or move to Cloudflare
Workers or Netlify. The code has no Vercel-specific dependencies.

Before going live:

1. Point `brand.url` / `NEXT_PUBLIC_SITE_URL` at the real domain.
2. Replace the placeholder email, phone and WhatsApp number in `lib/brand.ts`.
3. Have a lawyer review `lib/legal.ts` — it is a careful draft, not legal advice.
4. Confirm GST treatment with a CA. Prices currently show GST separately.
5. Keep `NEXT_PUBLIC_ENABLE_CHECKOUT=false` until supplier authorisation is signed.

---

## Phase 2 backlog

- Razorpay order creation + signed webhook + idempotent payment rows
- Voucher delivery: encrypted code reveal, email via Resend, GST invoice PDF
- Auth (email + Google), account area, saved exams, expiry reminders
- Admin: offers, inventory import, orders, refunds, leads, audit trail
- Verified reviews tied to delivered orders
- pg_cron jobs for reservation cleanup, price alerts and expiry reminders
- Sentry + privacy-friendly analytics
- Programmatic SEO expansion: comparisons, role paths, discount guides

## Phase 1 non-goals

Community feeds, study groups, an AI advisor, native mobile apps, multi-vendor
seller onboarding, exam dumps, and any "guaranteed pass" content.
