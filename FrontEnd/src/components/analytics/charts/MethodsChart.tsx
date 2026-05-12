import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ChartCard } from "@/components/ui";
import { type MethodDistribution } from "@/types/analytics.types";
import { V2, tooltipChartJs } from "../chartTheme";

ChartJS.register(ArcElement, Tooltip);

export interface MethodsChartProps {
  data: MethodDistribution | null;
  loading?: boolean;
}

const Loading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="h-56 bg-v2-line/40 rounded-v2-sm animate-pulse" />
    <div className="h-56 bg-v2-line/40 rounded-v2-sm animate-pulse" />
  </div>
);

const EmptyState = () => (
  <div className="h-56 flex items-center justify-center text-[13px] text-v2-ink-3 text-center px-4">
    Aún no tienes sesiones registradas en este rango.
  </div>
);

const STUDY_METHOD_LABELS: Record<string, string> = {
  spacedRepetition: "Memorización espaciada",
  simulatedTest: "Pruebas simuladas",
  pomodoro: "Pomodoro",
};

const CARD_TYPE_LABELS: Record<string, string> = {
  activeRecall: "Repaso Activo",
  cornell: "Cornell",
  visualCard: "Visual",
};

const STUDY_COLORS = [V2.primary, V2.violet, V2.amber];
const CARD_COLORS = [V2.primary, V2.magenta, V2.green];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: V2.ink2,
        font: { size: 11 },
        padding: 12,
        usePointStyle: true,
        pointStyle: "circle",
      },
    },
    tooltip: {
      ...tooltipChartJs,
      callbacks: {
        label: (ctx: {
          dataset: { data: number[] };
          parsed: number;
          label: string;
        }) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
          return `${ctx.label}: ${ctx.parsed} (${pct}%)`;
        },
      },
    },
  },
};

const buildDoughnutData = (
  pairs: { method: string; count: number }[],
  labelMap: Record<string, string>,
  colors: string[]
) => ({
  labels: pairs.map((p) => labelMap[p.method] ?? p.method),
  datasets: [
    {
      data: pairs.map((p) => p.count),
      backgroundColor: colors,
      borderColor: V2.surface,
      borderWidth: 2,
      hoverOffset: 6,
    },
  ],
});

export const MethodsChart = ({ data, loading }: MethodsChartProps) => {
  if (loading) {
    return (
      <ChartCard title="Métodos y tipos" subtitle="Distribución de sesiones y cartas">
        <Loading />
      </ChartCard>
    );
  }

  const study = data?.studyMethods ?? [];
  const cards = data?.learningMethods ?? [];
  const studyTotal = study.reduce((a, m) => a + m.count, 0);
  const cardTotal = cards.reduce((a, m) => a + m.count, 0);

  if (studyTotal === 0 && cardTotal === 0) {
    return (
      <ChartCard title="Métodos y tipos" subtitle="Distribución de sesiones y cartas">
        <EmptyState />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Métodos y tipos" subtitle="Distribución de sesiones y cartas">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 text-center mb-2">
            Métodos de estudio
          </div>
          <div className="h-56">
            {studyTotal > 0 ? (
              <Doughnut
                data={buildDoughnutData(study, STUDY_METHOD_LABELS, STUDY_COLORS)}
                options={baseOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[12px] text-v2-ink-3">
                Sin datos
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 text-center mb-2">
            Tipos de carta
          </div>
          <div className="h-56">
            {cardTotal > 0 ? (
              <Doughnut
                data={buildDoughnutData(cards, CARD_TYPE_LABELS, CARD_COLORS)}
                options={baseOptions}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[12px] text-v2-ink-3">
                Sin datos
              </div>
            )}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};
