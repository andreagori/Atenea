import { Brain, Clock, ClipboardList, Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StudyMode = "regular" | "pomodoro" | "simuladas";

const METHODS: {
  id: StudyMode;
  title: string;
  description: string;
  icon: typeof Brain;
}[] = [
  {
    id: "regular",
    title: "Memorización espaciada",
    description: "Repaso activo a tu ritmo, con repeticiones espaciadas.",
    icon: Brain,
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    description: "Ciclos de estudio y descanso. Estudia 25, descansa 5.",
    icon: Clock,
  },
  {
    id: "simuladas",
    title: "Prueba simulada",
    description: "Opción múltiple cronometrada. Cantidad y tiempo a tu medida.",
    icon: ClipboardList,
  },
];

export interface MethodPickerProps {
  /** Current selection (null = nothing chosen yet). */
  value: StudyMode | null;
  onChange: (mode: StudyMode) => void;
  /** Open the per-method config dialog. */
  onConfigure: (mode: StudyMode) => void;
  /**
   * IDs of methods the user has explicitly customized. Shown as a "Personalizada"
   * pill so they know their config is in effect.
   */
  customized?: Set<StudyMode>;
  /** Disable interaction (e.g. while no deck is selected). */
  disabled?: boolean;
}

/**
 * Three large method cards. Clicking the card body selects, clicking the cog
 * opens the config dialog. Selection state controls the visible accent ring;
 * custom config is signalled with a small pill in the top-right.
 */
export const MethodPicker = ({
  value,
  onChange,
  onConfigure,
  customized,
  disabled,
}: MethodPickerProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {METHODS.map(({ id, title, description, icon: Icon }) => {
      const active = value === id;
      const isCustom = customized?.has(id) ?? false;
      return (
        <div key={id} className="relative">
          {isCustom && (
            <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-v2-primary text-white text-[10px] font-medium tracking-[0.5px] uppercase">
              <Check size={10} /> Personalizada
            </div>
          )}
          <button
            type="button"
            onClick={() => !disabled && onConfigure(id)}
            disabled={disabled}
            aria-label={`Configurar ${title}`}
            className={cn(
              "absolute top-3 right-3 z-10 inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors",
              "text-v2-ink-2 hover:text-v2-ink hover:bg-black/[0.05]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v2-primary/30",
              disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            <Settings size={16} />
          </button>

          <button
            type="button"
            onClick={() => !disabled && onChange(id)}
            disabled={disabled}
            className={cn(
              "w-full h-full text-left rounded-v2-lg border bg-v2-surface p-5 transition-[border-color,background-color,box-shadow] duration-150",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-v2-primary/[0.18]",
              active
                ? "border-v2-primary bg-v2-primary-pale shadow-v2-sm"
                : "border-v2-line hover:border-v2-line-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-11 h-11 rounded-lg flex items-center justify-center mb-4",
                active
                  ? "bg-v2-primary text-white"
                  : "bg-v2-bg text-v2-primary-deep"
              )}
            >
              <Icon size={22} />
            </div>
            <h3
              className={cn(
                "text-[17px] font-medium m-0 mb-1.5",
                active ? "text-v2-primary-deep" : "text-v2-ink"
              )}
            >
              {title}
            </h3>
            <p className="text-[13.5px] text-v2-ink-2 m-0 leading-[1.5]">
              {description}
            </p>
          </button>
        </div>
      );
    })}
  </div>
);
