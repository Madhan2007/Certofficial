import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "amber" | "outline" | "danger" | "ink";

const tones: Record<Tone, string> = {
  neutral: "bg-cream text-ink-600",
  brand: "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
  amber: "bg-amber-100 text-amber-600",
  outline: "border border-line-strong text-ink-600",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-100",
  ink: "bg-ink-900 text-white",
};

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5 tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
