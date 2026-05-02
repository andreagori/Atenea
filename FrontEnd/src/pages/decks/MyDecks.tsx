import { useState } from "react";
import { Plus } from "lucide-react";
import { useDecks } from "@/hooks/useDeck";
import { Button } from "@/components/ui";
import {
  DeckCard,
  DeckCardSkeleton,
  CreateDeckCard,
  CreateDeckModal,
} from "@/components/decks";

const SKELETON_COUNT = 6;

const ErrorBanner = ({ message }: { message: string }) => (
  <div
    role="alert"
    className="text-[14px] px-4 py-3 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
  >
    No se pudieron cargar los mazos. {message}
  </div>
);

const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="bg-v2-surface border-2 border-dashed border-v2-line rounded-v2-lg px-8 py-16 text-center">
    <div className="inline-flex w-14 h-14 rounded-full bg-v2-primary-pale text-v2-primary-deep items-center justify-center mb-4">
      <Plus size={26} />
    </div>
    <h2 className="text-[22px] font-medium m-0 mb-2 text-v2-ink">
      Crea tu primer mazo
    </h2>
    <p className="text-[15px] text-v2-ink-2 m-0 mb-6 max-w-md mx-auto leading-[1.55]">
      Cada mazo es un tema o materia. Dentro guardas las cartas que vas a
      estudiar.
    </p>
    <Button onClick={onCreate} variant="primary" size="lg">
      <Plus size={16} /> Crear mi primer mazo
    </Button>
  </div>
);

const MyDecks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { decks, loading, error, createDeck, refetch } = useDecks();

  const count = decks.length;

  return (
    <div className="animate-v2-fade">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <div className="text-[18px] text-v2-ink-3 font-normal mb-1.5">
            {loading
              ? "Cargando…"
              : count > 0
                ? `${count} mazo${count === 1 ? "" : "s"} en tu biblioteca`
                : "Aún no tienes mazos"}
          </div>
          <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px]">
            Mis Mazos
          </h1>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          variant="primary"
          className="self-end"
        >
          <Plus size={16} /> Crear mazo
        </Button>
      </div>

      {error ? (
        <ErrorBanner message={error} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <DeckCardSkeleton key={i} />
          ))}
        </div>
      ) : count === 0 ? (
        <EmptyState onCreate={() => setModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((d) => (
            <DeckCard key={d.deckId} deck={d} />
          ))}
          <CreateDeckCard onClick={() => setModalOpen(true)} />
        </div>
      )}

      <CreateDeckModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={async (title, body) => {
          await createDeck(title, body);
          await refetch();
        }}
      />
    </div>
  );
};

export default MyDecks;
