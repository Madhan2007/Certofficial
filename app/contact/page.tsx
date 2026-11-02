import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Clock, Mail, MessageCircle, ShieldAlert } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { brand, supportHours } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Certitude team about exam vouchers, bulk orders, GST invoices or a problem with an order.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    icon: Mail,
    title: "Email support",
    detail: brand.supportEmail,
    href: `mailto:${brand.supportEmail}`,
    note: "Best for quotes, invoices and anything with an attachment.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "Chat with the sourcing desk",
    href: `https://wa.me/${brand.whatsapp}`,
    note: "Fastest for a quick price check or an urgent deadline.",
  },
  {
    icon: Building2,
    title: "Bulk and institutional",
    detail: "college@certitude.in",
    href: "mailto:college@certitude.in",
    note: "Colleges, bootcamps and delivery teams buying five seats or more.",
  },
  {
    icon: ShieldAlert,
    title: "Security and abuse",
    detail: "security@certitude.in",
    href: "mailto:security@certitude.in",
    note: "Report a leaked code, a suspicious offer or a vulnerability.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
            Talk to a person, not a ticket queue.
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-600">
            We are a small team based in {brand.city}. Support is handled by the
            same people who negotiate the vouchers, so you get an actual answer
            rather than a canned response.
          </p>

          <div className="mt-8 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[12.5px] text-ink-600">
            <Clock className="h-4 w-4 text-ink-400" />
            {supportHours} · responses within one business day
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-cream/60 p-5">
            <p className="text-[13px] font-medium text-ink-900">
              Before you write, have these ready
            </p>
            <ul className="mt-3 space-y-2 text-[12.5px] leading-relaxed text-ink-600">
              <li>• The exam code (for example SAA-C03 or AZ-104)</li>
              <li>• Your target test date and city</li>
              <li>• Quantity, if you are buying for a group</li>
              <li>• GSTIN, if you need a business invoice</li>
            </ul>
            <p className="mt-4 text-[12px] text-ink-500">
              Sending those four things usually gets you a firm quote in the first
              reply.
            </p>
            <ButtonLink href="/quote" size="sm" className="mt-4">
              Use the quote form instead
              <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CHANNELS.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              className="group flex flex-col rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_12px_32px_-16px_rgba(13,20,33,0.24)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <channel.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[13px] font-semibold text-ink-900">
                {channel.title}
              </p>
              <p className="mt-1 break-words text-[13px] text-brand-700">
                {channel.detail}
              </p>
              <p className="mt-2 flex-1 text-[12px] leading-relaxed text-ink-500">
                {channel.note}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-ink-500 group-hover:text-ink-900">
                Open
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}

          <div className="rounded-2xl border border-dashed border-line-strong p-5 sm:col-span-2">
            <p className="text-[13px] font-medium text-ink-900">
              Registered office
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
              {brand.legalName}
              <br />
              {brand.city}, {brand.country}
              <br />
              GSTIN and full registered address are printed on every invoice.
            </p>
            <p className="mt-3 text-[11.5px] text-ink-400">
              Prefer post? Email first and we will share the full address and a
              contact number.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-8">
        <p className="text-[12px] text-ink-400">
          Already have a quote reference? Mention it in your message —{" "}
          <Link href="/track" className="text-brand-600 underline">
            you can also look it up here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
