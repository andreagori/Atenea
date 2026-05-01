import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-xs font-medium px-2.5 py-1",
  {
    variants: {
      variant: {
        default: "bg-v2-primary/10 text-v2-primary-deep",
        violet: "bg-v2-violet/[0.14] text-[oklch(0.5_0.18_295)]",
        magenta: "bg-v2-magenta/[0.12] text-[oklch(0.5_0.20_320)]",
        coral: "bg-v2-coral/[0.12] text-[oklch(0.55_0.20_25)]",
        green: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.42_0.12_155)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface PillProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(pillVariants({ variant }), className)}
      {...props}
    />
  )
);
Pill.displayName = "Pill";

export { pillVariants };
