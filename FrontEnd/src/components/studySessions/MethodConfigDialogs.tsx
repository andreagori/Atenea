import { useState, type FormEvent } from "react";
import { Button, Field, Input, Modal } from "@/components/ui";
import {
  CreateStudySessionDto,
  LearningMethod,
  StudyMethod,
} from "@/types/studySessions.types";
import { LearningMethodFilter } from "./LearningMethodFilter";

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: CreateStudySessionDto) => void;
  /**
   * Initial values to seed the form with — typically the previously-saved
   * custom config or the defaults from useStudySessionDefaults.
   */
  initial?: CreateStudySessionDto;
}

const Footer = ({
  onClose,
  submitLabel = "Guardar",
}: {
  onClose: () => void;
  submitLabel?: string;
}) => (
  <div className="flex justify-end gap-2 mt-2">
    <Button type="button" variant="ghost" onClick={onClose}>
      Cancelar
    </Button>
    <Button type="submit" variant="primary">
      {submitLabel}
    </Button>
  </div>
);

const ErrorLine = ({ message }: { message: string | null }) =>
  message ? (
    <div
      role="alert"
      className="mb-3 text-[13px] px-3.5 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
    >
      {message}
    </div>
  ) : null;

const ALL_METHODS = [
  LearningMethod.ACTIVE_RECALL,
  LearningMethod.CORNELL,
  LearningMethod.VISUAL_CARD,
];

/* ── Regular (spaced repetition) ───────────────────────── */
export const RegularConfigDialog = ({
  open,
  onClose,
  onSave,
  initial,
}: BaseDialogProps) => {
  const [numCards, setNumCards] = useState(
    initial?.numCardsSpaced && initial.numCardsSpaced > 0
      ? String(initial.numCardsSpaced)
      : ""
  );
  const [methods, setMethods] = useState<LearningMethod[]>(
    initial?.learningMethod ?? ALL_METHODS
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!numCards || methods.length === 0) {
      setError("Completa todos los campos.");
      return;
    }
    onSave({
      studyMethod: StudyMethod.SPACED_REPETITION,
      learningMethod: methods,
      numCardsSpaced: parseInt(numCards),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Configurar sesión regular">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Número de cartas a revisar"
          htmlFor="reg-num"
          hint="Entre 1 y 99."
        >
          <Input
            id="reg-num"
            type="number"
            min={1}
            max={99}
            placeholder="ej. 20"
            value={numCards}
            onChange={(e) => setNumCards(e.target.value)}
          />
        </Field>
        <Field>
          <LearningMethodFilter value={methods} onChange={setMethods} />
        </Field>
        <ErrorLine message={error} />
        <Footer onClose={onClose} />
      </form>
    </Modal>
  );
};

/* ── Pomodoro ─────────────────────────────────────────── */
export const PomodoroConfigDialog = ({
  open,
  onClose,
  onSave,
  initial,
}: BaseDialogProps) => {
  const [numCards, setNumCards] = useState(
    initial?.numCards && initial.numCards > 0 ? String(initial.numCards) : ""
  );
  const [studyMinutes, setStudyMinutes] = useState(
    initial?.studyMinutes ? String(initial.studyMinutes) : "25"
  );
  const [restMinutes, setRestMinutes] = useState(
    initial?.restMinutes ? String(initial.restMinutes) : "5"
  );
  const [methods, setMethods] = useState<LearningMethod[]>(
    initial?.learningMethod ?? ALL_METHODS
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!numCards || !studyMinutes || !restMinutes || methods.length === 0) {
      setError("Completa todos los campos.");
      return;
    }
    onSave({
      studyMethod: StudyMethod.POMODORO,
      learningMethod: methods,
      numCards: parseInt(numCards),
      studyMinutes: parseInt(studyMinutes),
      restMinutes: parseInt(restMinutes),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Configurar Pomodoro">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Número de cartas" htmlFor="pomo-num" hint="Entre 1 y 99.">
          <Input
            id="pomo-num"
            type="number"
            min={1}
            max={99}
            placeholder="ej. 20"
            value={numCards}
            onChange={(e) => setNumCards(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3 mb-1">
          <Field label="Estudio (min)" htmlFor="pomo-study">
            <Input
              id="pomo-study"
              type="number"
              min={1}
              max={60}
              value={studyMinutes}
              onChange={(e) => setStudyMinutes(e.target.value)}
            />
          </Field>
          <Field label="Descanso (min)" htmlFor="pomo-rest">
            <Input
              id="pomo-rest"
              type="number"
              min={1}
              max={60}
              value={restMinutes}
              onChange={(e) => setRestMinutes(e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <LearningMethodFilter value={methods} onChange={setMethods} />
        </Field>
        <ErrorLine message={error} />
        <Footer onClose={onClose} />
      </form>
    </Modal>
  );
};

/* ── Simulated test ───────────────────────────────────── */
export const SimulatedConfigDialog = ({
  open,
  onClose,
  onSave,
  initial,
}: BaseDialogProps) => {
  const [numQuestions, setNumQuestions] = useState(
    initial?.numQuestions && initial.numQuestions > 0
      ? String(initial.numQuestions)
      : ""
  );
  const [duration, setDuration] = useState(
    initial?.testDurationMinutes ? String(initial.testDurationMinutes) : "15"
  );
  const [methods, setMethods] = useState<LearningMethod[]>(
    initial?.learningMethod ?? ALL_METHODS
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!numQuestions || !duration || methods.length === 0) {
      setError("Completa todos los campos.");
      return;
    }
    onSave({
      studyMethod: StudyMethod.SIMULATED_TEST,
      learningMethod: methods,
      numQuestions: parseInt(numQuestions),
      testDurationMinutes: parseInt(duration),
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Configurar prueba simulada">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3 mb-1">
          <Field label="Preguntas" htmlFor="sim-q" hint="1 a 40.">
            <Input
              id="sim-q"
              type="number"
              min={1}
              max={40}
              placeholder="ej. 10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </Field>
          <Field label="Tiempo (min)" htmlFor="sim-t" hint="1 a 60.">
            <Input
              id="sim-t"
              type="number"
              min={1}
              max={60}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <LearningMethodFilter value={methods} onChange={setMethods} />
        </Field>
        <ErrorLine message={error} />
        <Footer onClose={onClose} />
      </form>
    </Modal>
  );
};
