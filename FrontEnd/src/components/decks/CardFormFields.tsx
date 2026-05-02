import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Field, Input, Textarea } from "@/components/ui";
import { type CreateCardPayload } from "@/types/card.types";

interface FieldsProps<T> {
  data: T;
  onChange: (next: Partial<T>) => void;
  errors?: Partial<Record<keyof T, string>>;
}

/* ---------- Active Recall fields ---------- */

export interface ActiveRecallData {
  title: string;
  questionTitle: string;
  answer: string;
}

export const ActiveRecallFields = ({
  data,
  onChange,
  errors,
}: FieldsProps<ActiveRecallData>) => (
  <>
    <Field
      label="Título / Pregunta"
      htmlFor="card-question"
      hint="Mínimo 3 caracteres"
      error={errors?.questionTitle}
    >
      <Input
        id="card-question"
        type="text"
        value={data.questionTitle}
        onChange={(e) =>
          onChange({ questionTitle: e.target.value, title: e.target.value })
        }
        placeholder="¿Cuál es la pregunta que quieres recordar?"
        maxLength={100}
        required
      />
    </Field>
    <Field
      label="Respuesta"
      htmlFor="card-answer"
      hint="La explicación que verás al voltear la carta"
      error={errors?.answer}
    >
      <Textarea
        id="card-answer"
        value={data.answer}
        onChange={(e) => onChange({ answer: e.target.value })}
        placeholder="Escribe la respuesta completa…"
        rows={4}
        required
      />
    </Field>
  </>
);

/* ---------- Cornell fields ---------- */

export interface CornellData {
  title: string;
  principalNote: string;
  noteQuestions: string;
  shortNote: string;
}

export const CornellFields = ({
  data,
  onChange,
  errors,
}: FieldsProps<CornellData>) => (
  <>
    <Field
      label="Título"
      htmlFor="card-title"
      hint="Tema principal o título"
      error={errors?.title}
    >
      <Input
        id="card-title"
        type="text"
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Tema principal"
        maxLength={100}
        required
      />
    </Field>
    <Field
      label="Nota principal"
      htmlFor="card-note"
      error={errors?.principalNote}
    >
      <Textarea
        id="card-note"
        value={data.principalNote}
        onChange={(e) => onChange({ principalNote: e.target.value })}
        placeholder="Desarrolla aquí el contenido principal del tema…"
        rows={4}
        required
      />
    </Field>
    <Field
      label="Preguntas / ideas clave"
      htmlFor="card-questions"
      error={errors?.noteQuestions}
    >
      <Textarea
        id="card-questions"
        value={data.noteQuestions}
        onChange={(e) => onChange({ noteQuestions: e.target.value })}
        placeholder="¿Qué preguntas surgen? ¿Qué puntos clave debo recordar?"
        rows={3}
        required
      />
    </Field>
    <Field
      label="Resumen"
      htmlFor="card-summary"
      error={errors?.shortNote}
    >
      <Textarea
        id="card-summary"
        value={data.shortNote}
        onChange={(e) => onChange({ shortNote: e.target.value })}
        placeholder="Los puntos más importantes en pocas palabras…"
        rows={3}
        required
      />
    </Field>
  </>
);

/* ---------- Visual Card fields ---------- */

export interface VisualCardData {
  title: string;
  urlImage?: string;
  file?: File;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB — matches Cloudinary cap

export const VisualCardFields = ({
  data,
  onChange,
  errors,
}: FieldsProps<VisualCardData>) => {
  const [previewUrl, setPreviewUrl] = useState<string>(data.urlImage ?? "");
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFileError("La imagen no puede superar los 10 MB.");
      return;
    }
    setFileError(null);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onChange({ file });
  };

  return (
    <>
      <Field
        label="Título / descripción"
        htmlFor="visual-title"
        hint="Una línea sobre el contenido visual"
        error={errors?.title}
      >
        <Input
          id="visual-title"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ej. Diagrama de flujo de la integral indefinida"
          maxLength={100}
          required
        />
      </Field>

      <Field
        label="Imagen"
        htmlFor="visual-file"
        hint="JPG, PNG o GIF — máximo 10 MB"
        error={fileError ?? undefined}
      >
        <input
          id="visual-file"
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="block w-full text-[13px] text-v2-ink-2 file:mr-3 file:py-2 file:px-3 file:rounded-v2-sm file:border file:border-v2-line file:bg-v2-bg file:text-v2-primary-deep file:font-medium hover:file:bg-v2-primary-pale file:cursor-pointer cursor-pointer"
        />
      </Field>

      {previewUrl && (
        <div className="mb-4">
          <div className="font-v2-mono text-[10px] tracking-[1.5px] uppercase text-v2-ink-3 mb-2">
            Vista previa
          </div>
          <div className="bg-v2-bg border border-v2-line rounded-v2-sm p-3 flex items-center justify-center max-h-[260px] overflow-hidden">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="max-h-[240px] max-w-full object-contain rounded"
            />
          </div>
        </div>
      )}

      {!previewUrl && !data.urlImage && (
        <div className="mb-4 flex items-center gap-3 text-[13px] text-v2-ink-3">
          <ImageIcon size={16} />
          <span>Selecciona una imagen para ver la vista previa.</span>
        </div>
      )}
    </>
  );
};

/* ---------- Type union helper ---------- */

export type CardFormData =
  | ({ learningMethod: "activeRecall" } & ActiveRecallData)
  | ({ learningMethod: "cornell" } & CornellData)
  | ({ learningMethod: "visualCard" } & VisualCardData);

export const buildCreatePayload = (data: CardFormData): CreateCardPayload => {
  if (data.learningMethod === "activeRecall") {
    return {
      title: data.questionTitle,
      learningMethod: "activeRecall",
      questionTitle: data.questionTitle,
      answer: data.answer,
    };
  }
  if (data.learningMethod === "cornell") {
    return {
      title: data.title,
      learningMethod: "cornell",
      principalNote: data.principalNote,
      noteQuestions: data.noteQuestions,
      shortNote: data.shortNote,
    };
  }
  return {
    title: data.title,
    learningMethod: "visualCard",
    urlImage: data.urlImage,
    file: data.file,
  };
};
