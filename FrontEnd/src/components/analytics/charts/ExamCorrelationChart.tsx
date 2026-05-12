import { useMemo } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/ui";
import { type ExamCorrelationData } from "@/types/analytics.types";
import { V2 } from "../chartTheme";

export interface ExamCorrelationChartProps {
  data: ExamCorrelationData[];
  loading?: boolean;
}

/** Minimum (exam, method-combo) pairs before a combo is treated as signal. */
const MIN_SAMPLE = 3;

const STUDY_METHOD_LABELS: Record<string, string> = {
  spacedRepetition: "Esp.",
  simulatedTest: "Sim.",
  pomodoro: "Pom.",
};

const LEARNING_METHOD_LABELS: Record<string, string> = {
  activeRecall: "Repaso",
  cornell: "Cornell",
  visualCard: "Visual",
};

const STUDY_METHOD_COLORS: Record<string, string> = {
  spacedRepetition: V2.primary,
  simulatedTest: V2.green,
  pomodoro: V2.amber,
};

const Loading = () => (
  <div className="h-72 animate-pulse bg-v2-line/40 rounded-v2-sm" />
);

const EmptyState = () => (
  <div className="h-72 flex items-center justify-center text-center px-6">
    <div>
      <p className="text-[14px] text-v2-ink-2 m-0 mb-2 leading-[1.5]">
        Aún no hay suficientes exámenes registrados para correlacionar con
        métodos de estudio.
      </p>
      <p className="text-[12px] text-v2-ink-3 m-0">
        Registra exámenes desde el detalle de un mazo. Necesitamos al menos{" "}
        {MIN_SAMPLE} exámenes por combinación de método para mostrar señal.
      </p>
    </div>
  </div>
);

interface ChartRow {
  comboKey: string;
  label: string;
  studyMethod: string;
  learningMethod: string;
  avgExamScore: number;
  sampleSize: number;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartRow }[];
}) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-v2-surface border border-v2-line rounded-v2-sm shadow-v2-md px-3 py-2 text-[12px]">
      <div className="font-medium text-v2-ink mb-0.5">
        {STUDY_METHOD_LABELS[row.studyMethod] ?? row.studyMethod}
        {" · "}
        {LEARNING_METHOD_LABELS[row.learningMethod] ?? row.learningMethod}
      </div>
      <div className="text-v2-ink-2 tabular-nums">
        Promedio: <span className="text-v2-ink font-medium">{row.avgExamScore}%</span>
      </div>
      <div className="text-v2-ink-3 tabular-nums">
        {row.sampleSize}{" "}
        {row.sampleSize === 1 ? "examen atribuido" : "exámenes atribuidos"}
      </div>
    </div>
  );
};

/**
 * Real-grade correlation chart. Each bar is one (studyMethod × learningMethod)
 * combination, x-axis groups by studyMethod and the bar's color follows the
 * study method. Combos below MIN_SAMPLE are filtered out so weak signals
 * don't masquerade as findings — keeps the visualisation honest at low n.
 */
export const ExamCorrelationChart = ({
  data,
  loading,
}: ExamCorrelationChartProps) => {
  const rows: ChartRow[] = useMemo(() => {
    if (!data) return [];
    return data
      .filter((d) => d.sampleSize >= MIN_SAMPLE)
      .map((d) => ({
        comboKey: `${d.studyMethod}|${d.learningMethod}`,
        label: `${STUDY_METHOD_LABELS[d.studyMethod] ?? d.studyMethod} · ${LEARNING_METHOD_LABELS[d.learningMethod] ?? d.learningMethod}`,
        studyMethod: d.studyMethod,
        learningMethod: d.learningMethod,
        avgExamScore: d.avgExamScore,
        sampleSize: d.sampleSize,
      }))
      .sort((a, b) => b.avgExamScore - a.avgExamScore);
  }, [data]);

  if (loading) {
    return (
      <ChartCard
        title="Correlación con exámenes reales"
        subtitle="Promedio por combinación de método (30 días previos al examen)"
      >
        <Loading />
      </ChartCard>
    );
  }

  if (rows.length === 0) {
    return (
      <ChartCard
        title="Correlación con exámenes reales"
        subtitle="Promedio por combinación de método (30 días previos al examen)"
      >
        <EmptyState />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Correlación con exámenes reales"
      subtitle={`${rows.length} ${rows.length === 1 ? "combinación" : "combinaciones"} con ≥ ${MIN_SAMPLE} exámenes`}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            margin={{ top: 12, right: 12, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={V2.line} />
            <XAxis
              dataKey="label"
              stroke={V2.ink2}
              fontSize={11}
              angle={-25}
              textAnchor="end"
              height={70}
              interval={0}
              tickLine={false}
            />
            <YAxis
              stroke={V2.ink2}
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: V2.line + "55" }}
            />
            <Bar dataKey="avgExamScore" radius={[6, 6, 0, 0]}>
              {rows.map((row) => (
                <Cell
                  key={row.comboKey}
                  fill={STUDY_METHOD_COLORS[row.studyMethod] ?? V2.primary}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-v2-ink-3 m-0 mt-3 leading-[1.5]">
        Muestra el promedio de notas reales (%) por combinación de método
        usada en los 30 días previos a cada examen. Correlación, no causalidad.
      </p>
    </ChartCard>
  );
};
