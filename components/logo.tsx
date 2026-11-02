import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="currentColor"
        className="text-ink-900"
      />
      <path
        d="M9.5 16.4l4.3 4.3 8.7-9"
        stroke="#34A97F"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="9" r="2.2" fill="#F4F1E9" />
    </svg>
  );
}

export function Wordmark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={invert ? "[&_rect]:fill-white" : undefined} />
      <span
        className={cn(
          "text-[19px] font-semibold tracking-[-0.02em]",
          invert ? "text-white" : "text-ink-900",
        )}
      >
        Certitude
      </span>
    </span>
  );
}
