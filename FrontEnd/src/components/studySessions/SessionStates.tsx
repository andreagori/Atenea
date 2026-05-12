import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * Centered status panels used by all three runtime study session pages.
 * Each one assumes it's mounted inside the V2 AppShell content area, so it
 * lays out a tall flex column without re-creating the page chrome.
 */

const Center = ({ children }: { children: ReactNode }) => (
  <div className="animate-v2-fade flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    {children}
  </div>
);

export const SessionLoading = ({
  message = "Cargando carta…",
}: {
  message?: string;
}) => (
  <Center>
    <Loader2 size={36} className="text-v2-primary animate-spin mb-4" />
    <p className="text-[15px] text-v2-ink-2 m-0">{message}</p>
  </Center>
);

export const SessionError = ({ message }: { message: string }) => (
  <Center>
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-v2-coral/10 text-v2-coral mb-4">
      <AlertCircle size={28} />
    </div>
    <h2 className="text-[22px] font-medium m-0 mb-2 text-v2-ink">
      No se pudo cargar la sesión
    </h2>
    <p className="text-[14px] text-v2-ink-2 m-0 mb-6 max-w-md">{message}</p>
    <Link to="/sesionesEstudio">
      <Button variant="secondary">
        <ArrowLeft size={16} /> Volver a sesiones
      </Button>
    </Link>
  </Center>
);

export interface SessionStat {
  label: string;
  value: string | number;
  /** Tailwind text color class for the value (e.g. "text-v2-primary-deep"). */
  accent?: string;
}

export interface SessionCompleteProps {
  /** Title text — defaults to a friendly completion message. */
  title?: string;
  /** Subtitle / body. */
  description?: string;
  /** Optional stat grid shown above the action button. */
  stats?: SessionStat[];
  /** Optional override action; defaults to "Volver a sesiones". */
  primaryAction?: ReactNode;
}

export const SessionComplete = ({
  title = "¡Sesión completada!",
  description = "Has terminado todas las cartas de esta sesión.",
  stats,
  primaryAction,
}: SessionCompleteProps) => (
  <div className="animate-v2-fade max-w-[640px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-4">
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-v2-green/10 text-[color:var(--color-v2-green)] mb-4">
        <CheckCircle2 size={32} />
      </div>
      <h2 className="text-[28px] font-medium m-0 mb-2 text-v2-ink leading-[1.15]">
        {title}
      </h2>
      <p className="text-[15px] text-v2-ink-2 m-0 max-w-md mx-auto leading-[1.55]">
        {description}
      </p>
    </div>

    {stats && stats.length > 0 && (
      <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-6 shadow-v2-sm mb-6">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={`text-[24px] font-medium tabular-nums leading-none ${s.accent ?? "text-v2-ink"}`}
              >
                {s.value}
              </div>
              <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="flex justify-center">
      {primaryAction ?? (
        <Link to="/sesionesEstudio">
          <Button variant="primary" size="lg">
            <ArrowLeft size={16} /> Volver a sesiones
          </Button>
        </Link>
      )}
    </div>
  </div>
);
