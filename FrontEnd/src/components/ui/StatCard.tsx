import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  foot?: ReactNode;
  icon?: ReactNode;
  /** Icon-chip background. Defaults to a subtle primary tint. */
  iconAccent?: string;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  foot,
  icon,
  iconAccent,
  className,
}: StatCardProps) => (
  <div
    className={cn(
      "border border-v2-line rounded-v2-lg px-[26px] py-6 bg-v2-surface",
      className
    )}
  >
    <div className="flex items-start justify-between">
      <div className="text-[13px] tracking-[1.5px] text-v2-ink-3 font-medium mb-3.5">
        {label}
      </div>
      {icon && (
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-v2-primary-deep"
          style={{ background: iconAccent ?? "rgba(86,125,241,0.1)" }}
        >
          {icon}
        </div>
      )}
    </div>
    <p className="text-[44px] font-normal m-0 leading-none tracking-[-1px] text-v2-ink">
      {value}
    </p>
    {foot && <div className="text-[13px] text-v2-ink-2 mt-3">{foot}</div>}
  </div>
);
