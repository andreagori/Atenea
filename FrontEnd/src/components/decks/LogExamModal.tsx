import { useState, type FormEvent } from "react";
import { Button, Field, Input, Modal, Textarea } from "@/components/ui";
import { type CreateExamPayload } from "@/hooks/useExams";

export interface LogExamModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Deck this exam is being logged for. Passed straight through to the
   * backend so analytics can correlate study sessions on this deck with
   * the exam score.
   */
  deckId: number;
  /**
   * Used to suggest a default `subject` (fallback identifier on the exam
   * record), prefilled but editable in case the user prefers a different
   * label.
   */
  deckTitle: string;
  onSubmit: (payload: CreateExamPayload) => Promise<void>;
  onSuccess?: () => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

/**
 * Quick-entry modal for logging an exam grade against a deck. Designed
 * for ≤10 seconds to fill: date defaults to today, max score to 100,
 * subject prefilled with the deck title.
 */
export const LogExamModal = ({
  open,
  onClose,
  deckId,
  deckTitle,
  onSubmit,
  onSuccess,
}: LogExamModalProps) => {
  const [examDate, setExamDate] = useState(todayIso());
  const [examScore, setExamScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setExamDate(todayIso());
    setExamScore("");
    setMaxScore("100");
    setNote("");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const score = Number(examScore);
    const max = Number(maxScore);
    if (!examDate) return setError("Falta la fecha del examen.");
    if (Number.isNaN(score) || score < 0) return setError("La puntuación debe ser un número válido.");
    if (Number.isNaN(max) || max < 1) return setError("El máximo debe ser un número mayor a 0.");
    if (score > max) return setError("La puntuación no puede ser mayor al máximo.");

    setSubmitting(true);
    try {
      await onSubmit({
        deckId,
        subject: deckTitle,
        examDate,
        examScore: score,
        maxScore: max,
        note: note.trim() || undefined,
      });
      reset();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "No se pudo registrar el examen."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Registrar examen">
      <form onSubmit={handleSubmit} noValidate>
        <p className="text-[13px] text-v2-ink-2 m-0 mb-5">
          Mazo:{" "}
          <span className="text-v2-ink font-medium">{deckTitle}</span>
        </p>

        <Field label="Fecha del examen" htmlFor="exam-date">
          <Input
            id="exam-date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            max={todayIso()}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Puntuación" htmlFor="exam-score">
            <Input
              id="exam-score"
              type="number"
              min={0}
              max={1000}
              placeholder="ej. 85"
              value={examScore}
              onChange={(e) => setExamScore(e.target.value)}
            />
          </Field>
          <Field label="Máximo" htmlFor="exam-max" hint="100 por defecto">
            <Input
              id="exam-max"
              type="number"
              min={1}
              max={1000}
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Nota (opcional)" htmlFor="exam-note">
          <Textarea
            id="exam-note"
            rows={3}
            placeholder="¿Algo que recordar sobre este examen?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>

        {error && (
          <div
            role="alert"
            className="mb-4 text-[13px] px-4 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
          >
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Guardando…" : "Registrar examen"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
