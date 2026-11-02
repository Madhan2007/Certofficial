import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Answers about exam voucher pricing, validity, delivery, GST invoices, refunds and why some offers are quote-only.",
  alternates: { canonical: "/faq" },
};

interface Group {
  title: string;
  items: { q: string; a: string }[];
}

const GROUPS: Group[] = [
  {
    title: "Buying on Certitude",
    items: [
      {
        q: "Is this a shop or an enquiry service?",
        a: "Right now it is quote-first. We are onboarding suppliers and will only enable direct checkout where we hold written authorisation. Every order therefore starts with a written quote that locks the price, region and expiry before you pay.",
      },
      {
        q: "Do I need an account to buy?",
        a: "No. You can request a quote and complete an order with just an email address. An account is useful for tracking orders, storing GST details and seeing voucher expiry reminders in one place.",
      },
      {
        q: "Can I buy for someone else?",
        a: "Yes, as long as the voucher is not tied to a named individual. We confirm eligibility rules in the quote. For bulk purchases we deliver an allocation sheet so each candidate receives their own code.",
      },
      {
        q: "Which exams do you cover?",
        a: "AWS, Microsoft, Google Cloud, Cisco, CompTIA, ISC2, PMI, HashiCorp, CNCF and Salesforce today. If an exam is missing, name it in the quote form and we will tell you whether we can source it.",
      },
    ],
  },
  {
    title: "Pricing and payment",
    items: [
      {
        q: "How are your prices calculated?",
        a: "We start from the provider's published price and subtract what our procurement route allows, after accounting for GST, payment fees and a service margin. We do not invent a crossed-out price.",
      },
      {
        q: "Why is the listed price called “indicative”?",
        a: "Because voucher pricing moves with stock and exchange rates. The listed figure shows the typical saving; the quote fixes the exact amount for a stated period.",
      },
      {
        q: "Which payment methods do you accept?",
        a: "UPI, credit and debit cards, netbanking and wallets through Razorpay. Business customers can request an NEFT transfer against a proforma invoice.",
      },
      {
        q: "Do you charge extra for GST invoices?",
        a: "No. Provide your GSTIN in the quote form and the invoice is issued with it at no additional cost.",
      },
      {
        q: "Is the price inclusive of GST?",
        a: "Quoted prices show the GST component separately. The total payable is stated in the quote, so there is no surprise at the payment page.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        q: "How fast will I receive the voucher?",
        a: "Within 24 hours of confirmed payment for in-stock supply, often within a couple of hours. If an order will take longer, we tell you before you pay.",
      },
      {
        q: "How is the code delivered?",
        a: "By email and, when you have an account, through a one-time reveal link. The link has a short time-to-live and every access is logged.",
      },
      {
        q: "Can you send it on WhatsApp?",
        a: "We send the order confirmation on WhatsApp if you opt in, but the voucher code itself goes by email and account reveal so there is an auditable record.",
      },
      {
        q: "What if I lose the email?",
        a: "Sign in and reopen the order, or contact support with your reference number. We re-issue access to the same code rather than a new one.",
      },
    ],
  },
  {
    title: "Vouchers and validity",
    items: [
      {
        q: "How long is a voucher valid?",
        a: "Typically 12 months from the date of issue. The exact expiry is stated in your quote and again on the delivery email. We do not sell near-expiry stock without saying so.",
      },
      {
        q: "Can I use the voucher outside India?",
        a: "Some vouchers are region-restricted. The quote states the region explicitly. If you plan to sit the exam abroad, tell us before we quote.",
      },
      {
        q: "Can I reschedule an exam booked with a voucher?",
        a: "Rescheduling is governed by the provider and the test centre, not by us. Provider policies generally allow rescheduling up to 24–48 hours before the appointment, sometimes with a fee.",
      },
      {
        q: "Can a voucher be used more than once?",
        a: "No. A voucher covers one exam attempt. Retakes require a separate voucher, which is why we quote retake pricing separately when you ask for it.",
      },
    ],
  },
  {
    title: "Refunds and replacements",
    items: [
      {
        q: "What if the voucher does not work?",
        a: "Send us the booking reference and the error message. We replace the voucher within one business day. If we cannot replace it, you get a full refund.",
      },
      {
        q: "Can I get a refund if I change my mind?",
        a: "Before the code is revealed, yes — a full refund minus payment gateway fees. After the code is revealed, vouchers are treated like gift cards and are generally non-refundable, because the code can no longer be resold safely.",
      },
      {
        q: "What if my exam is retired before I book?",
        a: "Providers usually honour existing vouchers for the replacement exam version, but rules vary. Contact us and we will confirm the policy in writing for your specific programme.",
      },
    ],
  },
  {
    title: "Business, colleges and GST",
    items: [
      {
        q: "Do you support bulk orders?",
        a: "Yes. Select “Bulk order” in the quote form. We quote per seat, hold expiry dates in writing, and provide one GST invoice with a per-candidate allocation sheet.",
      },
      {
        q: "Can we pay against a purchase order?",
        a: "For verified business accounts, yes. Send the PO details with your enquiry and we will confirm terms before issuing vouchers.",
      },
      {
        q: "Do you offer credit terms?",
        a: "Not at launch. As supplier relationships and order history build, net-15 terms become available for repeat institutional customers.",
      },
    ],
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
            Everything, answered plainly.
          </h1>
          <p className="mt-5 text-[14.5px] leading-relaxed text-ink-600">
            If something is not covered here, email{" "}
            <a
              href={`mailto:${brand.supportEmail}`}
              className="text-brand-600 underline"
            >
              {brand.supportEmail}
            </a>{" "}
            and we will add it.
          </p>

          <div className="mt-8 space-y-2">
            {GROUPS.map((group) => (
              <a
                key={group.title}
                href={`#${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="block rounded-lg px-2 py-1.5 text-[13px] text-ink-500 hover:bg-cream hover:text-ink-900"
              >
                {group.title}
              </a>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <p className="text-[13px] font-medium text-ink-900">
              Still unsure what to buy?
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
              Tell us your target role and budget. We will tell you which
              certification is worth the money — and which is not.
            </p>
            <ButtonLink href="/quote" size="sm" className="mt-4">
              Ask us
              <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-12">
          {GROUPS.map((group) => (
            <section
              key={group.title}
              id={group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="scroll-mt-28"
            >
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
                {group.title}
              </h2>
              <div className="mt-2 divide-y divide-line border-y border-line">
                {group.items.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[14.5px] font-medium text-ink-900">
                      {item.q}
                      <span className="mt-0.5 shrink-0 text-ink-400 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-600">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-line bg-cream/60 p-6">
            <p className="flex items-center gap-2 text-[13px] font-medium text-ink-900">
              <MessageCircle className="h-4 w-4 text-brand-600" />
              Prefer to talk?
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">
              WhatsApp us during support hours, or{" "}
              <Link href="/contact" className="text-brand-600 underline">
                see all contact options
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
