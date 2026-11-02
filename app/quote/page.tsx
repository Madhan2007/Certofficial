import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3, FileText, ShieldCheck } from "lucide-react";

import { QuoteForm, type ExamOption } from "@/components/quote-form";
import { Badge } from "@/components/ui/badge";
import { getExamCards } from "@/lib/catalog";
import { brand, supportHours } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Request a verified voucher quote",
  description:
    "Tell us which IT certification you are booking. We confirm the exact voucher price, region, expiry and GST invoice in writing before you pay.",
  alternates: { canonical: "/quote" },
};

export const revalidate = 3600;

const PROMISES = [
  {
    icon: FileText,
    title: "Written quote, not a phone estimate",
    body: "Final price, GST breakdown, voucher region and expiry — all in one email.",
  },
  {
    icon: ShieldCheck,
    title: "No payment until you approve",
    body: "We only raise a payment link after you accept the quote.",
  },
  {
    icon: Clock3,
    title: "One business day response",
    body: `Quotes are answered ${supportHours}. Urgent? WhatsApp us.`,
  },
];

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; type?: string; intent?: string }>;
}) {
  const params = await searchParams;
  const cards = await getExamCards();

  const options: ExamOption[] = cards.map(({ exam, provider }) => ({
    slug: exam.slug,
    code: exam.code,
    name: exam.name,
    provider: provider.shortName,
  }));

  const initialExam = cards.some((card) => card.exam.slug === params.exam)
    ? params.exam
    : undefined;

  const initialIntent =
    params.intent === "notify" ? "notify" : params.type === "bulk" ? "bulk" : "single";

  const selected = cards.find((card) => card.exam.slug === initialExam);

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
        <div>
          <Badge tone="brand">
            <ShieldCheck className="h-3 w-3" />
            Quote-first · no payment up front
          </Badge>

          <h1 className="display mt-5 text-4xl text-ink-950 sm:text-5xl">
            Tell us the exam. We&rsquo;ll confirm the price in writing.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600">
            We are onboarding suppliers for {brand.name}, so every order starts as
            a quote rather than a checkout. You get the exact amount, the voucher
            region and the expiry date before any money changes hands.
          </p>

          {selected && (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
              <span className="font-mono text-[12px] text-ink-500">
                {selected.exam.code}
              </span>
              <span className="text-[13.5px] font-medium text-ink-900">
                {selected.exam.name}
              </span>
              <span className="text-[12px] text-ink-400">
                Official price {selected.offer.compareAtInr.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          )}

          <div className="mt-8">
            <QuoteForm
              exams={options}
              initialExam={initialExam}
              initialIntent={initialIntent}
            />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="eyebrow">Our promise</p>
            <ul className="mt-4 space-y-4">
              {PROMISES.map((promise) => (
                <li key={promise.title} className="flex gap-3">
                  <promise.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <div>
                    <p className="text-[13px] font-medium text-ink-900">
                      {promise.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-ink-500">
                      {promise.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-cream/60 p-5">
            <p className="text-[13px] font-medium text-ink-900">
              Buying for a team or college?
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-600">
              Choose &ldquo;Bulk order&rdquo; above. We quote per seat, keep expiry
              dates in writing and issue one GST invoice with an allocation sheet.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5 text-[12px] leading-relaxed text-ink-500">
            <p className="flex items-center gap-1.5 font-medium text-ink-800">
              <CheckCircle2 className="h-4 w-4 text-brand-600" />
              Already asked for a quote?
            </p>
            <p className="mt-1.5">
              Reply to the quote email, or{" "}
              <Link href="/contact" className="text-brand-600 underline">
                contact support
              </Link>{" "}
              with your reference number.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
