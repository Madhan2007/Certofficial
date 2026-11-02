import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { getLegalDocument, legalDocuments } from "@/lib/legal";
import { brand } from "@/lib/brand";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return legalDocuments.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  if (!doc) return { title: "Policy not found" };

  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getLegalDocument(slug);
  if (!doc) notFound();

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
          <span className="text-ink-600">{doc.title}</span>
        </nav>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[0.3fr_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Policies</p>
            <nav className="mt-4 space-y-1">
              {legalDocuments.map((item) => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  className={
                    item.slug === doc.slug
                      ? "block rounded-lg bg-cream px-3 py-2 text-[13px] font-medium text-ink-900"
                      : "block rounded-lg px-3 py-2 text-[13px] text-ink-500 hover:bg-cream hover:text-ink-900"
                  }
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <p className="mt-6 text-[11px] leading-relaxed text-ink-400">
              Last updated {formatDate(doc.updated)}
              <br />
              {brand.legalName}
            </p>
          </aside>

          <article className="max-w-3xl">
            <h1 className="display text-3xl text-ink-950 sm:text-4xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
              {doc.summary}
            </p>
            <p className="mt-3 text-[12px] text-ink-400">
              Last updated {formatDate(doc.updated)}
            </p>

            <div className="mt-8 space-y-8 border-t border-line pt-8">
              {doc.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-[15px] font-semibold text-ink-900">
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-2.5 text-[14px] leading-relaxed text-ink-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-3 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-600"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-300" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-line bg-cream/50 p-5 text-[12.5px] leading-relaxed text-ink-500">
              This policy is written for Indian customers and reflects our current
              operations. If anything here is unclear, email{" "}
              <a href={`mailto:${brand.supportEmail}`} className="text-brand-600 underline">
                {brand.supportEmail}
              </a>{" "}
              and we will explain it in plain language.
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
