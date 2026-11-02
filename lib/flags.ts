/**
 * Feature flags.
 *
 * Direct checkout stays off until we hold written authorisation for at least
 * one supplier. Every offer is therefore quote-gated by default, which is the
 * safe launching position.
 */
function flag(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export const flags = {
  checkout: flag(process.env.NEXT_PUBLIC_ENABLE_CHECKOUT, false),
  reviews: flag(process.env.NEXT_PUBLIC_ENABLE_REVIEWS, true),
  priceHistory: flag(process.env.NEXT_PUBLIC_ENABLE_PRICE_HISTORY, false),
  supportWhatsapp: flag(process.env.NEXT_PUBLIC_ENABLE_WHATSAPP, true),
} as const;

export const checkoutBlockMessage =
  "Direct checkout opens once supplier authorisation is in place. Until then every order starts as a written quote.";
