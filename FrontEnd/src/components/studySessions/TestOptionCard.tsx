import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "selected-pending" | "correct" | "incorrect" | "muted";

export interface TestOptionCardProps {
  content: string;
  type: string; // 'visualCard' | 'activeRecall' | 'cornell' | ...
  status: Status;
  onClick: () => void;
  disabled?: boolean;
  index: number;
}

const LETTERS = ["A", "B", "C", "D"];

const statusToClasses = (s: Status) => {
  switch (s) {
    case "correct":
      return "border-v2-green/60 bg-v2-green/[0.08]";
    case "incorrect":
      return "border-v2-coral/60 bg-v2-coral/[0.08]";
    case "selected-pending":
      return "border-v2-primary bg-v2-primary-pale";
    case "muted":
      return "border-v2-line bg-v2-surface opacity-50";
    case "idle":
    default:
      return "border-v2-line bg-v2-surface hover:border-v2-line-2 hover:bg-v2-paper/50";
  }
};

/**
 * One answer option in the simulated-test view. Renders either text or an
 * image (when type === 'visualCard'). Holds a letter badge on the left and
 * a result icon on the right once the answer has been graded.
 */
export const TestOptionCard = ({
  content,
  type,
  status,
  onClick,
  disabled,
  index,
}: TestOptionCardProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full text-left rounded-v2-md border-2 p-4 sm:p-5 transition-[border-color,background-color,box-shadow] duration-150",
      "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-v2-primary/[0.18]",
      "disabled:cursor-not-allowed",
      statusToClasses(status)
    )}
  >
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center font-v2-mono text-[14px] font-medium border",
          status === "correct"
            ? "bg-v2-green/15 text-[color:var(--color-v2-green)] border-v2-green/30"
            : status === "incorrect"
              ? "bg-v2-coral/15 text-v2-coral border-v2-coral/30"
              : status === "selected-pending"
                ? "bg-v2-primary text-white border-v2-primary"
                : "bg-v2-bg text-v2-ink-2 border-v2-line"
        )}
      >
        {LETTERS[index] ?? index + 1}
      </span>
      <div className="flex-1 min-w-0">
        {type === "visualCard" ? (
          <img
            src={content}
            alt={`Opción ${LETTERS[index] ?? index + 1}`}
            className="max-h-40 max-w-full object-contain rounded-md"
          />
        ) : (
          <p className="text-[15px] text-v2-ink m-0 leading-[1.45]">
            {content}
          </p>
        )}
      </div>
      {status === "correct" && (
        <Check size={20} className="text-[color:var(--color-v2-green)] flex-shrink-0" />
      )}
      {status === "incorrect" && (
        <X size={20} className="text-v2-coral flex-shrink-0" />
      )}
    </div>
  </button>
);
