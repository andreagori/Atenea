import { Plus } from "lucide-react";

export interface CreateDeckCardProps {
  onClick: () => void;
}

/**
 * Dashed-border placeholder card that lives at the end of the deck grid.
 * Per the V2 design, gives users a second prominent path to deck creation
 * (the page header has the primary "Crear mazo" CTA).
 */
export const CreateDeckCard = ({ onClick }: CreateDeckCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 min-h-[140px] bg-transparent border-[1.5px] border-dashed border-v2-line-2 rounded-v2-lg text-v2-ink-2 transition-[background-color,border-color,color] duration-200 hover:border-v2-primary-soft hover:bg-v2-primary/[0.04] hover:text-v2-primary-deep"
  >
    <Plus size={22} />
    <span className="text-sm font-medium">Crear nuevo mazo</span>
  </button>
);
