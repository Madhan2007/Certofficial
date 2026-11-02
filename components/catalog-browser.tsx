"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { ExamCard } from "@/components/exam-card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import type { Category, ExamWithRelations, Provider } from "@/lib/types";
import { LEVEL_LABEL } from "@/components/exam-meta";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "saving", label: "Biggest saving" },
  { value: "name", label: "A–Z" },
] as const;

type Filters = {
  q: string;
  provider: string;
  category: string;
  level: string;
  sort: string;
};

const EMPTY_FILTERS: Filters = {
  q: "",
  provider: "",
  category: "",
  level: "",
  sort: "popular",
};

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q") ?? "",
    provider: params.get("provider") ?? "",
    category: params.get("category") ?? "",
    level: params.get("level") ?? "",
    sort: params.get("sort") ?? "popular",
  };
}

export function CatalogBrowser({
  items,
  providers,
  categories,
  lockedProvider,
  lockedCategory,
}: {
  items: ExamWithRelations[];
  providers: Provider[];
  categories: Category[];
  lockedProvider?: string;
  lockedCategory?: string;
}) {
  const pathname = usePathname();

  // Filters live in local state so the full grid is present in the server HTML.
  // The URL is read after hydration and kept in sync with history.replaceState.
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { provider, category, level, sort } = filters;

  const setParam = useCallback(
    (key: keyof Filters, value: string) => {
      setFilters((current) => {
        const next = { ...current, [key]: value };
        const params = new URLSearchParams();
        if (next.q) params.set("q", next.q);
        if (next.provider) params.set("provider", next.provider);
        if (next.category) params.set("category", next.category);
        if (next.level) params.set("level", next.level);
        if (next.sort && next.sort !== "popular") params.set("sort", next.sort);
        const qs = params.toString();
        window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
        return next;
      });
    },
    [pathname],
  );

  useEffect(() => {
    const sync = () => {
      const next = readFilters();
      setFilters(next);
      setQuery(next.q);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    if (query === filters.q) return;
    const timer = setTimeout(() => setParam("q", query), 280);
    return () => clearTimeout(timer);
  }, [query, filters.q, setParam]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter(({ exam, provider: p }) => {
      if (provider && exam.providerSlug !== provider) return false;
      if (category && exam.category !== category) return false;
      if (level && exam.level !== level) return false;
      if (!q) return true;
      return [exam.name, exam.code, exam.summary, p.name, p.shortName, ...exam.skills]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return [...filtered].sort((a, b) => {
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
  }, [items, query, provider, category, level, sort]);

  const activeFilters = [
    provider
      ? {
          key: "provider" as const,
          label: providers.find((p) => p.slug === provider)?.shortName ?? provider,
        }
      : null,
    category
      ? {
          key: "category" as const,
          label: categories.find((c) => c.slug === category)?.name ?? category,
        }
      : null,
    level
      ? {
          key: "level" as const,
          label: LEVEL_LABEL[level as keyof typeof LEVEL_LABEL] ?? level,
        }
      : null,
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  function resetAll() {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    window.history.replaceState(null, "", pathname);
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by exam name, code or skill — e.g. SAA-C03"
            className="h-11 pl-10"
            aria-label="Search exams"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 hover:bg-cream hover:text-ink-700"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onChange={(event) => setParam("sort", event.target.value)}
            aria-label="Sort exams"
            className="h-11 w-full sm:w-48"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 px-4"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "mt-3 gap-3 rounded-xl border border-line bg-white p-4 sm:grid sm:grid-cols-3",
          showFilters ? "grid" : "hidden sm:grid",
        )}
      >
        {!lockedProvider && (
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Provider
            </label>
            <Select
              value={provider}
              onChange={(event) => setParam("provider", event.target.value)}
            >
              <option value="">All providers</option>
              {providers.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.shortName}
                </option>
              ))}
            </Select>
          </div>
        )}
        {!lockedCategory && (
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Category
            </label>
            <Select
              value={category}
              onChange={(event) => setParam("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-ink-400">
            Level
          </label>
          <Select
            value={level}
            onChange={(event) => setParam("level", event.target.value)}
          >
            <option value="">All levels</option>
            {Object.entries(LEVEL_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <p className="text-[13px] text-ink-500">
          <span className="font-semibold text-ink-900">{results.length}</span>{" "}
          {results.length === 1 ? "exam" : "exams"}
        </p>
        {activeFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setParam(filter.key, "")}
            className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[12px] text-ink-600 hover:bg-line"
          >
            {filter.label}
            <X className="h-3 w-3" />
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="text-[12px] font-medium text-brand-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-ink-800">
            No exams match that search.
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">
            Try an exam code like <span className="font-mono">AZ-104</span>, or
            clear the filters to see the full catalogue.
          </p>
          <Button variant="outline" className="mt-5" onClick={resetAll}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <ExamCard key={item.exam.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
