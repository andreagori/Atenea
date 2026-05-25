import { Eye, Image as ImageIcon } from "lucide-react";

export interface RuntimeCard {
  cardId: number;
  title: string;
  /** Lower-cased: 'activerecall' | 'cornell' | 'visualcard' (see useStudySessions hook). */
  learningMethod: string;
  answer?: string;
  principalNote?: string;
  urlImage?: string;
  activeRecall?: { answer: string; questionTitle: string };
  cornell?: {
    principalNote: string;
    noteQuestions: string;
    shortNote: string;
  };
  visualCard?: { urlImage: string };
}

export interface StudyCardDisplayProps {
  card: RuntimeCard;
  /** When false: only the prompt side is shown. When true: the type-specific
   *  answer (text / Cornell zones / image) is revealed. */
  revealed: boolean;
}

const Eyebrow = ({ children }: { children: string }) => (
  <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 font-medium mb-2">
    {children}
  </div>
);

// The real prompt depends on the learning method, not the card.title (which
// is just a label/topic). Falls back to title if the specific field is empty.
const getPrompt = (card: RuntimeCard): string => {
  switch (card.learningMethod.toLowerCase()) {
    case "activerecall":
      return card.activeRecall?.questionTitle || card.title;
    case "cornell":
      return card.cornell?.noteQuestions || card.title;
    default:
      return card.title;
  }
};

const PromptSide = ({ prompt }: { prompt: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
    <Eyebrow>Pregunta</Eyebrow>
    <h2 className="text-[28px] font-medium leading-[1.2] text-v2-ink m-0 max-w-[640px]">
      {prompt}
    </h2>
    <p className="text-sm text-v2-ink-2 m-0 mt-2 max-w-md">
      Intenta recordar antes de revelar la respuesta.
    </p>
  </div>
);

const ActiveRecallAnswer = ({ card }: { card: RuntimeCard }) => {
  const answer = card.activeRecall?.answer || card.answer;
  return (
    <div className="py-2">
      <Eyebrow>Respuesta</Eyebrow>
      <p className="text-[18px] leading-[1.55] text-v2-ink whitespace-pre-wrap m-0">
        {answer || "Sin respuesta registrada."}
      </p>
    </div>
  );
};

const CornellAnswer = ({ card }: { card: RuntimeCard }) => {
  const principal = card.cornell?.principalNote ?? card.principalNote ?? "—";
  const questions = card.cornell?.noteQuestions ?? "—";
  const summary = card.cornell?.shortNote ?? "—";
  return (
    <div className="py-2 grid gap-3">
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
        <Zone label="Ideas / preguntas" body={questions} />
        <Zone label="Nota principal" body={principal} />
      </div>
      <Zone label="Resumen" body={summary} />
    </div>
  );
};

const Zone = ({ label, body }: { label: string; body: string }) => (
  <div className="bg-v2-paper rounded-v2-sm px-4 py-3 border border-v2-line">
    <div className="font-v2-mono text-[10px] tracking-[1.5px] uppercase text-v2-ink-3 font-medium mb-1.5">
      {label}
    </div>
    <p className="text-[14px] text-v2-ink leading-[1.5] whitespace-pre-wrap break-words m-0 max-h-[180px] overflow-y-auto pr-1">
      {body}
    </p>
  </div>
);

const VisualAnswer = ({ card }: { card: RuntimeCard }) => {
  const url = card.visualCard?.urlImage || card.urlImage;
  return (
    <div className="py-2">
      <Eyebrow>Imagen</Eyebrow>
      {url ? (
        // Hard-cap the visual content area so a tall image (e.g. screenshot
        // of code) can't push the rating buttons off the viewport. 420px
        // works on laptop displays without feeling cramped.
        <div className="rounded-v2-sm overflow-hidden bg-v2-paper border border-v2-line flex items-center justify-center h-[420px]">
          <img
            src={url}
            alt={card.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-v2-ink-3">
          <ImageIcon size={32} />
          <p className="text-sm m-0">Sin imagen disponible.</p>
        </div>
      )}
    </div>
  );
};

/**
 * Renders the in-session study card.
 * - Pre-reveal: shows the title as a recall prompt.
 * - Post-reveal: shows the type-specific answer (text / Cornell zones / image).
 *
 * Cornell renders all three zones (ideas, principal note, summary) — richer
 * than the prototype which only surfaced principalNote.
 */
export const StudyCardDisplay = ({
  card,
  revealed,
}: StudyCardDisplayProps) => {
  const renderAnswer = () => {
    switch (card.learningMethod.toLowerCase()) {
      case "activerecall":
        return <ActiveRecallAnswer card={card} />;
      case "cornell":
        return <CornellAnswer card={card} />;
      case "visualcard":
        return <VisualAnswer card={card} />;
      default:
        return (
          <p className="text-sm text-v2-ink-2 m-0">
            Tipo de carta no soportado: {card.learningMethod}
          </p>
        );
    }
  };

  return (
    <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-6 sm:p-8 shadow-v2-sm">
      {!revealed ? (
        <PromptSide prompt={getPrompt(card)} />
      ) : (
        <div>
          <h2 className="text-[20px] font-medium m-0 mb-4 text-v2-ink-2 flex items-start gap-2">
            <Eye size={18} className="text-v2-primary mt-1 flex-shrink-0" />
            <span>{getPrompt(card)}</span>
          </h2>
          {renderAnswer()}
        </div>
      )}
    </div>
  );
};
