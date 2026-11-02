import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarClock,
  FileCheck2,
  Mail,
  Search,
  ShieldCheck,
  Timer,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From searching an exam to receiving a verified voucher and GST invoice — the full Certitude process, step by step.",
  alternates: { canonical: "/how-it-works" },
};

const STAGES = [
  {
    step: "01",
    title: "Find the exam",
    icon: Search,
    body: "Start from the catalogue or a provider page. Each exam page shows the official price, exam format, passing score, languages and the voucher validity we can offer.",
    bullets: [
      "Search by exam code (SAA-C03, AZ-104, SY0-701)",
      "Filter by provider, category and level",
      "Official price shown next to ours, always",
    ],
  },
  {
    step: "02",
    title: "Request a quote",
    icon: FileCheck2,
    body: "Tell us the exam, quantity, city and target date. If you need a GST invoice, add your GSTIN. Nothing is charged at this point.",
    bullets: [
      "One form, under two minutes",
      "Bulk orders quoted per seat",
      "Reference number issued immediately",
    ],
  },
  {
    step: "03",
    title: "Approve the written quote",
    icon: BadgeCheck,
    body: "You receive an email with the final price, GST breakdown, voucher region, validity and delivery window. You approve it in writing before paying.",
    bullets: [
      "Price locked for the stated validity period",
      "Region and eligibility stated explicitly",
      "We tell you if the official store is cheaper",
    ],
  },
  {
    step: "04",
    title: "Pay and receive",
    icon: Banknote,
    body: "Pay by UPI, card or netbanking through a payment link. The voucher code and GST invoice arrive by email and in your account, with a calendar reminder before expiry.",
    bullets: [
      "Delivery within 24 hours of confirmation",
      "Code revealed once, through an authenticated link",
      "GST invoice attached to the same email",
    ],
  },
  {
    step: "05",
    title: "Book with confidence",
    icon: CalendarClock,
    body: "Use the voucher at booking. If it is rejected, send us the reference and we replace it within one business day — or refund you in full.",
    bullets: [
      "Replacement within 1 business day",
      "Refund in 5–7 business days if unresolved",
      "Expiry reminders at 30, 14, 7 and 1 day",
    ],
  },
];

const INCLUDED = [
  "A voucher valid for the stated period in the stated region",
  "A GST invoice with your GSTIN where provided",
  "Written confirmation of price, region and expiry",
  "Expiry reminders before your voucher lapses",
  "Replacement or refund if the code is rejected",
  "A human on WhatsApp or email during support hours",
];

const NOT_INCLUDED = [
  "Training courses, practice exams or study material",
  "Guaranteed exam passes",
  "Exam scheduling on your behalf (you book directly with the provider)",
  "Vouchers for exams we cannot source — we will tell you rather than substitute",
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="container-page py-14 md:py-20">
          <Badge tone="brand">
            <ShieldCheck className="h-3 w-3" />
            The process
          </Badge>
          <h1 className="display mt-5 max-w-3xl text-4xl text-ink-950 sm:text-5xl">
            Five steps. Every one of them written down.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-600">
            {brand.name} is quote-first while we onboard verified suppliers. That
            means you always see the final price and validity before any money
            moves — and you can walk away at any stage with nothing owed.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="space-y-4">
          {STAGES.map((stage) => (
            <div
              key={stage.step}
              className="grid gap-6 rounded-2xl border border-line bg-white p-6 md:grid-cols-[auto_1fr_1fr] md:items-start md:p-8"
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <stage.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-[11px] text-ink-300">
                  STEP {stage.step}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-ink-900">
                  {stage.title}
                </h2>
                <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink-600">
                  {stage.body}
                </p>
              </div>

              <ul className="space-y-2 md:border-l md:border-line md:pl-6">
                {stage.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-[13px] text-ink-600"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-cream/40">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-brand-700">
              <BadgeCheck className="h-4 w-4" />
              What you get
            </p>
            <ul className="mt-4 space-y-2.5">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-[13px] font-semibold text-ink-500">
              What is not included
            </p>
            <ul className="mt-4 space-y-2.5">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-ink-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-ink-400">
              Exam dumps and &ldquo;guaranteed pass&rdquo; material violate every
              major provider&rsquo;s candidate agreement. We do not sell them and
              will not link to them.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink-950 px-7 py-10 text-white sm:flex-row sm:items-center sm:px-10">
          <div>
            <h2 className="display text-2xl sm:text-3xl">
              Ready to price your exam?
            </h2>
            <p className="mt-2 max-w-lg text-[14px] text-white/60">
              Takes about ninety seconds. You will have a written quote within one
              business day.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/quote" size="lg">
              Request a quote
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <Link
              href={`mailto:${brand.supportEmail}`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[15px] font-medium text-white hover:border-white/50"
            >
              <Mail className="h-4 w-4" />
              Email us
            </Link>
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 text-[12px] text-ink-400">
          <Timer className="h-3.5 w-3.5" />
          Typical quote turnaround: under 6 working hours.
        </p>
      </section>
    </div>
  );
}
