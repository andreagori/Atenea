import { X, Minus, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type Rating = "dificil" | "masomenos" | "bien" | "facil";

const LEVELS: {
  id: Rating;
  label: string;
  icon: typeof X;
  /** Tailwind classes for the active state (border + bg + text). */
  classes: string;
}[] = [
  {
    id: "dificil",
    label: "Difícil",
    icon: X,
    classes:
      "border-v2-coral/30 bg-v2-coral/[0.06] text-v2-coral hover:bg-v2-coral/[0.10] hover:border-v2-coral/50",
  },
  {
    id: "masomenos",
    label: "Más o menos",
    icon: Minus,
    classes:
      "border-v2-amber/40 bg-v2-amber/[0.08] text-[color:var(--color-v2-amber)] hover:bg-v2-amber/[0.14] hover:border-v2-amber/60",
  },
  {
    id: "bien",
    label: "Bien",
    icon: Check,
    classes:
      "border-v2-green/40 bg-v2-green/[0.08] text-[color:var(--color-v2-green)] hover:bg-v2-green/[0.14] hover:border-v2-green/60",
  },
  {
    id: "facil",
    label: "Fácil",
    icon: Zap,
    classes:
      "border-v2-primary-soft bg-v2-primary-pale text-v2-primary-deep hover:bg-v2-primary/[0.14] hover:border-v2-primary",
  },
];

export interface RatingMenuProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

/**
 * Four self-evaluation buttons shown after the answer is revealed.
 * Colors run cool-to-warm: Difícil (coral) → Más o menos (amber) →
 * Bien (green) → Fácil (primary). All buttons share the same shape; the
 * accent is the color of their state.
 */
export const RatingMenu = ({ onRate, disabled }: RatingMenuProps) => (
  <div>
    <div className="text-center mb-3">
      <h3 className="text-[15px] font-medium text-v2-ink m-0">
        ¿Qué tan bien recordaste esta carta?
      </h3>
      <p className="text-xs text-v2-ink-3 m-0 mt-1">
        Difícil la verás pronto · Fácil la verás en más tiempo.
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {LEVELS.map(({ id, label, icon: Icon, classes }) => (
        <button
          key={id}
          type="button"
          onClick={() => onRate(id)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-v2-sm border-2 transition-[background-color,border-color,color] duration-150",
            "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-v2-primary/[0.18]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            classes
          )}
        >
          <Icon size={18} />
          <span className="text-[13px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);
