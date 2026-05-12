import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config";

export interface DueDeck {
  deckId: number;
  deckTitle: string;
  dueCount: number;
}

export const useDueToday = () => {
  const [data, setData] = useState<DueDeck[]>([]);
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
        const res = await axios.get<DueDeck[]>(
          `${API_CONFIG.BASE_URL}/study-sessions/due-today`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!cancelled) setData(res.data ?? []);
      } catch (err: any) {
        if (cancelled) return;
        console.error("useDueToday:", err);
        setError(err?.response?.data?.message ?? err.message ?? "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const total = data.reduce((acc, d) => acc + d.dueCount, 0);

  return { decks: data, total, loading, error };
};
