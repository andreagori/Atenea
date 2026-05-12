import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { type DueDeck } from "@/hooks/useDueToday";

export interface DueTodaySectionProps {
  decks: DueDeck[];
  total: number;
  loading: boolean;
}

const Loading = () => (
  <section className="mb-8">
    <div className="h-24 bg-v2-surface border border-v2-line rounded-v2-lg animate-pulse" />
  </section>
);

export const DueTodaySection = ({
  decks,
  total,
  loading,
}: DueTodaySectionProps) => {
  if (loading) return <Loading />;
  if (total === 0) return null;

  const top = [...decks]
    .sort((a, b) => b.dueCount - a.dueCount)
    .slice(0, 3);

  const headline =
    total === 1
      ? "Tienes 1 carta para repasar hoy"
      : `Tienes ${total} cartas para repasar hoy`;

  const first = decks[0];

  return (
    <section className="mb-8">
      <div className="bg-v2-primary-pale border border-v2-primary-tint rounded-v2-lg p-5 sm:p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v2-primary text-white flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-medium m-0 text-v2-ink leading-tight">
              {headline}
            </h2>
            <p className="text-[13px] text-v2-ink-2 m-0 mt-1">
              En {decks.length} {decks.length === 1 ? "mazo" : "mazos"}
            </p>

            {top.length > 0 && (
              <ul className="m-0 mt-3 mb-0 list-none p-0 flex flex-col gap-1.5">
                {top.map((d) => (
                  <li key={d.deckId}>
                    <Link
                      to={`/sesionesEstudio?deckId=${d.deckId}`}
                      className="inline-flex items-center gap-1 text-[13px] text-v2-primary-deep hover:text-v2-primary transition-colors"
                    >
                      <span className="font-medium">{d.deckTitle}</span>
                      <span className="text-v2-ink-2">
                        · {d.dueCount} {d.dueCount === 1 ? "carta" : "cartas"}
                      </span>
                      <ChevronRight size={14} className="opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {first && (
            <div className="flex-shrink-0">
              <Link to={`/sesionesEstudio?deckId=${first.deckId}`}>
                <Button variant="primary">
                  Comenzar repaso
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
