/**
 * Single source of truth for brand identity.
 * Rename the product here and it propagates through metadata, copy and emails.
 */
export const brand = {
  name: "Certitude",
  legalName: "Certitude Technologies",
  tagline: "Certification, without the doubt.",
  description:
    "Compare verified IT certification exam vouchers from AWS, Microsoft, Google Cloud, Cisco, CompTIA and more. Transparent pricing, GST invoices, India-first support.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://certitude.in",
  email: "hello@certitude.in",
  supportEmail: "support@certitude.in",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  city: "Bengaluru",
  country: "India",
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  founded: 2026,
  social: {
    linkedin: "https://www.linkedin.com/company/certitude",
    x: "https://x.com/certitude",
    instagram: "https://www.instagram.com/certitude",
  },
} as const;

export const supportHours = "Mon–Sat, 10:00–19:00 IST";

export type Brand = typeof brand;
