import { useEffect, useState, type FormEvent } from "react";
import {
  Modal,
  Field,
  Input,
  Textarea,
  Button,
} from "@/components/ui";

export interface CreateDeckModalProps {
  open: boolean;
  onClose: () => void;
  /** Called on submit in create mode. */
  onCreate?: (title: string, body: string) => Promise<void>;
  /** Called on submit in edit mode (and presence switches the modal to edit). */
  onUpdate?: (title: string, body: string) => Promise<void>;
  /** Pre-fills the title field; required in edit mode. */
  initialTitle?: string;
  /** Pre-fills the body field; required in edit mode. */
  initialBody?: string;
}

interface FieldErrors {
  title?: string;
  body?: string;
}

// Validation rules mirror BackEnd/src/deck/dto/create-deck.dto.ts so what
// the user sees client-side matches what the server enforces.
const validate = (title: string, body: string): FieldErrors => {
  const errs: FieldErrors = {};
  if (title.length < 3)
    errs.title = "El título debe tener al menos 3 caracteres.";
  else if (title.length > 100)
    errs.title = "El título no puede tener más de 100 caracteres.";
  if (body.length < 3)
    errs.body = "La descripción debe tener al menos 3 caracteres.";
  else if (body.length > 100)
    errs.body = "La descripción no puede tener más de 100 caracteres.";
  return errs;
};

export const CreateDeckModal = ({
  open,
  onClose,
  onCreate,
  onUpdate,
  initialTitle = "",
  initialBody = "",
}: CreateDeckModalProps) => {
  const editMode = onUpdate !== undefined;
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset to initial values whenever the modal is opened — handles the
  // "edit deck X, close, edit deck Y" sequence cleanly.
  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setBody(initialBody);
      setErrors({});
      setSubmitError(null);
    }
  }, [open, initialTitle, initialBody]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(title, body);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      if (editMode && onUpdate) {
        await onUpdate(title, body);
      } else if (onCreate) {
        await onCreate(title, body);
      }
      onClose();
    } catch (err: unknown) {
      console.error("CreateDeckModal submit:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : editMode
            ? "No se pudo actualizar el mazo."
            : "No se pudo crear el mazo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = (key: keyof FieldErrors) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editMode ? "Editar mazo" : "Crear mazo"}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Título"
          htmlFor="deck-title"
          hint="3 a 100 caracteres"
          error={errors.title}
        >
          <Input
            id="deck-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
            placeholder="Ej. Cálculo Integral"
            maxLength={100}
            autoFocus
            required
          />
        </Field>

        <Field
          label="Descripción"
          htmlFor="deck-body"
          hint="Una línea sobre el contenido del mazo (3 a 100 caracteres)"
          error={errors.body}
        >
          <Textarea
            id="deck-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              clearError("body");
            }}
            placeholder="Ej. Derivadas, integrales y series."
            maxLength={100}
            rows={3}
            required
          />
        </Field>

        {submitError && (
          <div
            role="alert"
            className="mb-4 text-[13px] px-4 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
          >
            {submitError}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting
              ? "Guardando…"
              : editMode
                ? "Guardar cambios"
                : "Crear mazo"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
