import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/config';

export const useDeckIdByTitle = (title: string | undefined) => {
  const [deckId, setDeckId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeckId = async () => {
      if (!title) {
        setDeckId(null);
        setLoading(false);
        return;
      }

      const token = Cookies.get("auth_token");
      if (!token) {
        setError("No auth token found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get<{ deckId: number }>(
          `${API_CONFIG.BASE_URL}/deck/by-title/${encodedTitle}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Response from server:", response.data);
        setDeckId(response.data.deckId); // Add this line to set the deckId
        setError(null);
      } catch (err: any) {
        console.error("Error al obtener deck ID:", err.response?.data);
        setError(err.response?.data?.message || 'Error al obtener el deck ID');
        setDeckId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDeckId();
  }, [title]);

  return { deckId, loading, error };
};