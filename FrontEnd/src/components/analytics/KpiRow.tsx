import { Clock, Brain, Trophy, Flame } from "lucide-react";
import { type ReactNode } from "react";

export interface KpiRowProps {
  totalMinutes: number;
  totalSessions: number;
  averageScore: number | null;
  activeDays: number;
  windowDays: number;
  loading?: boolean;
}

const formatHM = (mins: number) => {
  if (mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const Kpi = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
}) => (
  <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-5">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-md bg-v2-primary-pale text-v2-primary-deep flex items-center justify-center">
        {icon}
      </div>
      <span className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 font-medium">
        {label}
      </span>
    </div>
    <div className="text-[28px] font-medium text-v2-ink leading-none tabular-nums">
      {value}
    </div>
    {hint && (
      <div className="text-[11px] text-v2-ink-3 mt-2">{hint}</div>
    )}
  </div>
);

const Skel = () => (
  <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-5 animate-pulse">
    <div className="h-3 w-1/3 bg-v2-line rounded mb-4" />
    <div className="h-7 w-1/2 bg-v2-line rounded" />
  </div>
);

/**
 * Top-of-page KPI row for Analysis. Four stats summarising the active
 * time-range window: total study time, sessions, average test score,
 * active days.
 */
export const KpiRow = ({
  totalMinutes,
  totalSessions,
  averageScore,
  activeDays,
  windowDays,
  loading,
}: KpiRowProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skel key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Kpi
        icon={<Clock size={14} />}
        label="Tiempo"
        value={formatHM(totalMinutes)}
        hint={`En los últimos ${windowDays} días`}
      />
      <Kpi
        icon={<Brain size={14} />}
        label="Sesiones"
        value={totalSessions}
      />
      <Kpi
        icon={<Trophy size={14} />}
        label="Score promedio"
        value={averageScore !== null ? `${averageScore}%` : "—"}
        hint={averageScore === null ? "Sin tests aún" : undefined}
      />
      <Kpi
        icon={<Flame size={14} />}
        label="Días activos"
        value={`${activeDays}/${windowDays}`}
      />
    </div>
  );
};
