import { lazy, Suspense, useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Upload } from "lucide-react";
import { Button, useToast, IconButton } from "@/components/ui";
import { useDecks } from "@/hooks/useDeck";
import { useCards } from "@/hooks/useCards";
import { type CreateCardPayload } from "@/types/card.types";
import {
  CardForm,
  LiveCardPreview,
  colorForDeck,
  type CardFormData,
} from "@/components/decks";

// Lazy: pulls exceljs into its own chunk, loaded only when opened.
const BulkImportModal = lazy(() =>
  import("@/components/decks/BulkImportModal").then((m) => ({
    default: m.BulkImportModal,
  }))
);

const INITIAL_PREVIEW_DATA: CardFormData = {
  learningMethod: "activeRecall",
  title: "",
  questionTitle: "",
  answer: "",
};

const NotFound = ({ slug }: { slug: string }) => (
  <div className="text-center py-20">
    <h2 className="text-[24px] font-medium m-0 mb-3 text-v2-ink">
      Mazo no encontrado
    </h2>
    <p className="text-v2-ink-2 m-0 mb-6 max-w-md mx-auto">
      No pudimos encontrar un mazo llamado{" "}
      <span className="font-medium text-v2-ink">"{slug}"</span>.
    </p>
    <Link to="/mazos">
      <Button variant="secondary">
        <ChevronLeft size={16} /> Volver a mis mazos
      </Button>
    </Link>
  </div>
);

const NewCard = () => {
  const { title } = useParams<{ title: string }>();
  const decoded = decodeURIComponent(title ?? "");
  const navigate = useNavigate();
  const showToast = useToast();
  const { decks, loading: decksLoading } = useDecks();
  const deck = decks.find((d) => d.title === decoded);
  const { createCard } = useCards(deck?.deckId);

  const [previewData, setPreviewData] =
    useState<CardFormData>(INITIAL_PREVIEW_DATA);
  const [bulkOpen, setBulkOpen] = useState(false);

  // Stable identity so CardForm's onDataChange effect only fires when the
  // form state actually changes.
  const handleDataChange = useCallback((d: CardFormData) => {
    setPreviewData(d);
  }, []);

  const deckUrl = `/mazos/${encodeURIComponent(decoded)}`;
  const goBack = () => navigate(deckUrl);

  if (decksLoading) {
    return (
      <div className="animate-v2-fade max-w-[1100px]">
        <div className="h-9 w-48 bg-v2-line rounded mb-3 animate-pulse" />
        <div className="h-12 w-1/2 bg-v2-line rounded mb-7 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="h-96 bg-v2-surface border border-v2-line rounded-v2-lg animate-pulse" />
          <div className="h-72 bg-v2-surface border border-v2-line rounded-v2-lg animate-pulse" />
        </div>
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

  const handleSubmit = async (payload: CreateCardPayload) => {
    await createCard(payload);
  };

  const handleSuccess = (stayOnPage: boolean) => {
    showToast("Carta creada", { kind: "success" });
    if (!stayOnPage) {
      navigate(deckUrl);
    }
  };

  return (
    <div className="animate-v2-fade max-w-[1100px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-3">
        <IconButton
          variant="default"
          size="sm"
          onClick={goBack}
          aria-label={`Volver a ${deck.title}`}
        >
          <ChevronLeft size={16} />
        </IconButton>
        <Link
          to="/mazos"
          className="text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors"
        >
          Mis Mazos
        </Link>
        <span className="text-[13px] text-v2-ink-3">/</span>
        <Link
          to={deckUrl}
          className="text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors truncate max-w-[260px]"
        >
          {deck.title}
        </Link>
        <span className="text-[13px] text-v2-ink-3">/</span>
        <span className="text-[13px] text-v2-ink font-medium">Nueva carta</span>
      </div>

      {/* Title */}
      <div className="mb-7 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px] text-v2-ink">
            Crear carta
          </h1>
          <p className="text-[15px] text-v2-ink-2 m-0 mt-1.5">
            en <span className="text-v2-ink font-medium">{deck.title}</span>
          </p>
        </div>
        <Button variant="secondary" onClick={() => setBulkOpen(true)}>
          <Upload size={16} /> Carga masiva
        </Button>
      </div>

      {/* Two-column: form (left) + sticky live preview (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-7 sm:p-8">
          <CardForm
            onCancel={goBack}
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
            onDataChange={handleDataChange}
            showStayOption
          />
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 mb-3 font-medium">
            Vista previa
          </div>
          <LiveCardPreview data={previewData} deckColor={accentColor} />
          <p className="mt-3 text-xs text-v2-ink-3 leading-[1.5]">
            Así se verá tu carta en{" "}
            <span className="font-medium text-v2-ink-2">{deck.title}</span>.
          </p>
        </aside>
      </div>

      {bulkOpen && (
        <Suspense fallback={null}>
          <BulkImportModal
            open={bulkOpen}
            onClose={() => setBulkOpen(false)}
            deckId={deck.deckId}
            deckTitle={deck.title}
            onImported={() => {
              showToast("Cartas importadas", { kind: "success" });
              navigate(deckUrl);
            }}
          />
        </Suspense>
      )}
    </div>
  );
};

export default NewCard;
