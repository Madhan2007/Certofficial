import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/lib/brand";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — Discounted IT certification exam vouchers in India`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "exam voucher",
    "AWS certification voucher",
    "Microsoft exam voucher",
    "CompTIA voucher India",
    "Cisco CCNA voucher",
    "Google Cloud voucher",
    "certification exam discount India",
  ],
  authors: [{ name: brand.legalName, url: brand.url }],
  creator: brand.legalName,
  publisher: brand.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: brand.url,
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#0d1421",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  legalName: brand.legalName,
  url: brand.url,
  email: brand.supportEmail,
  description: brand.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: brand.city,
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: brand.supportEmail,
      availableLanguage: ["en", "hi"],
      areaServed: "IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
