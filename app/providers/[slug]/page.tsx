import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { CatalogBrowser } from "@/components/catalog-browser";
import { ProviderMark } from "@/components/exam-meta";
import {
  getCategories,
  getExamCards,
  getProvider,
  getProviderPage,
  getProviders,
} from "@/lib/catalog";
import { brand } from "@/lib/brand";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const providers = await getProviders();
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProviderPage(slug);
  if (!data) return { title: "Provider not found" };

  return {
    title: `${data.provider.name} certification vouchers`,
    description: `Compare ${data.provider.name} certification exam prices and voucher availability in India. ${data.exams.length} exams tracked with official pricing and quoted savings.`,
    alternates: { canonical: `/providers/${slug}` },
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = getProvider(slug);
  if (!provider) notFound();

  const [cards, providers, categories] = await Promise.all([
    getExamCards(),
    getProviders(),
    getCategories(),
  ]);

  const items = cards.filter((card) => card.exam.providerSlug === provider.slug);

  return (
    <div>
      <div className="border-b border-line bg-white">
        <nav
          className="container-page flex items-center gap-1.5 py-3 text-[12px] text-ink-400"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink-800">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/providers" className="hover:text-ink-800">
            Providers
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-600">{provider.shortName}</span>
        </nav>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-6 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <ProviderMark provider={provider} size="lg" />
              <div>
                <p className="eyebrow">Provider</p>
                <h1 className="display mt-1 text-3xl text-ink-950 sm:text-4xl">
                  {provider.name}
                </h1>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
              {provider.description}
            </p>
          </div>

          <a
            href={provider.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-medium text-ink-700 hover:border-ink-400"
          >
            Official certification site
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <CatalogBrowser
              items={items}
              providers={providers}
              categories={categories}
              lockedProvider={provider.slug}
            />
          </Suspense>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ink-400">
          {brand.name} is independent and is not affiliated with {provider.name}.
          Exam names and codes are used for identification only. Official prices
          are indicative and sourced from {provider.shortName}&rsquo;s published
          pricing; confirm the current price on the official site before booking.
        </p>
      </div>
    </div>
  );
}
