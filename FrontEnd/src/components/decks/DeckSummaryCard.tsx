import { type Card } from "@/hooks/useCards";

export interface DeckSummaryCardProps {
  /** Optional deck description (Deck.body). */
  description?: string | null;
  cards: Card[];
  /** Stable color stripe — pass result of colorForDeck(deckId). */
  accentColor: string;
}

const TYPE_LABEL: Record<string, string> = {
  activeRecall: "Repaso Activo",
  cornell: "Cornell",
  visualCard: "Visual",
};

/**
 * Compact summary panel below the deck header. Replaces the prototype's
 * "mastery progress bar" — Atenea doesn't track per-deck mastery yet
 * (Track 5 in RESEARCH_IMPLEMENTATION_PLAN.md). Instead we show the deck
 * description + total card count + a breakdown by learning method, all
 * derived from real fields.
 */
export const DeckSummaryCard = ({
  description,
  cards,
  accentColor,
}: DeckSummaryCardProps) => {
  const total = cards.length;
  const counts = cards.reduce<Record<string, number>>((acc, c) => {
    acc[c.learningMethod] = (acc[c.learningMethod] ?? 0) + 1;
    return acc;
  }, {});
  const breakdown = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([method, n]) => ({
      label: TYPE_LABEL[method] ?? method,
      count: n,
    }));

  return (
    <div className="relative overflow-hidden bg-v2-surface border border-v2-line rounded-v2-lg px-7 py-6 mb-7">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: accentColor }}
      />
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 mb-2 font-medium">
            Sobre este mazo
          </div>
          <p className="text-[15px] text-v2-ink leading-[1.55] m-0">
            {description?.trim() ? description : "Sin descripción."}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="text-[36px] font-v2-serif italic leading-none text-v2-primary-deep">
            {total}
          </div>
          <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3">
            {total === 1 ? "carta" : "cartas"}
          </div>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-v2-line">
          {breakdown.map((b) => (
            <span
              key={b.label}
              className="font-v2-mono text-[11px] tracking-[1px] uppercase px-2.5 py-1 rounded-full bg-v2-bg text-v2-ink-2"
            >
              {b.count} · {b.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
