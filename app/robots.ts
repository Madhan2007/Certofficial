import type { MetadataRoute } from "next";

import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  const base = brand.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/account", "/checkout", "/track"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
