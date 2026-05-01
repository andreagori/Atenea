import { cn } from "@/lib/utils";

export interface ProgressProps {
  /**
   * Current value. If `max` is omitted: values 0–1 are treated as a fraction,
   * values > 1 are treated as a percentage on a 0–100 scale.
   */
  value: number;
  /** Explicit total; when provided, `value` is interpreted on this scale. */
  max?: number;
  className?: string;
  /** Bar height in px (default 20). */
  height?: number;
  /** Optional accessible label for screen readers. */
  ariaLabel?: string;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export const Progress = ({
  value,
  max,
  className,
  height = 20,
  ariaLabel,
}: ProgressProps) => {
  const pct = max
    ? clamp(value / max, 0, 1) * 100
    : value <= 1
      ? clamp(value, 0, 1) * 100
      : clamp(value, 0, 100);
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max ?? 100}
      aria-valuenow={max ? value : pct}
      className={cn(
        "rounded-v2-sm bg-v2-line overflow-hidden relative",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full rounded-v2-sm transition-[width] duration-300"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, var(--color-v2-primary), var(--color-v2-primary-soft))",
        }}
      />
    </div>
  );
};
