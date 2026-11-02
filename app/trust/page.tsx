import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CircleSlash,
  FileCheck2,
  Globe2,
  Lock,
  MessageSquare,
  ShieldCheck,
  Timer,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SupplyBadge } from "@/components/exam-meta";
import { brand, supportHours } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Trust centre",
  description:
    "How Certitude classifies voucher supply, verifies codes, handles refunds and why some offers are quote-only. No vague authenticity badges.",
  alternates: { canonical: "/trust" },
};

const CLASSES = [
  {
    status: "verified" as const,
    title: "Authorisation on file",
    body: "We hold written authorisation or a documented procurement route for this voucher. Checkout is available.",
    detail: ["Written authorisation held", "Checked before delivery", "Full refund if rejected"],
  },
  {
    status: "affiliate" as const,
    title: "Straight to the source",
    body: "The provider's terms do not permit resale. We link you to the official store and take no cut from your price.",
    detail: ["No markup", "Provider's own terms", "We still help if it goes wrong"],
  },
  {
    status: "quote" as const,
    title: "Price confirmed in writing",
    body: "Supply exists but is not yet authorised for direct checkout. We confirm price, region and expiry in writing first.",
    detail: ["No payment up front", "Written confirmation", "24-hour delivery after approval"],
  },
  {
    status: "unavailable" as const,
    title: "Honest out-of-stock",
    body: "Out of stock or expired. We take your email and tell you when it returns — no fake countdown timers.",
    detail: ["Honest stock status", "Email alert", "No pressure tactics"],
  },
];

const NEVER = [
  {
    icon: CircleSlash,
    title: "Sell supply we cannot document",
    body: "If a supplier cannot evidence their authorisation, the offer does not get a buy button — however good the margin looks.",
  },
  {
    icon: AlertTriangle,
    title: "Fake urgency",
    body: "No invented countdown timers, no “3 left in stock” theatre. If a price has an expiry, it is a real date from the supplier.",
  },
  {
    icon: Globe2,
    title: "Pass off region-locked stock as universal",
    body: "Vouchers tied to a region or eligibility rule are labelled. We would rather lose the sale than have it fail at the test centre.",
  },
  {
    icon: Users,
    title: "Buy or fake reviews",
    body: "Reviews are tied to a delivered order and an exam outcome. We do not publish anonymous five-star ratings.",
  },
];

const SLA = [
  {
    icon: MessageSquare,
    title: "Quote response",
    value: "1 business day",
    detail: `Within ${supportHours}. Urgent requests are handled on WhatsApp.`,
  },
  {
    icon: Timer,
    title: "Voucher delivery",
    value: "24 hours",
    detail: "After payment confirmation, usually much sooner for in-stock supply.",
  },
  {
    icon: ShieldCheck,
    title: "Replacement",
    value: "1 business day",
    detail: "If a code is rejected at booking or at the test centre.",
  },
  {
    icon: Banknote,
    title: "Refund",
    value: "5–7 business days",
    detail: "Full refund if we cannot replace a failed voucher. Original payment method.",
  },
];

export default function TrustPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-page py-14 md:py-20">
          <Badge tone="brand">
            <ShieldCheck className="h-3 w-3" />
            Trust centre
          </Badge>
          <h1 className="display mt-5 max-w-3xl text-4xl text-ink-950 sm:text-5xl">
            A discount is only worth having if the voucher works.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-600">
            This category is full of &ldquo;90% off&rdquo; promises and
            unverifiable &ldquo;authorised reseller&rdquo; badges. {brand.name}{" "}
            takes the opposite approach: fewer offers, every one labelled, and the
            restrictions written down before you pay.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <ButtonLink href="/quote">
              Request a quote
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/legal/refund" variant="outline">
              Read the refund policy
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Supply classification</p>
          <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
            Four labels. No vague authenticity claims.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            Every offer on the site carries one of these four states. The label is
            derived from documentation we hold, not from a marketing decision.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CLASSES.map((item) => (
            <div
              key={item.status}
              className="rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <SupplyBadge status={item.status} />
                <span className="font-mono text-[11px] text-ink-300">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                {item.body}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {item.detail.map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-2 text-[12px] text-ink-600"
                  >
                    <BadgeCheck className="h-3.5 w-3.5 text-brand-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Never do */}
      <section className="border-y border-line bg-ink-950 text-white">
        <div className="container-page py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-400">
            Non-negotiables
          </p>
          <h2 className="display mt-3 max-w-2xl text-3xl sm:text-4xl">
            Four things we will not do, even if they convert better.
          </h2>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {NEVER.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-400 ring-1 ring-white/10">
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h3 className="text-[14.5px] font-medium">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Service levels</p>
          <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
            What we commit to, in numbers.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
            These are operational targets, not aspirations. When we have enough
            order volume to publish real medians, they will appear on this page —
            including the ones we miss.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SLA.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-5">
              <item.icon className="h-5 w-5 text-brand-600" />
              <p className="mt-3 text-[11px] uppercase tracking-wide text-ink-400">
                {item.title}
              </p>
              <p className="mt-1 text-lg font-semibold text-ink-900">
                {item.value}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-ink-500">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verification process */}
      <section className="border-t border-line bg-white">
        <div className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="eyebrow">Verification</p>
              <h2 className="display mt-3 text-3xl text-ink-950 sm:text-4xl">
                How a code gets from a supplier to your inbox.
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">
                Voucher codes are treated like payment credentials, because that
                is what they are. They are encrypted at rest, revealed once, and
                every access is logged.
              </p>
            </div>

            <ol className="space-y-5">
              {[
                {
                  title: "Supplier onboarding",
                  body: "We collect the authorisation document, its expiry date and the supplier's warranty terms before an offer can go live.",
                },
                {
                  title: "Batch intake",
                  body: "Codes are imported in batches with cost, quantity and expiry. Codes are encrypted with a server-side key and never appear in logs.",
                },
                {
                  title: "Pre-delivery check",
                  body: "Every code is checked against its programme and expiry. High-value codes get a second human check.",
                },
                {
                  title: "Single reveal",
                  body: "The buyer sees the code once, through an authenticated link with a short time-to-live. Admins see only the last four characters.",
                },
                {
                  title: "Post-delivery audit",
                  body: "Every reveal writes an audit row with actor, order, timestamp and reason. Nothing is deletable.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[11px] font-semibold text-ink-500">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-ink-900">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Counter-positioning */}
      <section className="container-page py-16">
        <div className="rounded-3xl border border-line bg-cream/60 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium text-ink-800">
                <FileCheck2 className="h-4 w-4 text-brand-600" />
                When you should not buy from us
              </p>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-600">
                If you qualify for a CompTIA academic voucher, a Microsoft ESI
                entitlement through your employer, or a Cisco Networking Academy
                discount, the official route is usually cheaper than anything a
                reseller can offer. We will point you there instead of taking the
                order. Likewise, if the official price is lower than our quote, we
                say so in the quote email.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/exams"
                  className="rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[12.5px] text-ink-700 hover:border-ink-400"
                >
                  Compare before you buy
                </Link>
                <Link
                  href="/how-it-works"
                  className="rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-[12.5px] text-ink-700 hover:border-ink-400"
                >
                  See the full process
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4">
              <Lock className="h-5 w-5 text-brand-600" />
              <div className="text-[12px] leading-relaxed text-ink-500">
                <p className="font-medium text-ink-800">Security contact</p>
                <p>{brand.supportEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
