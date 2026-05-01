import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

/**
 * Password input with an eye-icon visibility toggle.
 * Visually matches the V2 `Input` primitive but sized slightly larger
 * (`py-[14px]` text-[15px]) to fit the auth split-layout treatment.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full pl-4 pr-11 py-[14px] text-[15px]",
            "border-[1.5px] border-v2-line rounded-v2-sm",
            "bg-v2-surface text-v2-ink",
            "transition-[border-color,box-shadow] duration-150",
            "focus:outline-none focus:border-v2-primary focus:ring-[4px] focus:ring-v2-primary/[0.15]",
            "placeholder:text-v2-ink-3",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-v2-ink-3 hover:text-v2-ink-2 transition-colors"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
