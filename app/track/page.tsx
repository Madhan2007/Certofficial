import type { Metadata } from "next";
import { AlertCircle, ArrowRight, MessageCircle, PackageSearch } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Track an order or quote",
  description:
    "Look up a Certitude quote reference or order number to see its current status.",
  alternates: { canonical: "/track" },
  robots: { index: false, follow: true },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = ref?.trim();

  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Track</p>
        <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">
          Where is my voucher?
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
          Enter the reference from your quote or order email. References look like{" "}
          <span className="font-mono text-ink-800">CQ-202611-A4K9P</span>.
        </p>

        <form action="/track" className="mt-8">
          <div className="rounded-2xl border border-line bg-white p-5">
            <Label htmlFor="ref">Quote or order reference</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="ref"
                name="ref"
                defaultValue={reference ?? ""}
                placeholder="CQ-202611-A4K9P"
                autoComplete="off"
                className="h-11 font-mono uppercase"
              />
              <ButtonLink
                href={
                  reference
                    ? `/track?ref=${encodeURIComponent(reference)}`
                    : "/track"
                }
                className="h-11 shrink-0 px-5"
                aria-disabled={!reference}
              >
                <PackageSearch className="h-4 w-4" />
                Look up
              </ButtonLink>
            </div>
            <p className="mt-2 text-[11.5px] text-ink-400">
              Reference is case-insensitive. We never display a full voucher code
              on this page.
            </p>
          </div>
        </form>

        {reference && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-100/40 p-5">
            <p className="flex items-center gap-2 text-[13px] font-medium text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Live tracking is not switched on yet
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
              We are still onboarding suppliers, so orders are tracked manually and
              confirmed over email. Send us the reference{" "}
              <span className="font-mono text-ink-800">({reference})</span> and we
              will reply with the current status the same business day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`mailto:${brand.supportEmail}?subject=${encodeURIComponent(
                  `Status request: ${reference}`,
                )}`}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-ink-900 px-4 text-[13px] font-medium text-white hover:bg-ink-800"
              >
                Email support
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                  `Hi Certitude, can you check the status of ${reference}?`,
                )}`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] font-medium text-ink-700 hover:border-ink-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Quoted",
              body: "We have priced your request and are holding it for the stated validity.",
            },
            {
              title: "Paid",
              body: "Payment confirmed. A voucher is being allocated from verified stock.",
            },
            {
              title: "Delivered",
              body: "Code sent by email with a GST invoice and expiry reminders scheduled.",
            },
          ].map((stage) => (
            <div key={stage.title} className="rounded-xl border border-line bg-white p-4">
              <p className="text-[12px] font-semibold text-ink-900">{stage.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">
                {stage.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
