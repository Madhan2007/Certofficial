import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";
import { getExamPage } from "@/lib/catalog";
import { formatInr } from "@/lib/utils";

export const alt = "Certification exam voucher details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#070c15";
const inkSoft = "#3b4759";
const paper = "#fbfaf7";
const brand600 = "#0a6b4b";
const brand100 = "#e3f3ec";
const line = "#e4e1d8";

const titleSize = (length: number): number => {
  if (length > 46) return 52;
  if (length > 34) return 62;
  return 72;
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getExamPage(slug);

  if (!page) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: 72,
            background: paper,
            color: ink,
          }}
        >
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
            {brand.name}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: inkSoft }}>
            {brand.tagline}
          </div>
        </div>
      ),
      { ...size },
    );
  }

  const { exam, provider, offer, discountPercent } = page;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: paper,
          color: ink,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: brand100,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              borderRadius: 12,
              background: provider.accent,
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {provider.mark}
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600 }}>
            {provider.name}
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              padding: "8px 16px",
              borderRadius: 9999,
              border: `1px solid ${line}`,
              background: "#ffffff",
              fontSize: 17,
              letterSpacing: 2,
              color: inkSoft,
              textTransform: "uppercase",
            }}
          >
            {exam.level}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: 8,
              background: ink,
              color: paper,
              fontSize: 20,
              letterSpacing: 1,
              alignSelf: "flex-start",
            }}
          >
            {exam.code}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              maxWidth: 940,
              fontSize: titleSize(exam.name.length),
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: -1.8,
            }}
          >
            {exam.name} voucher
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontSize: 24,
              color: inkSoft,
            }}
          >
            {exam.summary}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "14px 24px",
              borderRadius: 12,
              background: brand600,
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            From {formatInr(offer.priceInr)}
          </div>
          {discountPercent > 0 ? (
            <div
              style={{
                display: "flex",
                padding: "14px 24px",
                borderRadius: 12,
                border: `1px solid ${line}`,
                background: "#ffffff",
                fontSize: 22,
                color: inkSoft,
              }}
            >
              Save {discountPercent}% vs list price
            </div>
          ) : null}
          <div style={{ display: "flex", marginLeft: "auto", fontSize: 19, color: inkSoft }}>
            {brand.name} · GST invoice · India
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
