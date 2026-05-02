import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

export interface ShowToastOptions {
  kind?: ToastKind;
  /** How long the toast stays visible before auto-dismiss. Default 3000ms. */
  durationMs?: number;
}

interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

interface ToastContextValue {
  showToast: (text: string, opts?: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_STYLES: Record<ToastKind, string> = {
  success: "bg-v2-green text-white",
  error: "bg-v2-coral text-white",
  info: "bg-v2-ink text-white",
};

const KIND_ICON: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const ToastItem = ({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-v2-sm shadow-v2-md min-w-[260px] max-w-[420px]",
      "animate-v2-fade",
      KIND_STYLES[toast.kind]
    )}
  >
    <span className="flex-shrink-0">{KIND_ICON[toast.kind]}</span>
    <span className="text-[14px] leading-tight flex-1">{toast.text}</span>
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar notificación"
      className="flex-shrink-0 p-1 rounded hover:bg-white/15 transition-colors"
    >
      <X size={14} />
    </button>
  </div>
);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Track timers so we can clear them on manual dismiss / unmount.
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback<ToastContextValue["showToast"]>(
    (text, opts) => {
      const id = Date.now() + Math.random();
      const kind = opts?.kind ?? "info";
      const duration = opts?.durationMs ?? 3000;
      setToasts((prev) => [...prev, { id, kind, text }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  // Clear pending timers if the provider unmounts.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onClose={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Returns a `showToast(text, opts?)` callback.
 * Throws if used outside of <ToastProvider>.
 */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a <ToastProvider>");
  }
  return ctx.showToast;
};
