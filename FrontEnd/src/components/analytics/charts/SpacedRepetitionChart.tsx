import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/ui";
import { type SpacedRepetitionData } from "@/types/analytics.types";
import { V2 } from "../chartTheme";

export interface SpacedRepetitionChartProps {
  data: SpacedRepetitionData[];
  loading?: boolean;
}

const MAX_SESSIONS = 6;

const DIFFICULTY = {
  facil: { label: "Fácil", color: V2.primary },
  bien: { label: "Bien", color: V2.green },
  masomenos: { label: "Más o menos", color: V2.amber },
  dificil: { label: "Difícil", color: V2.coral },
} as const;

const Loading = () => (
  <div className="h-72 animate-pulse bg-v2-line/40 rounded-v2-sm" />
);

const EmptyState = () => (
  <div className="h-72 flex items-center justify-center text-[13px] text-v2-ink-3">
    Sin sesiones de memorización en este rango.
  </div>
);

interface ChartRow {
  sessionId: number;
  sessionName: string;
  facil: number;
  bien: number;
  masomenos: number;
  dificil: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-v2-surface border border-v2-line rounded-v2-sm shadow-v2-md px-3 py-2 text-[12px]">
      <div className="font-medium text-v2-ink mb-1.5">{label}</div>
      {payload.map((p) => {
        if (p.value === 0) return null;
        const key = p.dataKey as keyof typeof DIFFICULTY;
        return (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-3 mt-0.5"
          >
            <span
              className="inline-flex items-center gap-1.5"
              style={{ color: DIFFICULTY[key].color }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: DIFFICULTY[key].color }}
              />
              {DIFFICULTY[key].label}
            </span>
            <span className="text-v2-ink tabular-nums">{p.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export const SpacedRepetitionChart = ({
  data,
  loading,
}: SpacedRepetitionChartProps) => {
  const rows: ChartRow[] = useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort(
        (a, b) =>
          new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
      )
      .slice(0, MAX_SESSIONS)
      .reverse()
      .map((s) => ({
        sessionId: s.sessionId,
        sessionName: `${new Date(s.sessionDate).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        })} · ${s.deckName.length > 14 ? `${s.deckName.slice(0, 13)}…` : s.deckName}`,
        facil: s.cardsByDifficulty.facil.length,
        bien: s.cardsByDifficulty.bien.length,
        masomenos: s.cardsByDifficulty.masomenos.length,
        dificil: s.cardsByDifficulty.dificil.length,
      }));
  }, [data]);

  if (loading) {
    return (
      <ChartCard
        title="Memorización espaciada"
        subtitle="Cartas por nivel de dificultad"
      >
        <Loading />
      </ChartCard>
    );
  }

  if (rows.length === 0) {
    return (
      <ChartCard
        title="Memorización espaciada"
        subtitle="Cartas por nivel de dificultad"
      >
        <EmptyState />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Memorización espaciada"
      subtitle={`Últimas ${rows.length} ${rows.length === 1 ? "sesión" : "sesiones"}`}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            margin={{ top: 12, right: 12, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={V2.line} />
            <XAxis
              dataKey="sessionName"
              stroke={V2.ink2}
              fontSize={11}
              angle={-30}
              textAnchor="end"
              height={70}
              interval={0}
              tickLine={false}
            />
            <YAxis stroke={V2.ink2} fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: V2.line + "55" }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: 4, fontSize: 12, color: V2.ink2 }}
            />
            <Bar
              stackId="diff"
              dataKey="dificil"
              name="Difícil"
              fill={DIFFICULTY.dificil.color}
            />
            <Bar
              stackId="diff"
              dataKey="masomenos"
              name="Más o menos"
              fill={DIFFICULTY.masomenos.color}
            />
            <Bar
              stackId="diff"
              dataKey="bien"
              name="Bien"
              fill={DIFFICULTY.bien.color}
            />
            <Bar
              stackId="diff"
              dataKey="facil"
              name="Fácil"
              fill={DIFFICULTY.facil.color}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
