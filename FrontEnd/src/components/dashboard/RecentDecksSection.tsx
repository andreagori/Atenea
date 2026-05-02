import { Link } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { type Deck } from "@/hooks/useDeck";
import { DeckCard, DeckCardSkeleton } from "@/components/decks";

export interface RecentDecksSectionProps {
  decks: Deck[];
  loading: boolean;
}

const EmptyState = () => (
  <Link
    to="/mazos"
    className="col-span-full bg-v2-surface border-2 border-dashed border-v2-line rounded-v2-lg p-10 text-center block transition-colors duration-150 hover:border-v2-primary-soft"
  >
    <div className="inline-flex w-12 h-12 rounded-full bg-v2-primary-pale text-v2-primary-deep items-center justify-center mb-3">
      <Plus size={22} />
    </div>
    <h3 className="text-[18px] font-medium m-0 mb-1 text-v2-ink">
      Aún no tienes mazos
    </h3>
    <p className="text-sm text-v2-ink-2 m-0">
      Crea el primero para empezar a estudiar.
    </p>
  </Link>
);

/**
 * Renders the 3 most-recently-created decks. Sorting on `createdAt` desc
 * because no per-deck "lastStudied" field is tracked by the backend yet —
 * see RESEARCH_IMPLEMENTATION_PLAN.md Track 3 for the eventual fix.
 */
export const RecentDecksSection = ({ decks, loading }: RecentDecksSectionProps) => {
  const recent = [...decks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[18px] font-medium m-0 text-v2-ink">
          Mazos recientes
        </h2>
        {decks.length > 0 && (
          <Link
            to="/mazos"
            className="inline-flex items-center gap-1 text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors"
          >
            Ver todos <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <DeckCardSkeleton />
            <DeckCardSkeleton />
            <DeckCardSkeleton />
          </>
        ) : recent.length === 0 ? (
          <EmptyState />
        ) : (
          recent.map((d) => <DeckCard key={d.deckId} deck={d} />)
        )}
      </div>
    </section>
  );
};
