import { Plus } from "lucide-react";

const PREVIEW_HEIGHT = 280;

export interface AddCardCardProps {
  onClick: () => void;
}

/**
 * Dashed-border placeholder that lives at the end of the cards grid.
 * Matches the height of CardPreview previews so the grid alignment is
 * consistent.
 */
export const AddCardCard = ({ onClick }: AddCardCardProps) => (
  <div className="flex flex-col">
    <button
      type="button"
      onClick={onClick}
      style={{ height: PREVIEW_HEIGHT }}
      className="flex flex-col items-center justify-center gap-2 bg-transparent border-[1.5px] border-dashed border-v2-line-2 rounded-v2-lg text-v2-ink-2 transition-[background-color,border-color,color] duration-200 hover:border-v2-primary-soft hover:bg-v2-primary/[0.04] hover:text-v2-primary-deep"
    >
      <Plus size={22} />
      <span className="text-sm font-medium">Agregar carta</span>
    </button>
    {/* Empty action-row spacer so this cell aligns vertically with siblings */}
    <div className="h-[34px] mt-2" aria-hidden />
  </div>
);
