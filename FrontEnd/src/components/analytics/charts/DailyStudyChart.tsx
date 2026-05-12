import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartCard } from "@/components/ui";
import { type DailyStudyData } from "@/types/analytics.types";
import { V2, tooltipChartJs } from "../chartTheme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export interface DailyStudyChartProps {
  data: DailyStudyData[];
  loading?: boolean;
}

const EmptyState = () => (
  <div className="h-64 flex items-center justify-center text-[13px] text-v2-ink-3">
    Sin tiempo registrado en este rango.
  </div>
);

const Loading = () => (
  <div className="h-64 animate-pulse bg-v2-line/40 rounded-v2-sm" />
);

export const DailyStudyChart = ({ data, loading }: DailyStudyChartProps) => {
  if (loading) {
    return (
      <ChartCard title="Tiempo de estudio diario" subtitle="Minutos por día">
        <Loading />
      </ChartCard>
    );
  }

  const isEmpty = !data || data.length === 0 || data.every((d) => d.minutes === 0);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Minutos",
        data: data.map((d) => d.minutes),
        borderColor: V2.primary,
        backgroundColor: `${V2.primary}22`,
        borderWidth: 2,
        pointBackgroundColor: V2.primaryDeep,
        pointBorderColor: V2.surface,
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
        fill: true,
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
          label: (ctx: TooltipItem<"line">) => {
            const m = ctx.parsed.y;
            const h = (m / 60).toFixed(1);
            return `${m} min (${h}h)`;
          },
          title: (ctx: TooltipItem<"line">[]) => {
            const d = new Date(ctx[0].label);
            return d.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: V2.line, drawBorder: false },
        ticks: {
          color: V2.ink2,
          font: { size: 11 },
          callback: (_: unknown, index: number) => {
            const d = new Date(data[index]?.date);
            return d.toLocaleDateString("es-ES", {
              month: "short",
              day: "numeric",
            });
          },
        },
      },
      y: {
        grid: { color: V2.line, drawBorder: false },
        ticks: { color: V2.ink2, font: { size: 11 } },
        beginAtZero: true,
      },
    },
  } as const;

  const total = data.reduce((acc, d) => acc + d.minutes, 0);

  return (
    <ChartCard
      title="Tiempo de estudio diario"
      subtitle={total > 0 ? `${total} min totales` : "Minutos por día"}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </ChartCard>
  );
};
