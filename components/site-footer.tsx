import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { Wordmark } from "@/components/logo";
import { brand, supportHours } from "@/lib/brand";
import { categories } from "@/lib/catalog/providers";

const columns = [
  {
    title: "Catalogue",
    links: [
      { href: "/exams", label: "All exams" },
      { href: "/providers", label: "Providers" },
      { href: "/categories/cloud", label: "Cloud certifications" },
      { href: "/categories/security", label: "Cybersecurity" },
      { href: "/categories/ai", label: "AI & machine learning" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/trust", label: "Trust centre" },
      { href: "/quote", label: "Request a quote" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/legal/terms", label: "Terms of service" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/refund", label: "Refund policy" },
      { href: "/legal/delivery", label: "Delivery policy" },
      { href: "/legal/trademarks", label: "Trademark notice" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {brand.tagline} A comparison-first marketplace for IT certification
              exam vouchers, built for India.
            </p>

            <div className="mt-6 space-y-2.5 text-sm text-ink-600">
              <a
                href={`mailto:${brand.supportEmail}`}
                className="flex items-center gap-2 hover:text-ink-900"
              >
                <Mail className="h-4 w-4 text-ink-400" />
                {brand.supportEmail}
              </a>
              <a
                href={`https://wa.me/${brand.whatsapp}`}
                className="flex items-center gap-2 hover:text-ink-900"
              >
                <MessageCircle className="h-4 w-4 text-ink-400" />
                WhatsApp support
              </a>
              <p className="flex items-center gap-2 text-ink-500">
                <MapPin className="h-4 w-4 text-ink-400" />
                {brand.city}, {brand.country}
              </p>
            </div>
            <p className="mt-3 text-xs text-ink-400">{supportHours}</p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-600 hover:text-ink-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="rounded-full border border-line px-3 py-1 text-xs text-ink-500 hover:border-ink-300 hover:text-ink-800"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 text-xs leading-relaxed text-ink-400 md:flex-row md:items-start md:justify-between">
          <p className="max-w-3xl">
            Certitude is an independent marketplace and is not affiliated with,
            endorsed by, or sponsored by any certification body. All product
            names, logos and brands are the property of their respective owners.
            Official prices shown are indicative published prices and may change
            without notice. Voucher availability, eligibility and expiry are
            confirmed in writing before payment.
          </p>
          <p className="shrink-0 md:text-right">
            © {new Date().getFullYear()} {brand.legalName}
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
