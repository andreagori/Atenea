import { useEffect, useState } from "react";
import { Clock, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PomodoroStatus {
  isOnBreak: boolean;
  timeRemaining: number;
  currentPhase: "study" | "break" | "not_started";
  currentCycle: number;
}

export interface PomodoroTimerProps {
  status: PomodoroStatus | null;
  onTimerComplete?: () => void;
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

/**
 * Pomodoro countdown pill. The server is the source of truth for the
 * remaining time — this component just decrements locally between server
 * syncs and fires `onTimerComplete` once when local time hits zero, so the
 * parent can re-fetch status/cards.
 */
export const PomodoroTimer = ({
  status,
  onTimerComplete,
}: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (status?.timeRemaining !== undefined) {
      setTimeLeft(status.timeRemaining);
      setFired(false);
    }
  }, [status]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0 && !fired && onTimerComplete) {
          setFired(true);
          setTimeout(onTimerComplete, 500);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [fired, onTimerComplete]);

  const onBreak = status?.isOnBreak ?? false;
  const isUp = timeLeft <= 0;

  return (
    <div className="inline-flex items-center gap-4 bg-v2-surface border border-v2-line rounded-v2-md px-5 py-2.5 shadow-v2-sm">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            onBreak ? "bg-v2-green" : "bg-v2-primary",
            isUp && "animate-pulse"
          )}
        />
        <span
          className={cn(
            "font-v2-mono text-[11px] tracking-[1.5px] uppercase font-medium",
            onBreak ? "text-[color:var(--color-v2-green)]" : "text-v2-primary-deep"
          )}
        >
          {onBreak ? "Descanso" : "Estudio"}
        </span>
      </div>

      <span className="w-px h-6 bg-v2-line" />

      <span
        className={cn(
          "text-[24px] font-v2-mono font-medium tabular-nums",
          isUp
            ? "text-v2-coral animate-pulse"
            : onBreak
              ? "text-[color:var(--color-v2-green)]"
              : "text-v2-primary-deep"
        )}
      >
        {formatTime(timeLeft)}
      </span>

      <span className="w-px h-6 bg-v2-line" />

      <div className="inline-flex items-center gap-1 text-v2-ink-2">
        <RotateCw size={14} />
        <span className="font-v2-mono text-[12px] tabular-nums">
          {status?.currentCycle ?? 1}
        </span>
      </div>

      <span className="hidden sm:inline-flex items-center gap-1.5 ml-1 pl-3 border-l border-v2-line text-v2-ink-3">
        <Clock size={12} />
        <span className="font-v2-mono text-[10px] tracking-[1px] uppercase">
          Ciclo
        </span>
      </span>
    </div>
  );
};
