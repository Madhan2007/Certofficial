import type { MetadataRoute } from "next";

import { brand } from "@/lib/brand";
import { categories, getExamCards, getProviders } from "@/lib/catalog";
import { legalDocuments } from "@/lib/legal";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = brand.url.replace(/\/$/, "");
  const [cards, providers] = await Promise.all([getExamCards(), getProviders()]);

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/exams", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/providers", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/trust", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/quote", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...cards.map((card) => ({
      url: `${base}/exams/${card.exam.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...providers.map((provider) => ({
      url: `${base}/providers/${provider.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...categories.map((category) => ({
      url: `${base}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...legalDocuments.map((doc) => ({
      url: `${base}/legal/${doc.slug}`,
      lastModified: new Date(doc.updated),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
