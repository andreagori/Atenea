import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const baseInputClasses = [
  "w-full px-3.5 py-[11px]",
  "border border-v2-line rounded-v2-sm",
  "bg-v2-surface text-sm text-v2-ink",
  "transition-[border-color,box-shadow] duration-150",
  "focus:outline-none focus:border-v2-primary focus:ring-[3px] focus:ring-v2-primary/[0.12]",
  "disabled:opacity-60 disabled:cursor-not-allowed",
  "placeholder:text-v2-ink-3",
].join(" ");

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseInputClasses, className)} {...props} />
));
Input.displayName = "Input";

export { baseInputClasses };
