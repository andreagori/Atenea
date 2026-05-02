import { Pencil, Trash2 } from "lucide-react";
import { type Card } from "@/hooks/useCards";
import { IconButton } from "@/components/ui";
import { CardPreview } from "./CardPreview";

const TYPE_LABEL: Record<string, string> = {
  activeRecall: "Repaso Activo",
  cornell: "Cornell",
  visualCard: "Visual",
};

export interface CardGridItemProps {
  card: Card;
  deckColor: string;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

/**
 * Composes a single grid cell: type-specific preview on top + a small
 * action row beneath it (type label + edit/delete icon buttons).
 */
export const CardGridItem = ({
  card,
  deckColor,
  onEdit,
  onDelete,
}: CardGridItemProps) => (
  <div className="relative">
    <CardPreview card={card} deckColor={deckColor} />
    <div className="flex justify-between items-center mt-2">
      <div className="font-v2-mono text-[11px] text-v2-ink-3 tracking-[1.2px] uppercase">
        {TYPE_LABEL[card.learningMethod] ?? card.learningMethod}
      </div>
      <div className="flex gap-1">
        <IconButton
          size="sm"
          variant="default"
          onClick={() => onEdit(card)}
          aria-label={`Editar ${card.title}`}
          title="Editar"
        >
          <Pencil size={13} />
        </IconButton>
        <IconButton
          size="sm"
          variant="danger"
          onClick={() => onDelete(card)}
          aria-label={`Eliminar ${card.title}`}
          title="Eliminar"
        >
          <Trash2 size={13} />
        </IconButton>
      </div>
    </div>
  </div>
);
