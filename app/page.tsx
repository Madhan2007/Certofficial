import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CircleHelp,
  FileCheck2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";

import { ExamCard } from "@/components/exam-card";
import { ProviderMark } from "@/components/exam-meta";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCatalogStats,
  getCategories,
  getExamCards,
  getProviders,
} from "@/lib/catalog";
import { brand } from "@/lib/brand";
import { formatDate, formatInr } from "@/lib/utils";

export const revalidate = 3600;

const STEPS = [
  {
    icon: Search,
    title: "Find your exam",
    body: "Search 50+ certifications by code or name. Every page shows the official price, exam format and validity next to ours.",
  },
  {
    icon: MessageSquare,
    title: "Request a verified quote",
    body: "Tell us your exam, city and timeline. We confirm the exact price, voucher region and expiry in writing — no surprises at checkout.",
  },
  {
    icon: BadgeCheck,
    title: "Pay only when confirmed",
    body: "Once the quote is accepted you get the voucher with a GST invoice. If a code fails, we replace it or refund you in full.",
  },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Source stated on every offer",
    body: "Each listing says whether it is verified supply, an official-store link, or a quote. No vague “100% authentic” badges.",
  },
  {
    icon: FileCheck2,
    title: "Validity before payment",
    body: "Region, redemption window and expiry are written into the quote. You never discover a restriction after paying.",
  },
  {
    icon: Banknote,
    title: "GST invoice, UPI, INR",
    body: "India-first billing with GSTIN capture for businesses and reimbursement-friendly invoices for employees.",
  },
  {
    icon: Timer,
    title: "A real delivery promise",
    body: "Quotes are answered within one business day and vouchers delivered within 24 hours of confirmed payment.",
  },
];

const HOME_FAQS = [
  {
    q: "Are these vouchers genuine?",
    a: "Every voucher is purchased through a traceable channel and checked before delivery. We state the source category on each offer — verified supply, official store link, or quote — so you can judge it yourself rather than trusting a badge.",
  },
  {
    q: "Why do some exams show a quote instead of a buy button?",
    a: "Several certification bodies restrict who may resell their vouchers, and we will not sell supply we cannot document. For those exams we confirm price and validity in writing first. It is slower by a few hours and considerably safer.",
  },
  {
    q: "Will the voucher work for an exam booked in India?",
    a: "Yes, for the offers listed here. Voucher region and eligibility are confirmed on the quote, and we flag any offer that is region-restricted before you pay.",
  },
  {
    q: "What if my voucher is rejected at the test centre?",
    a: "Contact us with the booking reference. We replace the voucher within one business day or refund the full amount — your choice. We do not ask you to prove you did not use it.",
  },
];

export default async function HomePage() {
  const [cards, stats, providers, categories] = await Promise.all([
    getExamCards(),
    getCatalogStats(),
    getProviders(),
    getCategories(),
  ]);

  const popular = cards.slice(0, 6);
  const featuredProviders = providers.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-70" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand-100 blur-[120px]" />

        <div className="container-page relative py-16 md:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="min-w-0">
              <Badge tone="brand" className="mb-6">
                <Sparkles className="h-3 w-3" />
                India-first · {brand.currency} pricing · GST invoices
              </Badge>

              <h1 className="display max-w-[18ch] text-[2.6rem] text-ink-950 sm:text-6xl lg:text-[4.1rem]">
                Pay less for the certification.
                <span className="block text-brand-600">Not for the doubt.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
                {brand.name} compares IT certification exam vouchers from AWS,
                Microsoft, Google Cloud, Cisco, CompTIA and more — with the
                source, validity and delivery window stated up front.
              </p>

              <form action="/exams" className="mt-8 max-w-xl">
                <div className="flex flex-col gap-2 rounded-2xl border border-line-strong bg-white p-2 shadow-[0_18px_40px_-24px_rgba(13,20,33,0.35)] sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="search"
                      name="q"
                      placeholder="Try “SAA-C03”, “AZ-104” or “Security+”"
                      aria-label="Search exams"
                      className="h-11 w-full rounded-xl bg-transparent pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" size="md" className="h-11 px-6">
                    Compare prices
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                  Source stated on every offer
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-brand-500" />
                  Validity confirmed in writing
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-brand-500" />
                  24-hour replacement promise
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-40px_rgba(13,20,33,0.4)]">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Catalogue at a glance</p>
                  <Badge tone="outline">Live</Badge>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                  {[
                    { label: "Exams tracked", value: String(stats.examCount) },
                    { label: "Providers", value: String(stats.providerCount) },
                    {
                      label: "Typical saving",
                      value: `${stats.maxDiscount}%`,
                    },
                    {
                      label: "Entry price",
                      value: formatInr(stats.minPrice),
                    },
                  ].map((item) => (
                    <div key={item.label} className="bg-white px-4 py-4">
                      <dt className="text-[11px] uppercase tracking-wide text-ink-400">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-xl font-semibold text-ink-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 space-y-3">
                  {popular.slice(0, 3).map(({ exam, provider, offer }) => (
                    <Link
                      key={exam.slug}
                      href={`/exams/${exam.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-1.5 transition-colors hover:border-line hover:bg-paper"
                    >
                      <ProviderMark provider={provider} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink-900">
                          {exam.name}
                        </p>
                        <p className="font-mono text-[11px] text-ink-400">
                          {exam.code}
                        </p>
                      </div>
                      <span className="text-right text-[13px] font-semibold text-ink-900">
                        {formatInr(offer.priceInr)}
                      </span>
                    </Link>
                  ))}
                </div>

                <p className="mt-4 border-t border-line pt-3 text-[11px] text-ink-400">
                  Indicative prices. Last catalogue review:{" "}
                  {formatDate("2026-10-27")}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider strip */}
      <section className="border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
            Covering
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {featuredProviders.map((provider) => (
              <Link
                key={provider.slug}
                href={`/providers/${provider.slug}`}
                className="group flex items-center gap-2 text-[13px] font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: provider.accent }}
                  aria-hidden="true"
                />
                {provider.shortName}
              </Link>
            ))}
            <Link
              href="/providers"
              className="text-[13px] font-medium text-brand-600 hover:underline"
            >
              All providers →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-3 max-w-lg text-3xl text-ink-950 sm:text-4xl">
              Three steps, and nothing hidden in the fine print.
            </h2>
          </div>
          <ButtonLink href="/how-it-works" variant="ghost" size="sm">
            Read the full process
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-line bg-white p-6"
            >
              <span className="absolute right-5 top-5 font-mono text-xs text-ink-300">
                0{index + 1}
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular exams */}
      <section className="border-y border-line bg-cream/40">
        <div className="container-page py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Most requested</p>
              <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
                The exams people actually book.
              </h2>
            </div>
            <ButtonLink href="/exams" variant="outline" size="sm">
              Browse all {stats.examCount} exams
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {popular.map((item) => (
              <ExamCard key={item.exam.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Why Certitude</p>
            <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
              Discounts are easy to advertise. Trust is the hard part.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
              This category has a reputation problem. Deep discounts usually come
              from region arbitrage, academic stock that cannot legally be
              resold, or worse. We would rather show fewer offers and tell you
              exactly where each one comes from.
            </p>
            <ButtonLink href="/trust" variant="dark" className="mt-7">
              Visit the trust centre
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <pillar.icon className="h-5 w-5 text-brand-600" />
                <h3 className="mt-3 text-sm font-semibold text-ink-900">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-line bg-white">
        <div className="container-page py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">By discipline</p>
              <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
                Start from the job you want.
              </h2>
            </div>
            <ButtonLink href="/categories/cloud" variant="ghost" size="sm">
              Explore cloud
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const count = cards.filter(
                (card) => card.exam.category === category.slug,
              ).length;
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group rounded-xl border border-line p-5 transition-colors hover:border-ink-300 hover:bg-paper"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-ink-900">
                      {category.name}
                    </h3>
                    <span className="font-mono text-[11px] text-ink-300">
                      {String(count).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-500">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-7 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-[100px]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-400">
                Bulk & team orders
              </p>
              <h2 className="display mt-3 max-w-xl text-3xl sm:text-4xl">
                Buying for a college, bootcamp or delivery team?
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
                We quote per seat, hold validity in writing, and issue a single
                GST invoice with an allocation sheet for each candidate. No
                shared spreadsheets with voucher codes in them.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <ButtonLink
                href="/quote?type=bulk"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Request a bulk quote
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outline"
                size="lg"
                className="w-full border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
              >
                Talk to a human
              </ButtonLink>
              <p className="text-center text-[11px] text-white/40">
                Response within one business day · {brand.city}, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page pb-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Straight answers</p>
            <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
              The questions we get asked first.
            </h2>
            <ButtonLink href="/faq" variant="ghost" size="sm" className="mt-5 -ml-3">
              <CircleHelp className="h-4 w-4" />
              All FAQs
            </ButtonLink>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {HOME_FAQS.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15px] font-medium text-ink-900">
                  {faq.q}
                  <span className="mt-0.5 shrink-0 text-ink-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-600">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
