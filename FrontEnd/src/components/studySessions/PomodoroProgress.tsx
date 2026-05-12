interface Progress {
  currentCycle: number;
  isOnBreak: boolean;
  studyTimeElapsed: number;
  breakTimeElapsed: number;
  totalCards: number;
  reviewedCards: number;
  uniqueCardsReviewed: number;
}

export interface PomodoroProgressProps {
  progress: Progress | null;
}

const Stat = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="text-[18px] font-medium text-v2-ink tabular-nums leading-none">
      {value}
    </div>
    <div className="font-v2-mono text-[10px] tracking-[1px] uppercase text-v2-ink-3 mt-1">
      {label}
    </div>
  </div>
);

/** Compact progress strip rendered below the runtime card. */
export const PomodoroProgress = ({ progress }: PomodoroProgressProps) => {
  if (!progress) return null;
  const pct =
    progress.totalCards > 0
      ? Math.min(100, (progress.uniqueCardsReviewed / progress.totalCards) * 100)
      : 0;

  return (
    <div className="bg-v2-surface border border-v2-line rounded-v2-md p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 font-medium">
          Progreso · Ciclo {progress.currentCycle}
        </span>
        <span className="text-[12px] text-v2-ink-2 tabular-nums">
          {progress.uniqueCardsReviewed}/{progress.totalCards} cartas
        </span>
      </div>

      <div className="h-1.5 bg-v2-line rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-v2-primary transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Stat value={progress.uniqueCardsReviewed} label="Únicas" />
        <Stat value={progress.reviewedCards} label="Total" />
        <Stat value={`${progress.studyTimeElapsed}m`} label="Estudio" />
        <Stat value={`${progress.breakTimeElapsed}m`} label="Descanso" />
      </div>
    </div>
  );
};
