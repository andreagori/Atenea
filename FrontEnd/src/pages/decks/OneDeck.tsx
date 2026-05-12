import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { useDecks } from "@/hooks/useDeck";
import { useCards, type Card } from "@/hooks/useCards";
import { type CreateCardPayload } from "@/types/card.types";
import {
  DeckDetailHeader,
  DeckSummaryCard,
  CardGridItem,
  AddCardCard,
  CardModal,
  colorForDeck,
} from "@/components/decks";

const CARD_HEIGHT_PX = 280;

const CardSkeleton = () => (
  <div>
    <div
      className="bg-v2-surface border border-v2-line rounded-v2-lg animate-pulse"
      style={{ height: CARD_HEIGHT_PX }}
    />
    <div className="h-[34px] mt-2 bg-v2-line/40 rounded animate-pulse" />
  </div>
);

const ErrorBanner = ({ message }: { message: string }) => (
  <div
    role="alert"
    className="text-[14px] px-4 py-3 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
  >
    {message}
  </div>
);

const NotFound = ({ slug }: { slug: string }) => (
  <div className="text-center py-20">
    <h2 className="text-[24px] font-medium m-0 mb-3 text-v2-ink">
      Mazo no encontrado
    </h2>
    <p className="text-v2-ink-2 m-0 mb-6 max-w-md mx-auto">
      No pudimos encontrar un mazo llamado{" "}
      <span className="font-medium text-v2-ink">"{slug}"</span>. Es posible
      que se haya eliminado o renombrado.
    </p>
    <Link to="/mazos">
      <Button variant="secondary">
        <ChevronLeft size={16} /> Volver a mis mazos
      </Button>
    </Link>
  </div>
);

const EmptyCardsState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="bg-v2-surface border-2 border-dashed border-v2-line rounded-v2-lg px-8 py-16 text-center">
    <div className="inline-flex w-14 h-14 rounded-full bg-v2-primary-pale text-v2-primary-deep items-center justify-center mb-4">
      <Plus size={26} />
    </div>
    <h2 className="text-[22px] font-medium m-0 mb-2 text-v2-ink">
      Aún no hay cartas en este mazo
    </h2>
    <p className="text-[15px] text-v2-ink-2 m-0 mb-6 max-w-md mx-auto leading-[1.55]">
      Crea tu primera carta — Repaso Activo, Cornell o Visual.
    </p>
    <Button onClick={onAdd} variant="primary" size="lg">
      <Plus size={16} /> Crear carta
    </Button>
  </div>
);

const OneDeck = () => {
  const { title } = useParams<{ title: string }>();
  const decoded = decodeURIComponent(title ?? "");
  const navigate = useNavigate();
  const showToast = useToast();
  const { decks, loading: decksLoading, error: decksError } = useDecks();
  const deck = decks.find((d) => d.title === decoded);
  const deckId = deck?.deckId;
  const {
    cards,
    loading: cardsLoading,
    error: cardsError,
    updateCard,
    deleteCard,
  } = useCards(deckId);

  // Edit-only modal — card creation is its own page (/mazos/:title/nueva-carta).
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined);

  const goToCreate = () =>
    navigate(`/mazos/${encodeURIComponent(decoded)}/nueva-carta`);

  const handleUpdate = async (
    cardId: number,
    payload: CreateCardPayload
  ) => {
    // Visual cards re-uploading an image need multipart/form-data; the rest
    // can update via JSON. Match the dispatch in useCards.updateCard.
    if (payload.learningMethod === "visualCard" && payload.file) {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("learningMethod", payload.learningMethod);
      formData.append("file", payload.file);
      await updateCard(cardId, formData);
      showToast("Carta actualizada", { kind: "success" });
      return;
    }
    const {
      learningMethod: _ignored,
      file: _ignored2,
      ...rest
    } = payload;
    void _ignored;
    void _ignored2;
    await updateCard(cardId, rest);
    showToast("Carta actualizada", { kind: "success" });
  };

  const handleDelete = async (card: Card) => {
    const ok = window.confirm(
      `¿Eliminar "${card.title}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    try {
      await deleteCard(card.cardId);
      showToast("Carta eliminada", { kind: "success" });
    } catch (err) {
      console.error("Error deleting card:", err);
      showToast("No se pudo eliminar la carta.", { kind: "error" });
    }
  };

  if (decksLoading) {
    return (
      <div className="animate-v2-fade">
        <div className="h-9 w-48 bg-v2-line rounded mb-3 animate-pulse" />
        <div className="h-12 w-2/3 max-w-[480px] bg-v2-line rounded mb-7 animate-pulse" />
        <div className="h-32 bg-v2-surface border border-v2-line rounded-v2-lg mb-7 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (decksError) {
    return (
      <div className="animate-v2-fade">
        <ErrorBanner message={`No se pudo cargar el mazo. ${decksError}`} />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="animate-v2-fade">
        <NotFound slug={decoded} />
      </div>
    );
  }

  const accentColor = colorForDeck(deck.deckId);

  return (
    <div className="animate-v2-fade">
      <DeckDetailHeader
        title={deck.title}
        deckId={deck.deckId}
        onAddCard={goToCreate}
      />
      <DeckSummaryCard
        description={deck.body}
        cards={cards}
        accentColor={accentColor}
      />

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[18px] font-medium m-0 text-v2-ink">Cartas</h2>
        {!cardsLoading && !cardsError && (
          <span className="font-v2-mono text-[11px] tracking-[1px] uppercase text-v2-ink-3">
            {cards.length} {cards.length === 1 ? "carta" : "cartas"}
          </span>
        )}
      </div>

      {cardsError ? (
        <ErrorBanner message={`No se pudieron cargar las cartas. ${cardsError}`} />
      ) : cardsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <EmptyCardsState onAdd={goToCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <CardGridItem
              key={c.cardId}
              card={c}
              deckColor={accentColor}
              onEdit={(card) => setEditingCard(card)}
              onDelete={handleDelete}
            />
          ))}
          <AddCardCard onClick={goToCreate} />
        </div>
      )}

      {/* Edit-only modal. Creation flow lives at /mazos/:title/nueva-carta. */}
      <CardModal
        open={editingCard !== undefined}
        onClose={() => setEditingCard(undefined)}
        initialCard={editingCard}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default OneDeck;
