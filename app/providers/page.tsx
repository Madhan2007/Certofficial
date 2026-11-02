import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProviderMark } from "@/components/exam-meta";
import { Badge } from "@/components/ui/badge";
import { getExamCards, getProviders } from "@/lib/catalog";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Certification providers",
  description:
    "Browse IT certification exam vouchers by provider — AWS, Microsoft, Google Cloud, Cisco, CompTIA, ISC2, PMI, HashiCorp, CNCF and Salesforce.",
  alternates: { canonical: "/providers" },
};

export const revalidate = 3600;

export default async function ProvidersPage() {
  const [providers, cards] = await Promise.all([getProviders(), getExamCards()]);

  return (
    <div className="container-page py-12 md:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Providers</p>
        <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
          Every certification body we track.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
          {brand.name} tracks pricing and voucher availability across{" "}
          {providers.length} certification bodies. Each provider page lists every
          exam we cover, with the official price and our sourcing status.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const providerCards = cards.filter(
            (card) => card.provider.slug === provider.slug,
          );
          const cheapest = providerCards.reduce(
            (min, card) => Math.min(min, card.offer.priceInr),
            Number.POSITIVE_INFINITY,
          );

          return (
            <Link
              key={provider.slug}
              href={`/providers/${provider.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_12px_32px_-16px_rgba(13,20,33,0.28)]"
            >
              <div className="flex items-start justify-between">
                <ProviderMark provider={provider} size="lg" />
                <ArrowUpRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-ink-700" />
              </div>
              <h2 className="mt-4 text-[15px] font-semibold text-ink-900">
                {provider.shortName}
              </h2>
              <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-ink-500">
                {provider.description}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                <Badge tone="neutral">{providerCards.length} exams</Badge>
                {Number.isFinite(cheapest) && (
                  <span className="text-[11.5px] text-ink-400">
                    from ₹{cheapest.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
