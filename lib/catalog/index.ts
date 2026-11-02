import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

import { exams as seedExams } from "@/lib/catalog/exams";
import { offers as seedOffers } from "@/lib/catalog/offers";
import { categories, providers as seedProviders } from "@/lib/catalog/providers";
import type {
  Catalog,
  Category,
  CategorySlug,
  Exam,
  ExamLevel,
  ExamWithRelations,
  Offer,
  Provider,
  SupplyStatus,
} from "@/lib/types";
import { discountPercent } from "@/lib/utils";

const seedCatalog: Catalog = {
  providers: seedProviders,
  exams: seedExams,
  offers: seedOffers,
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function db() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { "x-application-name": "certitude-web" } },
  });
}

function mapExam(row: Record<string, unknown>): Exam {
  return {
    slug: String(row.slug),
    code: String(row.code),
    name: String(row.name),
    providerSlug: String(row.provider_slug),
    level: row.level as ExamLevel,
    category: row.category as CategorySlug,
    summary: String(row.summary ?? ""),
    description: String(row.description ?? ""),
    durationMinutes: Number(row.duration_minutes ?? 0),
    questionCount: Number(row.question_count ?? 0),
    passingScore: String(row.passing_score ?? ""),
    languages: (row.languages as string[]) ?? [],
    officialPriceInr: Number(row.official_price_inr ?? 0),
    officialPriceUsd: Number(row.official_price_usd ?? 0),
    retireAt: (row.retire_at as string) ?? undefined,
    examUrl: String(row.exam_url ?? ""),
    audience: String(row.audience ?? ""),
    studyHours: Number(row.study_hours ?? 0),
    skills: (row.skills as string[]) ?? [],
    faqs: (row.faqs as Exam["faqs"]) ?? [],
    popularity: Number(row.popularity ?? 0),
  };
}

function mapProvider(row: Record<string, unknown>): Provider {
  return {
    slug: String(row.slug),
    name: String(row.name),
    shortName: String(row.short_name ?? row.name),
    mark: String(row.mark ?? ""),
    description: String(row.description ?? ""),
    websiteUrl: String(row.website_url ?? ""),
    accent: String(row.accent ?? "#111827"),
    categories: (row.categories as CategorySlug[]) ?? [],
  };
}

function mapOffer(row: Record<string, unknown>): Offer {
  return {
    id: String(row.id),
    examSlug: String(row.exam_slug),
    supplierName: String(row.supplier_name ?? ""),
    supplyStatus: row.supply_status as SupplyStatus,
    priceInr: Number(row.price_inr ?? 0),
    compareAtInr: Number(row.compare_at_inr ?? 0),
    region: String(row.region ?? "India"),
    eligibility: String(row.eligibility ?? ""),
    deliveryEstimate: String(row.delivery_estimate ?? ""),
    voucherValidityDays: Number(row.voucher_validity_days ?? 365),
    lastVerifiedAt: String(row.last_verified_at ?? new Date().toISOString()),
    notes: (row.notes as string) ?? undefined,
  };
}

async function loadCatalog(): Promise<Catalog> {
  const client = db();
  if (!client) return seedCatalog;

  try {
    const [providersRes, examsRes, offersRes] = await Promise.all([
      client.from("providers").select("*").order("name"),
      client.from("exams").select("*").eq("is_active", true).order("popularity", {
        ascending: false,
      }),
      client.from("offers").select("*").eq("is_active", true),
    ]);

    if (providersRes.error || examsRes.error || offersRes.error) {
      return seedCatalog;
    }
    if (!providersRes.data?.length || !examsRes.data?.length) {
      return seedCatalog;
    }

    return {
      providers: providersRes.data.map(mapProvider),
      exams: examsRes.data.map(mapExam),
      offers: offersRes.data.map(mapOffer),
    };
  } catch {
    // Never let a data-source outage take the public catalogue down.
    return seedCatalog;
  }
}

export const getCatalog = cache(loadCatalog);

export const getProviders = cache(async (): Promise<Provider[]> => {
  const { providers } = await getCatalog();
  return providers;
});

export const getCategories = cache(async (): Promise<Category[]> => categories);

export const getExams = cache(async (): Promise<Exam[]> => {
  const { exams } = await getCatalog();
  return exams;
});

function join(exam: Exam, catalog: Catalog): ExamWithRelations | undefined {
  const provider = catalog.providers.find((p) => p.slug === exam.providerSlug);
  const offer = catalog.offers.find((o) => o.examSlug === exam.slug);
  if (!provider || !offer) return undefined;
  return {
    exam,
    provider,
    offer,
    discountPercent: discountPercent(offer.compareAtInr, offer.priceInr),
    savingInr: Math.max(0, offer.compareAtInr - offer.priceInr),
  };
}

export const getExamCards = cache(async (): Promise<ExamWithRelations[]> => {
  const catalog = await getCatalog();
  return catalog.exams
    .map((exam) => join(exam, catalog))
    .filter((value): value is ExamWithRelations => Boolean(value));
});

export const getExamPage = cache(
  async (slug: string): Promise<ExamWithRelations | undefined> => {
    const catalog = await getCatalog();
    const exam = catalog.exams.find((e) => e.slug === slug);
    if (!exam) return undefined;
    return join(exam, catalog);
  },
);

export const getProviderPage = cache(
  async (
    slug: string,
  ): Promise<
    | {
        provider: Provider;
        exams: ExamWithRelations[];
      }
    | undefined
  > => {
    const catalog = await getCatalog();
    const provider = catalog.providers.find((p) => p.slug === slug);
    if (!provider) return undefined;
    const exams = catalog.exams
      .filter((e) => e.providerSlug === slug)
      .map((exam) => join(exam, catalog))
      .filter((value): value is ExamWithRelations => Boolean(value))
      .sort((a, b) => b.exam.popularity - a.exam.popularity);
    return { provider, exams };
  },
);

export const getCategoryPage = cache(
  async (
    slug: string,
  ): Promise<
    | {
        category: Category;
        exams: ExamWithRelations[];
      }
    | undefined
  > => {
    const catalog = await getCatalog();
    const category = categories.find((c) => c.slug === slug);
    if (!category) return undefined;
    const exams = catalog.exams
      .filter((e) => e.category === slug)
      .map((exam) => join(exam, catalog))
      .filter((value): value is ExamWithRelations => Boolean(value))
      .sort((a, b) => b.exam.popularity - a.exam.popularity);
    return { category, exams };
  },
);

export interface CatalogFilters {
  q?: string;
  provider?: string;
  category?: string;
  level?: string;
  supply?: string;
  sort?: "popular" | "price-asc" | "price-desc" | "saving" | "name";
}

export function filterExamCards(
  cards: ExamWithRelations[],
  filters: CatalogFilters,
): ExamWithRelations[] {
  const q = filters.q?.trim().toLowerCase();

  let result = cards.filter(({ exam, provider, offer }) => {
    if (filters.provider && exam.providerSlug !== filters.provider) return false;
    if (filters.category && exam.category !== filters.category) return false;
    if (filters.level && exam.level !== filters.level) return false;
    if (filters.supply && offer.supplyStatus !== filters.supply) return false;
    if (!q) return true;
    const haystack = [
      exam.name,
      exam.code,
      exam.summary,
      provider.name,
      provider.shortName,
      ...exam.skills,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const sort = filters.sort ?? "popular";
  result = [...result].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.offer.priceInr - b.offer.priceInr;
      case "price-desc":
        return b.offer.priceInr - a.offer.priceInr;
      case "saving":
        return b.savingInr - a.savingInr;
      case "name":
        return a.exam.name.localeCompare(b.exam.name);
      default:
        return b.exam.popularity - a.exam.popularity;
    }
  });

  return result;
}

export interface CatalogStats {
  examCount: number;
  providerCount: number;
  totalSaving: number;
  maxDiscount: number;
  minPrice: number;
}

export const getCatalogStats = cache(async (): Promise<CatalogStats> => {
  const cards = await getExamCards();
  const quoteCards = cards.filter((c) => c.offer.supplyStatus === "quote");
  const savings = quoteCards.map((c) => c.savingInr);
  return {
    examCount: cards.length,
    providerCount: new Set(cards.map((c) => c.provider.slug)).size,
    totalSaving: savings.reduce((a, b) => a + b, 0),
    maxDiscount: Math.max(0, ...cards.map((c) => c.discountPercent)),
    minPrice: Math.min(...cards.map((c) => c.offer.priceInr)),
  };
});

export { categories } from "@/lib/catalog/providers";
export { getProvider, getCategory } from "@/lib/catalog/providers";
