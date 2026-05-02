import { Modal } from "@/components/ui";
import { type Card } from "@/hooks/useCards";
import { type CreateCardPayload } from "@/types/card.types";
import { CardForm } from "./CardForm";

export interface CardModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * If provided, modal opens in EDIT mode for that card. Otherwise CREATE.
   * (Card type is locked in edit mode — the backend stores per-type rows
   * keyed off the card's learningMethod, so changing it would orphan data.)
   */
  initialCard?: Card;
  /** Required in create mode. */
  onCreate?: (payload: CreateCardPayload) => Promise<void>;
  /** Required in edit mode. */
  onUpdate?: (cardId: number, payload: CreateCardPayload) => Promise<void>;
}

/**
 * Thin wrapper: <Modal> chrome + <CardForm> inside. The form does all the
 * heavy lifting (type picker, validation, submit, error banner).
 *
 * Note: the same <CardForm> is used full-page on /mazos/:title/nueva-carta
 * for the "create many cards in a row" flow with a stay-on-page checkbox.
 */
export const CardModal = ({
  open,
  onClose,
  initialCard,
  onCreate,
  onUpdate,
}: CardModalProps) => {
  const editMode = initialCard !== undefined;

  const handleSubmit = async (payload: CreateCardPayload) => {
    if (editMode && onUpdate && initialCard) {
      await onUpdate(initialCard.cardId, payload);
    } else if (onCreate) {
      await onCreate(payload);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editMode ? "Editar carta" : "Crear carta"}
      maxWidth={580}
    >
      <CardForm
        initialCard={initialCard}
        onCancel={onClose}
        onSubmit={handleSubmit}
        onSuccess={() => onClose()}
      />
    </Modal>
  );
};
