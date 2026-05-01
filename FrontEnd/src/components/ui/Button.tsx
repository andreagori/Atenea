import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-v2-sm text-sm font-medium",
    "border border-transparent",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150",
    "whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-v2-primary/[0.18]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-v2-primary text-white hover:bg-v2-primary-deep",
        secondary:
          "bg-v2-surface text-v2-primary-deep border-v2-line hover:border-v2-primary-soft",
        ghost:
          "bg-transparent text-v2-ink-2 hover:bg-black/[0.04] hover:text-v2-ink",
        success: "bg-v2-green text-white hover:opacity-90",
        outline:
          "bg-transparent text-v2-primary-deep border-v2-primary-soft hover:bg-v2-primary/[0.06]",
        onBlue:
          "bg-white text-v2-primary-deep hover:bg-v2-primary-tint",
        danger: "bg-v2-coral text-white hover:opacity-90",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        default: "px-[18px] py-[10px]",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
