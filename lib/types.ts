export type SupplyStatus = "verified" | "affiliate" | "quote" | "unavailable";

export type ExamLevel =
  | "foundational"
  | "associate"
  | "professional"
  | "specialty"
  | "expert";

export type CategorySlug =
  | "cloud"
  | "security"
  | "networking"
  | "data"
  | "ai"
  | "devops"
  | "project"
  | "business"
  | "support";

export interface Provider {
  slug: string;
  name: string;
  shortName: string;
  /** Two-letter mark used in the monogram fallback badge. */
  mark: string;
  description: string;
  websiteUrl: string;
  /** Tailwind-friendly hex used for the provider accent. */
  accent: string;
  categories: CategorySlug[];
}

export interface ExamFaq {
  question: string;
  answer: string;
}

export interface Exam {
  slug: string;
  code: string;
  name: string;
  providerSlug: string;
  level: ExamLevel;
  category: CategorySlug;
  /** One-line hook used on cards. */
  summary: string;
  /** 2–3 paragraph description. */
  description: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: string;
  languages: string[];
  /** Indicative official price in INR, inclusive of GST where applicable. */
  officialPriceInr: number;
  officialPriceUsd: number;
  retireAt?: string;
  examUrl: string;
  audience: string;
  studyHours: number;
  skills: string[];
  faqs: ExamFaq[];
  popularity: number;
}

export interface Offer {
  id: string;
  examSlug: string;
  supplierName: string;
  supplyStatus: SupplyStatus;
  /** What we would charge. For quote offers this is an indicative target price. */
  priceInr: number;
  /** Reference price used to compute the saving. */
  compareAtInr: number;
  region: string;
  eligibility: string;
  deliveryEstimate: string;
  voucherValidityDays: number;
  /** ISO date of the last human verification of this offer. */
  lastVerifiedAt: string;
  notes?: string;
}

export interface ExamWithRelations {
  exam: Exam;
  provider: Provider;
  offer: Offer;
  discountPercent: number;
  savingInr: number;
}

export interface Catalog {
  categories: Category[];
  providers: Provider[];
  exams: Exam[];
  offers: Offer[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
}
