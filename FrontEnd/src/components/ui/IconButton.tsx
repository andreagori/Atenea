import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full border",
    "transition-[background-color,border-color,color] duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-v2-primary/[0.18]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-v2-surface border-v2-line text-v2-ink-2 hover:text-v2-primary-deep hover:border-v2-primary-soft",
        ghost:
          "bg-transparent border-transparent text-v2-ink-2 hover:bg-black/[0.04] hover:text-v2-ink",
        danger:
          "bg-transparent border-transparent text-v2-ink-2 hover:bg-v2-coral/10 hover:text-v2-coral",
      },
      size: {
        sm: "w-7 h-7",
        default: "w-[34px] h-[34px]",
        lg: "w-10 h-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
IconButton.displayName = "IconButton";

export { iconButtonVariants };
