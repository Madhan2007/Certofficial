import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe2,
  Layers,
  ShieldCheck,
  Target,
  Timer,
} from "lucide-react";

import { ExamCard } from "@/components/exam-card";
import {
  LevelBadge,
  ProviderMark,
  SupplyBadge,
  SupplyHint,
  supplyLabel,
} from "@/components/exam-meta";
import { OfferCta } from "@/components/offer-cta";
import { Badge } from "@/components/ui/badge";
import { getExamCards, getExamPage } from "@/lib/catalog";
import { brand } from "@/lib/brand";
import { flags } from "@/lib/flags";
import type { ExamWithRelations } from "@/lib/types";
import { formatDate, formatDuration, formatInr, formatUsd } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const cards = await getExamCards();
  return cards.map((card) => ({ slug: card.exam.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getExamPage(slug);
  if (!data) return { title: "Exam not found" };

  const { exam, provider } = data;
  const title = `${exam.name} (${exam.code}) voucher price in India`;
  const description = `Compare the official ${exam.code} exam price with ${brand.name}'s indicative voucher price. Exam format, validity, delivery window and refund policy for ${provider.shortName} ${exam.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/exams/${exam.slug}` },
    openGraph: {
      title,
      description,
      url: `${brand.url}/exams/${exam.slug}`,
      type: "website",
    },
  };
}

function FactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wide text-ink-400">{label}</dt>
        <dd className="mt-0.5 text-[13.5px] font-medium text-ink-800">{value}</dd>
      </div>
    </div>
  );
}

function PricePanel({ item }: { item: ExamWithRelations }) {
  const { exam, offer, savingInr, discountPercent } = item;
  const isOfficial = offer.supplyStatus === "affiliate";

  if (isOfficial) {
    return (
      <div className="rounded-xl border border-line bg-paper p-4">
        <p className="text-[11px] uppercase tracking-wide text-ink-400">
          Official price
        </p>
        <p className="mt-1 text-2xl font-semibold text-ink-900">
          {formatInr(offer.priceInr)}
        </p>
        <p className="mt-1 text-[11px] text-ink-400">
          ≈ {formatUsd(exam.officialPriceUsd)} · excl. local taxes
        </p>
        <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-500">
          {exam.providerSlug === "comptia"
            ? "CompTIA voucher terms do not permit resale. We link you to the official store rather than selling an unauthorised voucher."
            : "This offer is only available through the provider's official store."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink-400">
            Indicative price
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-ink-900">
              {formatInr(offer.priceInr)}
            </span>
            <span className="text-[13px] text-ink-400 line-through">
              {formatInr(offer.compareAtInr)}
            </span>
          </p>
        </div>
        {discountPercent > 0 && (
          <Badge tone="brand">{discountPercent}% below official</Badge>
        )}
      </div>
      <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-ink-500">
        You save about{" "}
        <span className="font-medium text-ink-800">{formatInr(savingInr)}</span>{" "}
        per attempt. The final price, voucher region and expiry are confirmed in
        your written quote.
      </p>
    </div>
  );
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getExamPage(slug);
  if (!data) notFound();

  const { exam, provider, offer } = data;
  const allCards = await getExamCards();
  const related = allCards
    .filter((card) => card.exam.slug !== exam.slug)
    .sort((a, b) => {
      const sameA = a.exam.category === exam.category ? 1 : 0;
      const sameB = b.exam.category === exam.category ? 1 : 0;
      if (sameA !== sameB) return sameB - sameA;
      return b.exam.popularity - a.exam.popularity;
    })
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${exam.name} (${exam.code}) exam voucher`,
    description: exam.summary,
    sku: exam.code,
    brand: { "@type": "Brand", name: provider.shortName },
    category: "Education > Certification",
    offers: {
      "@type": "Offer",
      price: offer.priceInr,
      priceCurrency: "INR",
      availability:
        offer.supplyStatus === "unavailable"
          ? "https://schema.org/OutOfStock"
          : offer.supplyStatus === "quote"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      url: `${brand.url}/exams/${exam.slug}`,
      seller: { "@type": "Organization", name: brand.name },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: exam.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brand.url },
      { "@type": "ListItem", position: 2, name: "Exams", item: `${brand.url}/exams` },
      {
        "@type": "ListItem",
        position: 3,
        name: exam.name,
        item: `${brand.url}/exams/${exam.slug}`,
      },
    ],
  };

  return (
    <div className="pb-8">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-white">
        <nav
          className="container-page flex items-center gap-1.5 py-3 text-[12px] text-ink-400"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink-800">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/exams" className="hover:text-ink-800">
            Exams
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/providers/${provider.slug}`} className="hover:text-ink-800">
            {provider.shortName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-ink-600">{exam.code}</span>
        </nav>
      </div>

      <div className="container-page pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          {/* Main column */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ProviderMark provider={provider} />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-400">
                  {provider.name}
                </p>
                <p className="font-mono text-[12px] text-ink-500">
                  {exam.code} · {supplyLabel(offer.supplyStatus)}
                </p>
              </div>
            </div>

            <h1 className="display mt-5 text-3xl text-ink-950 sm:text-[2.75rem]">
              {exam.name}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-600">
              {exam.summary}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <LevelBadge level={exam.level} />
              <Badge tone="outline">{formatDuration(exam.durationMinutes)}</Badge>
              <Badge tone="outline">{exam.questionCount} questions</Badge>
              <SupplyBadge status={offer.supplyStatus} />
              {exam.retireAt && (
                <Badge tone="danger">
                  <AlertTriangle className="h-3 w-3" />
                  Retires {formatDate(exam.retireAt)}
                </Badge>
              )}
            </div>

            {/* Quick facts */}
            <dl className="mt-8 grid gap-x-8 border-y border-line sm:grid-cols-2 sm:divide-x sm:divide-line">
              <div className="sm:pr-8">
                <FactRow
                  icon={Clock}
                  label="Exam duration"
                  value={formatDuration(exam.durationMinutes)}
                />
                <FactRow
                  icon={Target}
                  label="Passing score"
                  value={exam.passingScore}
                />
                <FactRow
                  icon={FileText}
                  label="Questions"
                  value={`${exam.questionCount} (multiple choice & scenario)`}
                />
              </div>
              <div className="sm:pl-8">
                <FactRow
                  icon={Layers}
                  label="Level"
                  value={
                    exam.level.charAt(0).toUpperCase() + exam.level.slice(1)
                  }
                />
                <FactRow
                  icon={Globe2}
                  label="Languages"
                  value={exam.languages.slice(0, 3).join(", ")}
                />
                <FactRow
                  icon={CalendarClock}
                  label="Voucher validity"
                  value={`${offer.voucherValidityDays} days from delivery`}
                />
              </div>
            </dl>

            {/* About */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink-900">
                About this certification
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">
                {exam.description}
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">
                It is intended for {exam.audience.toLowerCase()}. Most candidates
                need roughly <strong>{exam.studyHours} hours</strong> of focused
                preparation. The exam is delivered in English through the
                provider&rsquo;s authorised testing network, which includes
                Pearson VUE centres across India.
              </p>
            </section>

            {/* Skills */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink-900">
                What the exam covers
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {exam.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-start gap-2.5 rounded-lg border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {skill}
                  </li>
                ))}
              </ul>
            </section>

            {/* Delivery */}
            <section className="mt-10 rounded-2xl border border-line bg-white p-6">
              <h2 className="text-lg font-semibold text-ink-900">
                How the voucher reaches you
              </h2>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    title: "You request a quote",
                    body: "Confirm the exam, your city and your target test date. No payment at this stage.",
                  },
                  {
                    title: "We confirm price, region and expiry in writing",
                    body: `The quote states the final amount, GST, voucher validity and delivery window (${offer.deliveryEstimate.toLowerCase()}).`,
                  },
                  {
                    title: "You pay, we deliver",
                    body: "Voucher code plus GST invoice arrive by email and in your account. A calendar reminder is created for 30 days before expiry.",
                  },
                  {
                    title: "Replacement if it fails",
                    body: "If the code is rejected at booking, send us the reference. Replacement within one business day, or a full refund.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 font-mono text-[11px] font-semibold text-brand-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-ink-900">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink-900">
                Questions about the {exam.code} voucher
              </h2>
              <div className="mt-2 divide-y divide-line border-y border-line">
                {exam.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[14px] font-medium text-ink-900">
                      {faq.question}
                      <span className="mt-0.5 shrink-0 text-ink-400 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line-strong bg-white p-5 shadow-[0_20px_50px_-30px_rgba(13,20,33,0.45)]">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Voucher offer</p>
                <SupplyBadge status={offer.supplyStatus} />
              </div>

              <div className="mt-4">
                <PricePanel item={data} />
              </div>

              <div className="mt-4 space-y-2.5 text-[12.5px] text-ink-600">
                <p className="flex items-start gap-2">
                  <Timer className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span>{offer.deliveryEstimate}</span>
                </p>
                <p className="flex items-start gap-2">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span>Valid for {offer.voucherValidityDays} days after delivery</span>
                </p>
                <p className="flex items-start gap-2">
                  <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span>{offer.region} · {offer.eligibility}</span>
                </p>
                <p className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <span>Replacement within 1 business day if rejected</span>
                </p>
              </div>

              <div className="mt-5">
                <OfferCta item={data} />
              </div>

              <div className="mt-3">
                <SupplyHint status={offer.supplyStatus} />
              </div>

              <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-[11px] text-ink-400">
                <p>
                  Last verified {formatDate(offer.lastVerifiedAt)} ·{" "}
                  {offer.supplierName}
                </p>
                <p>
                  Need an invoice?{" "}
                  <Link href="/contact" className="text-brand-600 hover:underline">
                    Ask for GST billing
                  </Link>
                </p>
              </div>
            </div>

            {flags.checkout && offer.supplyStatus === "verified" && (
              <p className="mt-3 px-1 text-[11px] leading-relaxed text-ink-400">
                Checkout is protected by Razorpay. Card, UPI and netbanking
                accepted.
              </p>
            )}

            <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-4">
              <p className="flex items-center gap-2 text-[12px] font-medium text-ink-700">
                <BookOpen className="h-4 w-4 text-ink-400" />
                Should you buy from us?
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-500">
                If you are a student with access to an academic voucher, or your
                employer provides Microsoft ESI or Cisco NetAcad discounts, the
                official route is usually cheaper. We will tell you so.
              </p>
            </div>
          </aside>
        </div>

        {/* Related */}
        <section className="mt-16 border-t border-line pt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-2xl text-ink-950">
              Related certifications
            </h2>
            <Link
              href="/exams"
              className="text-[13px] font-medium text-brand-600 hover:underline"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ExamCard key={item.exam.slug} item={item} />
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
