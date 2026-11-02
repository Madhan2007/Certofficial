import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogBrowser } from "@/components/catalog-browser";
import { getCategories, getExamCards, getProviders } from "@/lib/catalog";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "All IT certification exams",
  description:
    "Browse 50+ IT certification exams from AWS, Microsoft, Google Cloud, Cisco, CompTIA, ISC2, PMI and more. Compare official prices, exam format and voucher availability.",
  alternates: { canonical: "/exams" },
  openGraph: {
    title: `All IT certification exams · ${brand.name}`,
    description:
      "Compare official prices and voucher availability across 50+ certification exams.",
    url: `${brand.url}/exams`,
  },
};

export const revalidate = 3600;

function CatalogSkeleton() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-2xl border border-line bg-white"
        />
      ))}
    </div>
  );
}

export default async function ExamsPage() {
  const [cards, providers, categories] = await Promise.all([
    getExamCards(),
    getProviders(),
    getCategories(),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IT certification exams",
    numberOfItems: cards.length,
    itemListElement: cards.slice(0, 25).map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${card.exam.name} (${card.exam.code})`,
      url: `${brand.url}/exams/${card.exam.slug}`,
    })),
  };

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Catalogue</p>
        <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
          Every certification, one price comparison.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          Official prices are taken from each provider&rsquo;s published pricing.
          Where we can source a voucher, the indicative price and delivery window
          are shown next to it. Where resale is restricted, we link you straight
          to the official store instead of pretending otherwise.
        </p>
      </div>

      <div className="mt-10">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogBrowser
            items={cards}
            providers={providers}
            categories={categories}
          />
        </Suspense>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </div>
  );
}
