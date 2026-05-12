import { ChartCard } from "@/components/ui";
import {
  type ActivityCalendarData,
  type DeckProgressData,
} from "@/types/analytics.types";
import { V2 } from "../chartTheme";

export interface ActivityChartProps {
  data: ActivityCalendarData[];
  deckProgress: DeckProgressData[];
  loading?: boolean;
  /** Number of trailing days to render in the heatmap. */
  windowDays?: number;
}

const Loading = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="h-44 bg-v2-line/40 rounded-v2-sm animate-pulse" />
    <div className="h-44 bg-v2-line/40 rounded-v2-sm animate-pulse" />
  </div>
);

const sessionsToColor = (sessions: number) => {
  if (sessions <= 0) return V2.line;
  if (sessions <= 2) return `${V2.primary}33`;
  if (sessions <= 5) return `${V2.primary}66`;
  if (sessions <= 10) return `${V2.primary}AA`;
  return V2.primary;
};

const formatDateLong = (d: Date) =>
  d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

/**
 * Activity heatmap (last N days) + top studied decks.
 *
 * Real-data only: days without recorded sessions render as empty (line color)
 * cells, never fabricated. The prototype generated random fake activity for
 * missing days, which violated the "no invented data" rule.
 */
export const ActivityChart = ({
  data,
  deckProgress,
  loading,
  windowDays = 30,
}: ActivityChartProps) => {
  if (loading) {
    return (
      <ChartCard
        title="Actividad y mazos"
        subtitle="Resumen de hábitos recientes"
      >
        <Loading />
      </ChartCard>
    );
  }

  // Build a stable map: date string → real data (or undefined).
  const byDate = new Map<string, ActivityCalendarData>();
  for (const d of data) {
    byDate.set(d.date.slice(0, 10), d);
  }

  const today = new Date();
  const days: { date: Date; key: string; sessions: number; minutes: number }[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const hit = byDate.get(key);
    days.push({
      date: d,
      key,
      sessions: hit?.sessions ?? 0,
      minutes: hit?.minutes ?? 0,
    });
  }

  // Group into rows of 7 (weeks).
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const activeDays = days.filter((d) => d.sessions > 0).length;
  const topDecks = [...deckProgress]
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 5);

  return (
    <ChartCard
      title="Actividad y mazos"
      subtitle={`${activeDays}/${windowDays} días activos`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6">
        {/* Heatmap */}
        <div>
          <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 mb-3">
            Calendario · últimos {windowDays} días
          </div>
          <div className="inline-block">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex gap-1 mb-1">
                {week.map((day) => (
                  <div
                    key={day.key}
                    className="w-5 h-5 rounded-[4px] relative group transition-transform hover:scale-110"
                    style={{ background: sessionsToColor(day.sessions) }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-v2-ink text-white text-[11px] rounded shadow-v2-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-10">
                      {formatDateLong(day.date)}
                      {day.sessions > 0
                        ? ` · ${day.sessions} ${day.sessions === 1 ? "sesión" : "sesiones"} · ${day.minutes}m`
                        : " · sin actividad"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-[11px] text-v2-ink-3">
            <span>Menos</span>
            {[0, 1, 4, 8, 12].map((s) => (
              <span
                key={s}
                className="w-3 h-3 rounded-[3px]"
                style={{ background: sessionsToColor(s) }}
              />
            ))}
            <span>Más</span>
          </div>
        </div>

        {/* Top decks */}
        <div>
          <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 mb-3">
            Mazos más estudiados
          </div>
          {topDecks.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-[13px] text-v2-ink-3">
              Sin sesiones registradas todavía.
            </div>
          ) : (
            <div className="space-y-2.5">
              {topDecks.map((deck, i) => {
                const max = topDecks[0]?.totalSessions || 1;
                const pct = Math.min((deck.totalSessions / max) * 100, 100);
                return (
                  <div
                    key={deck.deckTitle}
                    className="bg-v2-bg border border-v2-line rounded-v2-sm px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="inline-flex w-5 h-5 rounded-md bg-v2-primary-pale text-v2-primary-deep items-center justify-center font-v2-mono text-[11px] font-medium">
                          {i + 1}
                        </span>
                        <span className="text-[13px] font-medium text-v2-ink truncate">
                          {deck.deckTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-v2-ink-3 tabular-nums">
                        {deck.totalSessions} ses · {Math.round(deck.totalMinutes / 60) || 0}h
                      </span>
                    </div>
                    <div className="h-1 bg-v2-line rounded-full overflow-hidden">
                      <div
                        className="h-full bg-v2-primary transition-[width] duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ChartCard>
  );
};
