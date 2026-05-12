import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { IconButton } from "@/components/ui";
import { useAnalytics } from "@/hooks/useAnalytics";
import { type TimeRange } from "@/types/analytics.types";
import {
  TimeRangeFilter,
  KpiRow,
  InsightsPanel,
  DailyStudyChart,
  TestScoresChart,
  MethodsChart,
  SpacedRepetitionChart,
  ActivityChart,
  ExamCorrelationChart,
} from "@/components/analytics";

/** Convert the active TimeRange into a concrete day-count for KPI hints. */
const rangeWindow = (r: TimeRange): number => {
  if (r.days) return r.days;
  if (r.startDate && r.endDate) {
    const a = new Date(r.startDate).getTime();
    const b = new Date(r.endDate).getTime();
    return Math.max(1, Math.round((b - a) / 86400000) + 1);
  }
  return 30;
};

const Analysis = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>({ days: 30 });
  const { data, loading, error } = useAnalytics(timeRange);

  const windowDays = rangeWindow(timeRange);

  // KPI derivations — purely from real data; if a series is empty, the KPI
  // value naturally collapses to 0 (or null for the average).
  const kpi = useMemo(() => {
    const totalMinutes = data.dailyStudyTime.reduce((a, d) => a + d.minutes, 0);
    const totalSessions = data.activityCalendar.reduce(
      (a, d) => a + d.sessions,
      0
    );
    const averageScore =
      data.testScores.length > 0
        ? Math.round(
            data.testScores.reduce((a, d) => a + d.score, 0) /
              data.testScores.length
          )
        : null;
    const activeDays = data.activityCalendar.filter((d) => d.sessions > 0)
      .length;
    return { totalMinutes, totalSessions, averageScore, activeDays };
  }, [data]);

  return (
    <div className="animate-v2-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-3">
        <Link to="/inicio" aria-label="Volver a inicio">
          <IconButton variant="default" size="sm">
            <ChevronLeft size={16} />
          </IconButton>
        </Link>
        <Link
          to="/inicio"
          className="text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors"
        >
          Inicio
        </Link>
        <span className="text-[13px] text-v2-ink-3">/</span>
        <span className="text-[13px] text-v2-ink font-medium">Análisis</span>
      </div>

      {/* Title + filter */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px] text-v2-ink">
            Análisis
          </h1>
          <p className="text-[15px] text-v2-ink-2 m-0 mt-1.5">
            Revisa tu progreso y rendimiento de estudio.
          </p>
        </div>
        <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-center gap-2.5 px-4 py-3 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20 text-[14px]"
        >
          <AlertCircle size={18} />
          No se pudieron cargar los datos de análisis. {error}
        </div>
      ) : (
        <div className="space-y-6">
          <InsightsPanel insights={data.insights} loading={loading} />

          <KpiRow
            totalMinutes={kpi.totalMinutes}
            totalSessions={kpi.totalSessions}
            averageScore={kpi.averageScore}
            activeDays={kpi.activeDays}
            windowDays={windowDays}
            loading={loading}
          />

          <DailyStudyChart data={data.dailyStudyTime} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TestScoresChart data={data.testScores} loading={loading} />
            <MethodsChart data={data.methodsDistribution} loading={loading} />
          </div>

          <SpacedRepetitionChart
            data={data.spacedRepetitionStats}
            loading={loading}
          />

          <ExamCorrelationChart
            data={data.examCorrelation}
            loading={loading}
          />

          <ActivityChart
            data={data.activityCalendar}
            deckProgress={data.deckProgress}
            loading={loading}
            windowDays={windowDays}
          />
        </div>
      )}
    </div>
  );
};

export default Analysis;
