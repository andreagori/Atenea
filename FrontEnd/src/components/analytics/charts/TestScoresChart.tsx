import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartCard } from "@/components/ui";
import { type TestScoreData } from "@/types/analytics.types";
import { V2, tooltipChartJs } from "../chartTheme";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export interface TestScoresChartProps {
  data: TestScoreData[];
  loading?: boolean;
}

const Loading = () => (
  <div className="h-64 animate-pulse bg-v2-line/40 rounded-v2-sm" />
);

const EmptyState = () => (
  <div className="h-64 flex items-center justify-center text-[13px] text-v2-ink-3">
    Aún no has hecho pruebas simuladas.
  </div>
);

export const TestScoresChart = ({ data, loading }: TestScoresChartProps) => {
  if (loading) {
    return (
      <ChartCard title="Puntuaciones en pruebas" subtitle="Score por test">
        <Loading />
      </ChartCard>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Puntuaciones en pruebas" subtitle="Score por test">
        <EmptyState />
      </ChartCard>
    );
  }

  const avg = Math.round(data.reduce((a, d) => a + d.score, 0) / data.length);

  const chartData = {
    labels: data.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label: "Score",
        data: data.map((d) => d.score),
        backgroundColor: V2.primary,
        hoverBackgroundColor: V2.primaryDeep,
        borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipChartJs,
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => {
            const idx = ctx.dataIndex;
            return [`${ctx.parsed.y}%`, data[idx]?.deckTitle ?? ""].filter(
              Boolean
            ) as string[];
          },
          title: (ctx: TooltipItem<"bar">[]) => {
            const idx = ctx[0].dataIndex;
            const d = new Date(data[idx]?.date);
            return d.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: V2.ink2, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: V2.line, drawBorder: false },
        ticks: {
          color: V2.ink2,
          font: { size: 11 },
          callback: (v: unknown) => `${v}%`,
        },
      },
    },
  } as const;

  return (
    <ChartCard
      title="Puntuaciones en pruebas"
      subtitle={`Promedio ${avg}% · ${data.length} ${data.length === 1 ? "test" : "tests"}`}
    >
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </ChartCard>
  );
};
