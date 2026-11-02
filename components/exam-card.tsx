import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { LevelBadge, ProviderMark, SupplyBadge } from "@/components/exam-meta";
import { Badge } from "@/components/ui/badge";
import type { ExamWithRelations } from "@/lib/types";
import { cn, formatInr } from "@/lib/utils";

export function ExamCard({
  item,
  className,
}: {
  item: ExamWithRelations;
  className?: string;
}) {
  const { exam, provider, offer, discountPercent } = item;
  const isOfficial = offer.supplyStatus === "affiliate";

  return (
    <Link
      href={`/exams/${exam.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_12px_32px_-16px_rgba(13,20,33,0.28)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProviderMark provider={provider} />
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-400">
              {provider.shortName}
            </p>
            <p className="font-mono text-[12px] text-ink-500">{exam.code}</p>
          </div>
        </div>
        {discountPercent > 0 ? (
          <Badge tone="brand" className="shrink-0">
            {discountPercent}% below official
          </Badge>
        ) : (
          <SupplyBadge status={offer.supplyStatus} />
        )}
      </div>

      <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
        {exam.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
        {exam.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <LevelBadge level={exam.level} />
        <span className="inline-flex items-center gap-1 text-[12px] text-ink-400">
          <Clock className="h-3.5 w-3.5" />
          {exam.questionCount} questions
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          {isOfficial ? (
            <>
              <p className="text-[11px] uppercase tracking-wide text-ink-400">
                Official price
              </p>
              <p className="text-[17px] font-semibold text-ink-900">
                {formatInr(offer.priceInr)}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] uppercase tracking-wide text-ink-400">
                Indicative
                <span className="sr-only"> official price</span>
              </p>
              <p className="flex items-baseline gap-2">
                <span className="text-[17px] font-semibold text-ink-900">
                  {formatInr(offer.priceInr)}
                </span>
                <span className="text-[12px] text-ink-400 line-through">
                  {formatInr(offer.compareAtInr)}
                </span>
              </p>
            </>
          )}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-[12px] font-medium text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-white">
          {isOfficial ? "Official store" : "View offer"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
