import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import { type TimeRange } from "@/types/analytics.types";

export interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (next: TimeRange) => void;
}

const QUICK_RANGES: { label: string; days: number }[] = [
  { label: "7 días", days: 7 },
  { label: "30 días", days: 30 },
  { label: "1 año", days: 365 },
];

/**
 * V2 time-range filter. Quick chips (7d / 30d / 1y) on the left, an inline
 * "Personalizado" toggle on the right that expands two date inputs when
 * selected.
 */
export const TimeRangeFilter = ({ value, onChange }: TimeRangeFilterProps) => {
  const [custom, setCustom] = useState(Boolean(value.startDate || value.endDate));

  const selectQuick = (days: number) => {
    onChange({ days });
    setCustom(false);
  };

  const toggleCustom = () => {
    const next = !custom;
    setCustom(next);
    if (next) {
      onChange({ startDate: "", endDate: "" });
    } else {
      onChange({ days: 30 });
    }
  };

  const updateCustomDate = (field: "startDate" | "endDate", v: string) => {
    onChange({ ...value, days: undefined, [field]: v });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {QUICK_RANGES.map((r) => {
        const active = !custom && value.days === r.days;
        return (
          <button
            key={r.days}
            type="button"
            onClick={() => selectQuick(r.days)}
            className={cn(
              "px-3.5 py-2 rounded-v2-sm text-[13px] border transition-[background-color,border-color,color] duration-150",
              active
                ? "bg-v2-primary-pale border-v2-primary text-v2-primary-deep font-medium"
                : "bg-v2-surface border-v2-line text-v2-ink-2 hover:border-v2-line-2 hover:text-v2-ink"
            )}
          >
            {r.label}
          </button>
        );
      })}

      <button
        type="button"
        onClick={toggleCustom}
        className={cn(
          "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-v2-sm text-[13px] border transition-[background-color,border-color,color] duration-150",
          custom
            ? "bg-v2-primary-pale border-v2-primary text-v2-primary-deep font-medium"
            : "bg-v2-surface border-v2-line text-v2-ink-2 hover:border-v2-line-2 hover:text-v2-ink"
        )}
      >
        <Calendar size={14} />
        Personalizado
      </button>

      {custom && (
        <>
          <Input
            type="date"
            value={value.startDate ?? ""}
            onChange={(e) => updateCustomDate("startDate", e.target.value)}
            className="max-w-[160px] py-[8px] text-[13px]"
            aria-label="Fecha inicial"
          />
          <Input
            type="date"
            value={value.endDate ?? ""}
            onChange={(e) => updateCustomDate("endDate", e.target.value)}
            className="max-w-[160px] py-[8px] text-[13px]"
            aria-label="Fecha final"
          />
        </>
      )}
    </div>
  );
};
