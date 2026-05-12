import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config";

export interface Exam {
  examId: number;
  userId: number;
  deckId: number | null;
  subject: string | null;
  examDate: string;
  examScore: number;
  maxScore: number;
  note: string | null;
  createdAt: string;
}

export interface CreateExamPayload {
  deckId?: number;
  subject?: string;
  examDate: string;
  examScore: number;
  maxScore?: number;
  note?: string;
}

export type UpdateExamPayload = Partial<CreateExamPayload>;

/**
 * CRUD for the user's logged exams. Pass `deckId` to scope listing to a
 * single deck (used on the deck-detail history panel); omit it for the
 * full list used by analytics.
 */
export const useExams = (deckId?: number) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authHeaders = () => {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No authentication token found");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = deckId ? { deckId } : undefined;
      const res = await axios.get<Exam[]>(`${API_CONFIG.BASE_URL}/exam`, {
        headers: authHeaders(),
        params,
      });
      setExams(res.data);
    } catch (err: any) {
      console.error("useExams:fetch:", err);
      setError(err?.response?.data?.message ?? err.message ?? "Error al cargar exámenes");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const createExam = async (payload: CreateExamPayload) => {
    const res = await axios.post<Exam>(`${API_CONFIG.BASE_URL}/exam`, payload, {
      headers: authHeaders(),
    });
    setExams((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateExam = async (examId: number, payload: UpdateExamPayload) => {
    const res = await axios.patch<Exam>(
      `${API_CONFIG.BASE_URL}/exam/${examId}`,
      payload,
      { headers: authHeaders() }
    );
    setExams((prev) => prev.map((e) => (e.examId === examId ? res.data : e)));
    return res.data;
  };

  const deleteExam = async (examId: number) => {
    await axios.delete(`${API_CONFIG.BASE_URL}/exam/${examId}`, {
      headers: authHeaders(),
    });
    setExams((prev) => prev.filter((e) => e.examId !== examId));
  };

  return {
    exams,
    loading,
    error,
    refetch: fetchExams,
    createExam,
    updateExam,
    deleteExam,
  };
};
