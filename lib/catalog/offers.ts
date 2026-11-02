import { exams } from "@/lib/catalog/exams";
import type { Offer, SupplyStatus } from "@/lib/types";

const LAST_VERIFIED_AT = "2026-10-27T09:30:00+05:30";

/**
 * Providers whose voucher terms prohibit resale.
 * For these we never quote a discounted price — we link straight to the
 * official store and say so on the page. This is a compliance rule, not a
 * merchandising choice.
 */
const OFFICIAL_STORE_ONLY = new Set(["comptia"]);

/** Indicative discount bands by exam level, used only for quote estimates. */
const QUOTE_BANDS: Record<string, number> = {
  foundational: 0.14,
  associate: 0.16,
  professional: 0.18,
  specialty: 0.18,
  expert: 0.18,
};

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function buildOffer(examSlug: string, index: number): Offer {
  const exam = exams.find((e) => e.slug === examSlug);
  if (!exam) throw new Error(`Unknown exam ${examSlug}`);

  const officialStore = OFFICIAL_STORE_ONLY.has(exam.providerSlug);
  const supplyStatus: SupplyStatus = officialStore ? "affiliate" : "quote";

  // Small deterministic variation so the catalogue doesn't look uniform.
  const jitter = ((index * 7) % 5) * 0.01;
  const rate = officialStore ? 0 : (QUOTE_BANDS[exam.level] ?? 0.16) + jitter;
  const price = officialStore
    ? exam.officialPriceInr
    : roundTo(exam.officialPriceInr * (1 - rate), 100);

  return {
    id: `off_${exam.slug}`,
    examSlug: exam.slug,
    supplierName: officialStore ? "Official provider store" : "Certitude sourcing desk",
    supplyStatus,
    priceInr: price,
    compareAtInr: exam.officialPriceInr,
    region: "India",
    eligibility: "Open to all candidates",
    deliveryEstimate: officialStore
      ? "Instant — issued by the provider"
      : "Within 24 hours of payment confirmation",
    voucherValidityDays: 365,
    lastVerifiedAt: LAST_VERIFIED_AT,
    notes: officialStore
      ? "This provider's voucher terms do not permit resale, so we link you to the official store instead of discounting."
      : "Indicative price. Final price and validity are confirmed in writing before you pay.",
  };
}

export const offers: Offer[] = exams.map((exam, index) =>
  buildOffer(exam.slug, index),
);
