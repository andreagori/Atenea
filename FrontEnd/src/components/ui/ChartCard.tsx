import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({
  title,
  subtitle,
  actions,
  children,
  className,
}: ChartCardProps) => (
  <div
    className={cn(
      "bg-v2-surface border border-v2-line rounded-v2-lg px-[22px] py-5",
      className
    )}
  >
    {(title || subtitle || actions) && (
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div>
          {title && (
            <h3 className="text-sm font-medium m-0 mb-1 text-v2-ink">{title}</h3>
          )}
          {subtitle && <p className="text-xs text-v2-ink-2 m-0">{subtitle}</p>}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);
