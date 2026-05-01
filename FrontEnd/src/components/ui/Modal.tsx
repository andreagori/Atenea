import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Disable click-outside close. */
  staticBackdrop?: boolean;
  /** Override the max-width (default 520px). */
  maxWidth?: number | string;
  /** Hide the default close button in the header (only relevant if title is set). */
  hideCloseButton?: boolean;
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  className,
  staticBackdrop,
  maxWidth = 520,
  hideCloseButton,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (staticBackdrop) return;
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[rgba(13,21,41,0.4)] backdrop-blur-md animate-v2-fade"
    >
      <div
        className={cn(
          "bg-v2-surface rounded-[20px] px-8 py-7 w-full shadow-v2-lg",
          className
        )}
        style={{
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
        }}
      >
        {title && (
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-[22px] font-medium m-0 leading-tight">
              {title}
            </h3>
            {!hideCloseButton && (
              <IconButton
                onClick={onClose}
                aria-label="Cerrar"
                variant="ghost"
              >
                <X size={18} />
              </IconButton>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
