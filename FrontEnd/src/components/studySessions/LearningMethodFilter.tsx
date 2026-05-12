import { BookOpen, Layers, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LearningMethod } from "@/types/studySessions.types";

const METHODS: {
  value: LearningMethod;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { value: LearningMethod.ACTIVE_RECALL, label: "Repaso Activo", icon: BookOpen },
  { value: LearningMethod.CORNELL, label: "Cornell", icon: Layers },
  { value: LearningMethod.VISUAL_CARD, label: "Visual", icon: ImageIcon },
];

export interface LearningMethodFilterProps {
  value: LearningMethod[];
  onChange: (next: LearningMethod[]) => void;
}

/**
 * Pick which card types to include in the session. Shared by all three
 * study-session config dialogs (Regular, Pomodoro, Simulada).
 */
export const LearningMethodFilter = ({
  value,
  onChange,
}: LearningMethodFilterProps) => {
  const toggle = (m: LearningMethod) => {
    onChange(value.includes(m) ? value.filter((v) => v !== m) : [...value, m]);
  };

  const toggleAll = () => {
    onChange(value.length === METHODS.length ? [] : METHODS.map((m) => m.value));
  };

  const allSelected = value.length === METHODS.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-v2-mono text-[11px] tracking-[1.2px] uppercase text-v2-ink-3 font-medium">
          Tipos de carta
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="text-[12px] text-v2-primary-deep hover:text-v2-primary transition-colors"
        >
          {allSelected ? "Deseleccionar todas" : "Seleccionar todas"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map(({ value: v, label, icon: Icon }) => {
          const active = value.includes(v);
          return (
            <button
              key={v}
              type="button"
              onClick={() => toggle(v)}
              className={cn(
                "flex flex-col items-start gap-1.5 px-3 py-3 rounded-v2-sm border text-left transition-[background-color,border-color,color] duration-150",
                active
                  ? "bg-v2-primary-pale border-v2-primary text-v2-primary-deep"
                  : "bg-v2-surface border-v2-line text-v2-ink-2 hover:border-v2-line-2 hover:text-v2-ink"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center",
                  active ? "bg-v2-primary text-white" : "bg-v2-bg text-v2-ink-2"
                )}
              >
                <Icon size={16} />
              </div>
              <span className="text-[13px] font-medium leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
