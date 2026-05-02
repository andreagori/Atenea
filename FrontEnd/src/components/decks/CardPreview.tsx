import { useState } from "react";
import { type Card } from "@/hooks/useCards";
import { cn } from "@/lib/utils";

const PREVIEW_HEIGHT = 280;

/**
 * Discriminator. Picks the right type-specific preview based on the card's
 * `learningMethod`. All three previews share the same outer height so the
 * grid stays visually balanced.
 */
export const CardPreview = ({
  card,
  deckColor,
}: {
  card: Card;
  deckColor: string;
}) => {
  if (card.learningMethod === "activeRecall") {
    return <ActiveRecallPreview card={card} deckColor={deckColor} />;
  }
  if (card.learningMethod === "cornell") {
    return <CornellPreview card={card} />;
  }
  return <VisualPreview card={card} />;
};

/* ---------- Active Recall ---------- */

export const ActiveRecallPreview = ({
  card,
  deckColor,
}: {
  card: Card;
  deckColor: string;
}) => {
  const [flipped, setFlipped] = useState(false);
  const front = card.activeRecall?.questionTitle || card.title;
  const back = card.activeRecall?.answer || "Sin respuesta registrada.";

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      style={{ perspective: 1200, height: PREVIEW_HEIGHT }}
      className="cursor-pointer focus:outline-none"
      aria-label={flipped ? "Mostrar pregunta" : "Mostrar respuesta"}
    >
      <div
        className="v2-flip-inner"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front
            color-mix(...) is used instead of the prototype's `${color}99`
            hex-alpha trick — `colorForDeck` returns CSS variables (and
            two of them are oklch), neither of which support the `99`
            suffix. color-mix gives the same fade-to-translucent effect
            and works across var()/oklch()/hex. */}
        <div
          className="v2-flip-face flex flex-col rounded-v2-lg px-6 py-5 text-white"
          style={{
            background: `linear-gradient(180deg, ${deckColor}, color-mix(in srgb, ${deckColor} 60%, transparent))`,
            boxShadow: "0 0 12px rgba(224,229,245,0.6)",
            border: "1.5px solid rgba(255,255,255,0.4)",
          }}
        >
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-center font-medium opacity-85">
            FRENTE
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-3">
            <div className="text-[22px] font-medium leading-[1.25]">
              {front}
            </div>
          </div>
          <div className="text-[11px] text-center opacity-75 font-v2-mono">
            ↻ Toca para voltear
          </div>
        </div>
        {/* Back */}
        <div
          className="v2-flip-face v2-flip-back flex flex-col rounded-v2-lg px-6 py-5 bg-v2-surface text-v2-ink"
          style={{ border: `1.5px solid ${deckColor}` }}
        >
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-center text-v2-ink-3 font-medium">
            REVERSO
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-2 overflow-auto">
            <div className="text-sm leading-[1.5] text-v2-ink-2">{back}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Cornell ---------- */

export const CornellPreview = ({ card }: { card: Card }) => {
  const ideas = card.cornell?.noteQuestions ?? "—";
  const notes = card.cornell?.principalNote ?? "—";
  const summary = card.cornell?.shortNote ?? "—";

  return (
    <div
      className="rounded-v2-lg p-3.5 flex flex-col gap-2"
      style={{
        height: PREVIEW_HEIGHT,
        background: "var(--color-v2-line)",
        border: "1.5px solid var(--color-v2-bg)",
      }}
    >
      <div className="flex-1 grid grid-cols-[85px_1fr] gap-2">
        <ZoneCard label="IDEAS" body={ideas} />
        <ZoneCard label="NOTAS" body={notes} />
      </div>
      <ZoneCard label="RESUMEN" body={summary} compact />
    </div>
  );
};

const ZoneCard = ({
  label,
  body,
  compact,
}: {
  label: string;
  body: string;
  compact?: boolean;
}) => (
  <div className="bg-v2-surface rounded-[10px] px-3 py-2.5 flex flex-col gap-1 overflow-hidden">
    <div className="font-v2-mono text-[10px] tracking-[1.5px] text-v2-ink-3 font-medium">
      {label}
    </div>
    <div
      className={cn(
        "text-[10px] text-v2-ink-2 leading-[1.4] whitespace-pre-wrap",
        compact ? "" : "overflow-hidden"
      )}
    >
      {body}
    </div>
  </div>
);

/* ---------- Visual ---------- */

export const VisualPreview = ({ card }: { card: Card }) => {
  const url = card.visualCard?.urlImage;
  const description = card.title;

  return (
    <div
      className="rounded-v2-lg overflow-hidden flex flex-col border-[1.5px] border-v2-line"
      style={{
        height: PREVIEW_HEIGHT,
        background: "linear-gradient(180deg, var(--color-v2-line) 0%, var(--color-v2-bg) 100%)",
      }}
    >
      <div className="flex-1 m-3 bg-v2-surface rounded-[14px] flex items-center justify-center overflow-hidden">
        {url ? (
          <img
            src={url}
            alt={description}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="font-v2-serif italic text-[40px] text-v2-ink-3">
            Sin imagen
          </div>
        )}
      </div>
      <div className="px-5 pt-2.5 pb-4 text-center">
        <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3 font-medium mb-1">
          DESCRIPCIÓN
        </div>
        <div className="text-[12px] text-v2-ink-2 leading-[1.5] line-clamp-2">
          {description}
        </div>
      </div>
    </div>
  );
};
