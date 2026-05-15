// V2 deck components shared across /inicio (recent decks row),
// /mazos (full grid), and /mazos/:title (deck detail).

export {
  DeckCard,
  DeckCardSkeleton,
  colorForDeck,
  type DeckCardProps,
} from "./DeckCard";
export { CreateDeckCard, type CreateDeckCardProps } from "./CreateDeckCard";
export {
  CreateDeckModal,
  type CreateDeckModalProps,
} from "./CreateDeckModal";

// Deck detail
export {
  DeckDetailHeader,
  type DeckDetailHeaderProps,
} from "./DeckDetailHeader";
export {
  DeckSummaryCard,
  type DeckSummaryCardProps,
} from "./DeckSummaryCard";
export {
  CardPreview,
  ActiveRecallPreview,
  CornellPreview,
  VisualPreview,
} from "./CardPreview";
export { CardGridItem, type CardGridItemProps } from "./CardGridItem";
export { AddCardCard, type AddCardCardProps } from "./AddCardCard";
export {
  ActiveRecallFields,
  CornellFields,
  VisualCardFields,
  buildCreatePayload,
  type ActiveRecallData,
  type CornellData,
  type VisualCardData,
  type CardFormData,
} from "./CardFormFields";
export { CardForm, type CardFormProps } from "./CardForm";
export { CardModal, type CardModalProps } from "./CardModal";
export {
  LiveCardPreview,
  type LiveCardPreviewProps,
} from "./LiveCardPreview";

// Exam logging (deck-scoped)
export { LogExamModal, type LogExamModalProps } from "./LogExamModal";
// BulkImportModal is intentionally not re-exported here: it is lazy-loaded
// directly so exceljs stays in its own chunk.
export {
  ExamHistoryPanel,
  type ExamHistoryPanelProps,
} from "./ExamHistoryPanel";
