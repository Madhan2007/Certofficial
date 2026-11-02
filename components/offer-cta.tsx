import { ArrowRight, ExternalLink, BellRing } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import { flags } from "@/lib/flags";
import type { ExamWithRelations } from "@/lib/types";

export function OfferCta({
  item,
  size = "lg",
  fullWidth = true,
}: {
  item: ExamWithRelations;
  size?: "md" | "lg";
  fullWidth?: boolean;
}) {
  const { exam, offer } = item;
  const width = fullWidth ? "w-full" : "";

  if (offer.supplyStatus === "affiliate") {
    return (
      <a
        href={exam.examUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-[15px] font-medium text-white transition-colors hover:bg-ink-800 ${width}`}
      >
        Buy on the official store
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  if (offer.supplyStatus === "verified" && flags.checkout) {
    return (
      <ButtonLink
        href={`/checkout?offer=${offer.id}`}
        size={size}
        className={width}
      >
        Buy now
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    );
  }

  if (offer.supplyStatus === "unavailable") {
    return (
      <ButtonLink
        href={`/quote?exam=${exam.slug}&intent=notify`}
        variant="outline"
        size={size}
        className={width}
      >
        <BellRing className="h-4 w-4" />
        Notify me when available
      </ButtonLink>
    );
  }

  return (
    <ButtonLink
      href={`/quote?exam=${exam.slug}`}
      size={size}
      className={width}
    >
      Request a verified quote
      <ArrowRight className="h-4 w-4" />
    </ButtonLink>
  );
}
