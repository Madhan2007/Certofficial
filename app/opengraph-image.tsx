import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#070c15";
const inkSoft = "#3b4759";
const paper = "#fbfaf7";
const brand600 = "#0a6b4b";
const brand100 = "#e3f3ec";
const line = "#e4e1d8";

export default function OpengraphImage() {
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
            top: -190,
            right: -150,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: brand100,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 190,
            right: 70,
            width: 180,
            height: 180,
            borderRadius: 9999,
            border: `2px solid ${brand600}`,
            opacity: 0.35,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 14,
              background: brand600,
              color: paper,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: 6 }}>
            {brand.name.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              border: `1px solid ${line}`,
              fontSize: 15,
              letterSpacing: 2,
              color: inkSoft,
            }}
          >
            INDIA-FIRST VOUCHER MARKETPLACE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2.5,
            }}
          >
            Certification,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2.5,
              color: brand600,
            }}
          >
            without the doubt.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 26,
              lineHeight: 1.45,
              color: inkSoft,
            }}
          >
            AWS, Microsoft, Google Cloud, Cisco and CompTIA exam vouchers in INR —
            with GST invoices and UPI or card payment.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {[
            "54 certifications",
            "10 providers",
            "GST invoice · UPI",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 12,
                border: `1px solid ${line}`,
                background: "#ffffff",
                fontSize: 20,
                color: inkSoft,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
