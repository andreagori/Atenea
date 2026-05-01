import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Field = ({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: FieldProps) => (
  <div className={cn("mb-4", className)}>
    {label && (
      <label
        htmlFor={htmlFor}
        className="block text-sm text-v2-ink mb-1.5 font-medium"
      >
        {label}
      </label>
    )}
    {children}
    {error ? (
      <div className="text-xs text-v2-coral mt-1.5">{error}</div>
    ) : hint ? (
      <div className="text-xs text-v2-ink-2 mt-1.5">{hint}</div>
    ) : null}
  </div>
);
