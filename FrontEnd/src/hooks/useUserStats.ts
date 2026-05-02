import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config";

export interface UserStats {
  userId: number;
  totalSessions: number;
  totalStudyMin: number;
  mostUsedLearningM: string | null;
  mostUsedStudyM: string | null;
}

/**
 * Fetches the authenticated user's denormalized rollup from `/user-stats`.
 * The backend recomputes this on each session finish via
 * UserStatsService.updateStatsOnSessionComplete, so it can be considered
 * up-to-date for any read-only dashboard tile.
 */
export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<UserStats>(
          `${API_CONFIG.BASE_URL}/user-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!cancelled) setStats(res.data);
      } catch (err: unknown) {
        if (cancelled) return;
        console.error("useUserStats:", err);
        setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, loading, error };
};
