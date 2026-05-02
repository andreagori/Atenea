import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { BookOpen, Layers, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { type Card } from "@/hooks/useCards";
import { type CreateCardPayload } from "@/types/card.types";
import {
  ActiveRecallFields,
  CornellFields,
  VisualCardFields,
  buildCreatePayload,
  type CardFormData,
} from "./CardFormFields";

type LearningMethod = "activeRecall" | "cornell" | "visualCard";

const METHODS: {
  value: LearningMethod;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "activeRecall",
    label: "Repaso Activo",
    description: "Pregunta al frente, respuesta al reverso.",
    icon: <BookOpen size={18} />,
  },
  {
    value: "cornell",
    label: "Cornell",
    description: "Notas estructuradas en tres zonas.",
    icon: <Layers size={18} />,
  },
  {
    value: "visualCard",
    label: "Visual",
    description: "Imagen + descripción breve.",
    icon: <ImageIcon size={18} />,
  },
];

const blankFormData = (method: LearningMethod): CardFormData => {
  if (method === "activeRecall")
    return {
      learningMethod: "activeRecall",
      title: "",
      questionTitle: "",
      answer: "",
    };
  if (method === "cornell")
    return {
      learningMethod: "cornell",
      title: "",
      principalNote: "",
      noteQuestions: "",
      shortNote: "",
    };
  return { learningMethod: "visualCard", title: "" };
};

const formDataFromCard = (card: Card): CardFormData => {
  if (card.learningMethod === "activeRecall") {
    return {
      learningMethod: "activeRecall",
      title: card.title,
      questionTitle: card.activeRecall?.questionTitle ?? card.title,
      answer: card.activeRecall?.answer ?? "",
    };
  }
  if (card.learningMethod === "cornell") {
    return {
      learningMethod: "cornell",
      title: card.title,
      principalNote: card.cornell?.principalNote ?? "",
      noteQuestions: card.cornell?.noteQuestions ?? "",
      shortNote: card.cornell?.shortNote ?? "",
    };
  }
  return {
    learningMethod: "visualCard",
    title: card.title,
    urlImage: card.visualCard?.urlImage ?? undefined,
  };
};

export interface CardFormProps {
  /**
   * If provided, form opens in EDIT mode (type picker hidden, type locked).
   * Otherwise CREATE mode.
   */
  initialCard?: Card;
  /** Cancel button click handler. */
  onCancel: () => void;
  /**
   * Send the validated payload upstream. Throw to surface a server-side error
   * inside the form's inline error banner.
   */
  onSubmit: (payload: CreateCardPayload) => Promise<void>;
  /**
   * Called after onSubmit resolves successfully. The boolean is `true` when
   * the user has the "Crear otra después" checkbox enabled (only meaningful
   * in create mode + when `showStayOption` is set).
   */
  onSuccess?: (stayOnPage: boolean) => void;
  /** Render the "Crear otra después" checkbox in create mode. */
  showStayOption?: boolean;
  /** Override submit button label (e.g. "Guardar" vs "Crear carta"). */
  submitLabel?: string;
  /**
   * Fires whenever the internal form data changes. Use to mirror state for
   * a live preview alongside the form. Memoize the callback (useCallback)
   * so the effect doesn't re-fire on every parent render.
   */
  onDataChange?: (data: CardFormData) => void;
}

/**
 * Pure form (no chrome). Used by:
 *   - <CardModal> wrapped in a <Modal>          (edit mode, single-shot)
 *   - <NewCard> page                            (create mode, supports stay-on-page)
 */
export const CardForm = ({
  initialCard,
  onCancel,
  onSubmit,
  onSuccess,
  showStayOption,
  submitLabel,
  onDataChange,
}: CardFormProps) => {
  const editMode = initialCard !== undefined;

  const [data, setData] = useState<CardFormData>(() =>
    initialCard ? formDataFromCard(initialCard) : blankFormData("activeRecall")
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stayOnPage, setStayOnPage] = useState(false);

  // Reset to initial values whenever the form is re-mounted with new content
  // (e.g. modal opened for a different card).
  useEffect(() => {
    setData(
      initialCard ? formDataFromCard(initialCard) : blankFormData("activeRecall")
    );
    setSubmitError(null);
  }, [initialCard]);

  // Mirror data upstream for live previews (no-op when caller doesn't subscribe).
  useEffect(() => {
    onDataChange?.(data);
  }, [data, onDataChange]);

  const handleMethodChange = (method: LearningMethod) => {
    if (editMode) return;
    setData(blankFormData(method));
  };

  const validate = (): string | null => {
    if (data.learningMethod === "activeRecall") {
      if (data.questionTitle.trim().length < 3)
        return "La pregunta debe tener al menos 3 caracteres.";
      if (data.answer.trim().length < 1)
        return "Escribe la respuesta de la carta.";
    } else if (data.learningMethod === "cornell") {
      if (data.title.trim().length < 3)
        return "El título debe tener al menos 3 caracteres.";
      if (data.principalNote.trim().length < 1)
        return "La nota principal no puede estar vacía.";
      if (data.noteQuestions.trim().length < 1)
        return "Las preguntas/ideas no pueden estar vacías.";
      if (data.shortNote.trim().length < 1)
        return "El resumen no puede estar vacío.";
    } else {
      if (data.title.trim().length < 3)
        return "El título debe tener al menos 3 caracteres.";
      if (!editMode && !data.file)
        return "Sube una imagen para esta carta visual.";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = buildCreatePayload(data);
      await onSubmit(payload);

      // Stay-on-page only applies to create mode with the option enabled.
      const willStay = !editMode && showStayOption === true && stayOnPage;
      if (willStay) {
        // Reset just the field values; keep current type and the checkbox.
        setData(blankFormData(data.learningMethod));
      }
      onSuccess?.(willStay);
    } catch (err: unknown) {
      console.error("CardForm submit:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : editMode
            ? "No se pudo actualizar la carta."
            : "No se pudo crear la carta."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const defaultSubmitLabel = editMode ? "Guardar cambios" : "Crear carta";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!editMode && (
        <div className="mb-5">
          <div className="font-v2-mono text-[11px] tracking-[1.2px] uppercase text-v2-ink-3 mb-2 font-medium">
            Tipo de carta
          </div>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => {
              const active = data.learningMethod === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleMethodChange(m.value)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 px-3 py-3 rounded-v2-sm border text-left transition-[background-color,border-color,color] duration-150",
                    active
                      ? "bg-v2-primary-pale border-v2-primary text-v2-primary-deep"
                      : "bg-v2-surface border-v2-line text-v2-ink-2 hover:border-v2-line-2 hover:text-v2-ink"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center",
                      active
                        ? "bg-v2-primary text-white"
                        : "bg-v2-bg text-v2-ink-2"
                    )}
                  >
                    {m.icon}
                  </div>
                  <div className="text-[13px] font-medium leading-tight">
                    {m.label}
                  </div>
                  <div className="text-[11px] text-v2-ink-3 leading-[1.35]">
                    {m.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {data.learningMethod === "activeRecall" && (
        <ActiveRecallFields
          data={data}
          onChange={(next) =>
            setData((prev) =>
              prev.learningMethod === "activeRecall"
                ? { ...prev, ...next }
                : prev
            )
          }
        />
      )}
      {data.learningMethod === "cornell" && (
        <CornellFields
          data={data}
          onChange={(next) =>
            setData((prev) =>
              prev.learningMethod === "cornell"
                ? { ...prev, ...next }
                : prev
            )
          }
        />
      )}
      {data.learningMethod === "visualCard" && (
        <VisualCardFields
          data={data}
          onChange={(next) =>
            setData((prev) =>
              prev.learningMethod === "visualCard"
                ? { ...prev, ...next }
                : prev
            )
          }
        />
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-4 text-[13px] px-4 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
        >
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-2 flex-wrap">
        {!editMode && showStayOption ? (
          <label className="flex items-center gap-2 cursor-pointer text-[14px] text-v2-ink-2 select-none">
            <input
              type="checkbox"
              checked={stayOnPage}
              onChange={(e) => setStayOnPage(e.target.checked)}
              className="w-4 h-4 accent-v2-primary cursor-pointer"
            />
            Crear otra carta después
          </label>
        ) : (
          <span />
        )}
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Guardando…" : (submitLabel ?? defaultSubmitLabel)}
          </Button>
        </div>
      </div>
    </form>
  );
};
