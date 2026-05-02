import { Link } from "react-router-dom";
import { Plus, Brain, ChevronLeft } from "lucide-react";
import { Button, IconButton } from "@/components/ui";

export interface DeckDetailHeaderProps {
  /** Display title of the deck. */
  title: string;
  /** Original URL slug — needed for the "Estudiar" link target if applicable. */
  onAddCard: () => void;
}

/**
 * Top of the deck detail page: back-arrow + breadcrumb + page title +
 * primary actions (Estudiar mazo / Agregar carta).
 *
 * The "Estudiar mazo" CTA links to /sesionesEstudio (the session-setup
 * route); the user picks the deck from there once that screen migrates.
 */
export const DeckDetailHeader = ({
  title,
  onAddCard,
}: DeckDetailHeaderProps) => (
  <div className="mb-7">
    {/* Breadcrumb row */}
    <div className="flex items-center gap-3 mb-3">
      <Link to="/mazos" aria-label="Volver a mis mazos">
        <IconButton variant="default" size="sm">
          <ChevronLeft size={16} />
        </IconButton>
      </Link>
      <Link
        to="/mazos"
        className="text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors"
      >
        Mis Mazos
      </Link>
      <span className="text-[13px] text-v2-ink-3">/</span>
      <span className="text-[13px] text-v2-ink font-medium truncate">
        {title}
      </span>
    </div>

    {/* Title row */}
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px] text-v2-ink">
        {title}
      </h1>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button onClick={onAddCard} variant="secondary">
          <Plus size={16} /> Agregar carta
        </Button>
        <Link to="/sesionesEstudio">
          <Button variant="primary">
            <Brain size={16} /> Estudiar mazo
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
