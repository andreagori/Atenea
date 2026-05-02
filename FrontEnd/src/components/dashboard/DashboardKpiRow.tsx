import { Clock, Layers, Brain } from "lucide-react";
import { StatCard } from "@/components/ui";
import { useUserStats } from "@/hooks/useUserStats";

export interface DashboardKpiRowProps {
  /** Pass the deck count from the same useDecks() instance the rest of the
   *  page already uses, so we don't duplicate the GET /deck request. */
  deckCount: number | null;
  /** True while decks are still loading. */
  decksLoading: boolean;
}

const formatMinutes = (mins: number): string => {
  if (!mins || mins <= 0) return "0m";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const Skeleton = () => (
  <span className="inline-block w-20 h-9 bg-v2-line rounded animate-pulse align-middle" />
);

/**
 * Three KPI tiles backed by real schema fields:
 *   SESIONES → UserStats.totalSessions
 *   TIEMPO   → UserStats.totalStudyMin
 *   MAZOS    → length of useDecks() result
 */
export const DashboardKpiRow = ({ deckCount, decksLoading }: DashboardKpiRowProps) => {
  const { stats, loading: statsLoading } = useUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
      <StatCard
        label="SESIONES"
        value={statsLoading ? <Skeleton /> : (stats?.totalSessions ?? 0)}
        foot="Total acumulado"
        icon={<Brain size={18} />}
      />
      <StatCard
        label="TIEMPO"
        value={statsLoading ? <Skeleton /> : formatMinutes(stats?.totalStudyMin ?? 0)}
        foot="Estudio total"
        icon={<Clock size={18} />}
        iconAccent="rgba(166,131,255,0.14)"
      />
      <StatCard
        label="MAZOS"
        value={decksLoading ? <Skeleton /> : (deckCount ?? 0)}
        foot="En tu biblioteca"
        icon={<Layers size={18} />}
        iconAccent="rgba(192,85,231,0.12)"
      />
    </div>
  );
};
