import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const field =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-cream";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(field, "select-control pr-9", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-[13px] font-medium text-ink-700", className)}
      {...props}
    />
  );
}

export function FieldHint({
  className,
  ...props
}: ComponentProps<"p">) {
  return <p className={cn("mt-1.5 text-xs text-ink-400", className)} {...props} />;
}

export function FieldError({
  className,
  ...props
}: ComponentProps<"p">) {
  return <p className={cn("mt-1.5 text-xs font-medium text-red-600", className)} {...props} />;
}
