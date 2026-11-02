import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-ink-500">
        <Compass className="h-6 w-6" />
      </span>
      <p className="eyebrow mt-6">404</p>
      <h1 className="display mt-3 text-4xl text-ink-950">
        That page isn&rsquo;t in the catalogue.
      </h1>
      <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-600">
        The exam may have been renamed, retired, or the link may be mistyped. Try
        the full catalogue or search by exam code.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <ButtonLink href="/exams">
          Browse exams
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink-700 hover:border-ink-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
