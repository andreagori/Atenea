import { useEffect, useMemo } from "react";
import { type Card } from "@/hooks/useCards";
import { CardPreview } from "./CardPreview";
import { type CardFormData } from "./CardFormFields";

const PLACEHOLDER = {
  question: "Tu pregunta aparecerá aquí",
  answer: "Voltea para ver la respuesta…",
  title: "Tu título aparecerá aquí",
  principalNote: "La nota principal aparecerá aquí…",
  noteQuestions: "Las ideas / preguntas aparecerán aquí…",
  shortNote: "El resumen aparecerá aquí…",
  description: "Tu descripción aparecerá aquí",
};

const buildMockCard = (
  data: CardFormData,
  fileUrl: string | null
): Card => {
  if (data.learningMethod === "activeRecall") {
    return {
      cardId: -1,
      deckId: -1,
      title: data.questionTitle.trim() || PLACEHOLDER.question,
      learningMethod: "activeRecall",
      activeRecall: {
        cardId: -1,
        questionTitle: data.questionTitle.trim() || PLACEHOLDER.question,
        answer: data.answer.trim() || PLACEHOLDER.answer,
      },
    };
  }
  if (data.learningMethod === "cornell") {
    return {
      cardId: -1,
      deckId: -1,
      title: data.title.trim() || PLACEHOLDER.title,
      learningMethod: "cornell",
      cornell: {
        cardId: -1,
        principalNote:
          data.principalNote.trim() || PLACEHOLDER.principalNote,
        noteQuestions:
          data.noteQuestions.trim() || PLACEHOLDER.noteQuestions,
        shortNote: data.shortNote.trim() || PLACEHOLDER.shortNote,
      },
    };
  }
  return {
    cardId: -1,
    deckId: -1,
    title: data.title.trim() || PLACEHOLDER.description,
    learningMethod: "visualCard",
    visualCard: {
      cardId: -1,
      urlImage: fileUrl ?? data.urlImage ?? "",
    },
  };
};

export interface LiveCardPreviewProps {
  data: CardFormData;
  deckColor: string;
}

/**
 * Renders the same `<CardPreview>` used on the deck detail page, but driven
 * by in-flight form data so users see what their card will look like as
 * they type. Empty fields show placeholder copy.
 *
 * For visual cards: a blob URL is created from `data.file` via useMemo
 * keyed on the File reference itself (not on `data`, which is a new object
 * every keystroke), so the URL is stable across renders. Cleaned up via
 * URL.revokeObjectURL on unmount or file-change.
 */
export const LiveCardPreview = ({ data, deckColor }: LiveCardPreviewProps) => {
  const file =
    data.learningMethod === "visualCard" ? (data.file ?? null) : null;

  const fileUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const mockCard = useMemo(
    () => buildMockCard(data, fileUrl),
    [data, fileUrl]
  );

  return <CardPreview card={mockCard} deckColor={deckColor} />;
};
