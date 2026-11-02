"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";

import { Wordmark } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/exams", label: "Exams" },
  { href: "/providers", label: "Providers" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/trust", label: "Trust centre" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink-900 text-white">
        <div className="container-page flex h-9 items-center justify-center gap-2 text-center text-[12px] tracking-wide text-white/80">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-400" />
          <span>
            We are onboarding verified suppliers. Every price and validity is
            confirmed in writing before you pay.
          </span>
        </div>
      </div>

      <div className="border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Certitude home" className="shrink-0">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-cream text-ink-900"
                      : "text-ink-600 hover:text-ink-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink href="/track" variant="ghost" size="sm">
              Track order
            </ButtonLink>
            <ButtonLink href="/quote" variant="primary" size="sm">
              Get a quote
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-ink-700 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-b border-line bg-paper lg:hidden"
        >
          <nav className="container-page flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-3 text-[15px] text-ink-800 hover:bg-cream"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/track"
              className="rounded-lg px-2 py-3 text-[15px] text-ink-800 hover:bg-cream"
            >
              Track order
            </Link>
            <div className="mt-2 flex gap-2 pb-2">
              <ButtonLink href="/quote" className="flex-1" size="md">
                Get a quote
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
