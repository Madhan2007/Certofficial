import { Badge } from "@/components/ui/badge";
import type { ExamLevel, Provider, SupplyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const LEVEL_LABEL: Record<ExamLevel, string> = {
  foundational: "Foundational",
  associate: "Associate",
  professional: "Professional",
  specialty: "Specialty",
  expert: "Expert",
};

export function ProviderMark({
  provider,
  size = "md",
  className,
}: {
  provider: Provider;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-sm" : "h-11 w-11 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border font-semibold tracking-tight",
        dims,
        className,
      )}
      style={{
        backgroundColor: `${provider.accent}12`,
        borderColor: `${provider.accent}30`,
        color: provider.accent,
      }}
      aria-hidden="true"
    >
      {provider.mark}
    </span>
  );
}

export function LevelBadge({ level }: { level: ExamLevel }) {
  return <Badge tone="outline">{LEVEL_LABEL[level]}</Badge>;
}

const SUPPLY_COPY: Record<
  SupplyStatus,
  { label: string; tone: "brand" | "amber" | "neutral" | "danger"; hint: string }
> = {
  verified: {
    label: "Verified supply",
    tone: "brand",
    hint: "We hold written authorisation for this offer.",
  },
  affiliate: {
    label: "Official store",
    tone: "neutral",
    hint: "This provider does not permit resale, so we link to the official store.",
  },
  quote: {
    label: "Quote required",
    tone: "amber",
    hint: "Price and validity are confirmed in writing before payment.",
  },
  unavailable: {
    label: "Unavailable",
    tone: "danger",
    hint: "Out of stock right now. Ask us to notify you.",
  },
};

export function SupplyBadge({ status }: { status: SupplyStatus }) {
  const copy = SUPPLY_COPY[status];
  return (
    <Badge tone={copy.tone} title={copy.hint}>
      {copy.label}
    </Badge>
  );
}

export function SupplyHint({ status }: { status: SupplyStatus }) {
  return <p className="text-xs leading-relaxed text-ink-400">{SUPPLY_COPY[status].hint}</p>;
}

export function supplyLabel(status: SupplyStatus): string {
  return SUPPLY_COPY[status].label;
}
