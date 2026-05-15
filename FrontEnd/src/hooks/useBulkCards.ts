import axios from "axios";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config";
import { type ParsedCardRow } from "@/utils/bulkCardTemplate";

export interface BulkResult {
  message: string;
  created: number;
  skipped: number;
  total: number;
  errors: { row: number; title: string; message: string }[];
}

const toPayload = (rows: ParsedCardRow[]) =>
  rows.map((r) => ({
    title: r.title,
    learningMethod: r.learningMethod,
    questionTitle: r.questionTitle,
    answer: r.answer,
    principalNote: r.principalNote,
    noteQuestions: r.noteQuestions,
    shortNote: r.shortNote,
  }));

export const useBulkCards = (deckId: number | undefined) => {
  const bulkCreate = async (rows: ParsedCardRow[]): Promise<BulkResult> => {
    const token = Cookies.get("auth_token");
    if (!token || !deckId) {
      throw new Error("No auth token found or invalid deck ID");
    }
    const response = await axios.post<BulkResult>(
      `${API_CONFIG.BASE_URL}/card/deck/${deckId}/bulk`,
      { cards: toPayload(rows) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  return { bulkCreate };
};
