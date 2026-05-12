import {
  BookOpen,
  ChevronDown,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Deck } from "@/hooks/useDeck";

export interface DeckPickerProps {
  decks: Deck[];
  value: number | null;
  onChange: (deckId: number) => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * V2 deck selector. Uses a raw <select> so the wrapper can carry the border
 * and state styling (border/background change on selection). Centering of
 * the leading/trailing icons is done with `inset-y-0 flex items-center` —
 * more reliable across browsers than `top-1/2 + translate`.
 */
export const DeckPicker = ({
  decks,
  value,
  onChange,
  loading,
  error,
}: DeckPickerProps) => {
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2.5 px-4 py-[11px] rounded-v2-sm border border-v2-line bg-v2-surface text-[13px] text-v2-ink-2">
        <Loader2 size={16} className="animate-spin text-v2-primary" />
        Cargando mazos…
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20 text-[13px]"
      >
        <AlertCircle size={16} />
        No se pudieron cargar los mazos.
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="px-4 py-3 rounded-v2-sm border border-dashed border-v2-line text-[13px] text-v2-ink-2 max-w-md">
        Aún no tienes mazos. Crea uno desde{" "}
        <span className="text-v2-ink font-medium">Mis mazos</span> para
        empezar a estudiar.
      </div>
    );
  }

  const selected = value !== null;

  return (
    <div className="max-w-md">
      <div
        className={cn(
          "relative rounded-v2-sm border bg-v2-surface transition-[border-color,background-color,box-shadow] duration-150",
          "focus-within:ring-[3px] focus-within:ring-v2-primary/[0.12]",
          selected
            ? "border-v2-primary bg-v2-primary-pale"
            : "border-v2-line hover:border-v2-line-2"
        )}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <BookOpen
            size={16}
            className={selected ? "text-v2-primary-deep" : "text-v2-ink-2"}
          />
        </span>

        <select
          value={value ?? ""}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n) && n > 0) onChange(n);
          }}
          className={cn(
            "w-full pl-10 pr-10 py-[11px] text-sm appearance-none cursor-pointer",
            "bg-transparent border-0 rounded-v2-sm outline-none focus:ring-0",
            selected ? "text-v2-primary-deep font-medium" : "text-v2-ink"
          )}
        >
          <option value="" disabled>
            Selecciona un mazo
          </option>
          {decks.map((d) => (
            <option key={d.deckId} value={d.deckId}>
              {d.title}
            </option>
          ))}
        </select>

        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
          {selected ? (
            <Check size={16} className="text-v2-primary-deep" />
          ) : (
            <ChevronDown size={16} className="text-v2-ink-2" />
          )}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-v2-ink-3">
        {decks.length}{" "}
        {decks.length === 1 ? "mazo disponible" : "mazos disponibles"}
      </p>
    </div>
  );
};
