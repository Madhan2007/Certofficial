import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";

import { CatalogBrowser } from "@/components/catalog-browser";
import {
  categories,
  getCategories,
  getCategoryPage,
  getExamCards,
  getProviders,
} from "@/lib/catalog";

export const revalidate = 3600;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) return { title: "Category not found" };

  return {
    title: `${data.category.name} certifications`,
    description: `${data.category.description} Compare ${data.exams.length} ${data.category.name.toLowerCase()} certification exams and voucher prices in India.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) notFound();

  const [cards, providers, allCategories] = await Promise.all([
    getExamCards(),
    getProviders(),
    getCategories(),
  ]);

  const items = cards.filter((card) => card.exam.category === data.category.slug);

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
          <Link href="/exams" className="hover:text-ink-800">
            Exams
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-600">{data.category.name}</span>
        </nav>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Category</p>
          <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
            {data.category.name} certifications
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
            {data.category.description}
          </p>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <CatalogBrowser
              items={items}
              providers={providers}
              categories={allCategories}
              lockedCategory={data.category.slug}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
