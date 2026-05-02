import { Link } from "react-router-dom";
import { type Deck } from "@/hooks/useDeck";

const PALETTE = [
  "var(--color-v2-primary)",
  "var(--color-v2-violet)",
  "var(--color-v2-magenta)",
  "var(--color-v2-coral)",
  "var(--color-v2-green)",
  "var(--color-v2-amber)",
];

/** Stable color per deck so the visual stays consistent across renders. */
export const colorForDeck = (deckId: number): string =>
  PALETTE[Math.abs(deckId) % PALETTE.length];

export interface DeckCardProps {
  deck: Deck;
}

/**
 * Used on /inicio (recent decks row) and /mazos (full grid).
 * Click navigates to the deck detail at /mazos/:title; edit and delete
 * actions live on that detail page (not on the index card) — keeps the
 * grid visually quiet and matches the V2 design.
 */
export const DeckCard = ({ deck }: DeckCardProps) => {
  const color = colorForDeck(deck.deckId);
  return (
    <Link
      to={`/mazos/${encodeURIComponent(deck.title)}`}
      className="relative overflow-hidden bg-v2-surface border border-v2-line rounded-v2-lg p-5 pt-6 block transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-v2-line-2 hover:shadow-v2-md"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: color }}
      />
      <h3 className="text-[18px] font-medium m-0 mb-1.5 truncate text-v2-ink">
        {deck.title}
      </h3>
      {deck.body && (
        <p className="text-sm text-v2-ink-2 m-0 line-clamp-2 leading-[1.5]">
          {deck.body}
        </p>
      )}
    </Link>
  );
};

/** Skeleton placeholder matching DeckCard's footprint. */
export const DeckCardSkeleton = () => (
  <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-5 pt-6 animate-pulse">
    <div className="h-5 w-3/4 bg-v2-line rounded mb-3" />
    <div className="h-3.5 w-full bg-v2-line/70 rounded mb-1.5" />
    <div className="h-3.5 w-1/2 bg-v2-line/70 rounded" />
  </div>
);
