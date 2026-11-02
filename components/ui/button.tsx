import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_1px_2px_rgba(7,12,21,0.18)] hover:bg-brand-700 active:translate-y-px",
  dark: "bg-ink-900 text-white hover:bg-ink-800 active:translate-y-px",
  outline:
    "border border-line-strong bg-white/60 text-ink-900 hover:border-ink-400 hover:bg-white",
  ghost: "text-ink-700 hover:bg-cream hover:text-ink-900",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
