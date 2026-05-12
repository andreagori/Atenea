import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, LogOut, Brain } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { useStudySession } from "@/hooks/useStudySessions";
import {
  StudyCardDisplay,
  RatingMenu,
  SessionLoading,
  SessionError,
  SessionComplete,
  type Rating,
} from "@/components/studySessions";

const RegularStudySession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const showToast = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);

  const {
    currentCard,
    showAnswer,
    setShowAnswer,
    loading,
    error,
    getNextCard,
    evaluateCard,
    finishSession,
    isSessionComplete,
    setIsSessionComplete,
  } = useStudySession();

  useEffect(() => {
    if (!sessionId || !isInitialLoad) return;
    (async () => {
      try {
        await getNextCard(parseInt(sessionId));
      } catch (err) {
        console.error("Error al cargar la carta:", err);
      } finally {
        setIsInitialLoad(false);
      }
    })();
  }, [sessionId, isInitialLoad, getNextCard]);

  const handleEvaluation = async (rating: Rating) => {
    if (!sessionId || !currentCard?.cardId) return;
    try {
      await evaluateCard(parseInt(sessionId), currentCard.cardId, rating);
      setReviewedCount((c) => c + 1);
    } catch (err) {
      console.error("Error al evaluar carta:", err);
      showToast("No se pudo registrar la evaluación.", { kind: "error" });
    }
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    try {
      await finishSession(parseInt(sessionId));
      setIsSessionComplete(true);
    } catch (err) {
      console.error("Error al finalizar la sesión:", err);
      showToast("No se pudo finalizar la sesión.", { kind: "error" });
    }
  };

  // ── Status states ─────────────────────────────────────
  if (isInitialLoad || (loading && !currentCard)) {
    return <SessionLoading />;
  }

  if (error) {
    return <SessionError message={error} />;
  }

  if (isSessionComplete || !currentCard) {
    const stats =
      reviewedCount > 0
        ? [
            {
              label: "Cartas estudiadas",
              value: reviewedCount,
              accent: "text-v2-primary-deep",
            },
          ]
        : undefined;
    return (
      <SessionComplete
        title="¡Sesión completada!"
        description={
          isSessionComplete
            ? "Has terminado tu sesión de memorización espaciada."
            : "No hay más cartas para repasar por ahora."
        }
        stats={stats}
      />
    );
  }

  // ── Active study UI ───────────────────────────────────
  // Vertical-center the content within the AppShell's main area. The
  // AppShell applies `py-8` (64px total) so the available height is
  // 100vh - 64px. When the card grows past that, the page scrolls
  // naturally because min-height doesn't constrain growth.
  return (
    <div className="animate-v2-fade max-w-[820px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-4">
      {/* Eyebrow (no big page title — the StudyCardDisplay is the focal point) */}
      <div className="flex items-center gap-2 mb-4">
        <Brain size={14} className="text-v2-primary-deep" />
        <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
          Memorización espaciada
        </span>
      </div>

      <StudyCardDisplay card={currentCard} revealed={showAnswer} />

      {/* Controls */}
      <div className="mt-6">
        {!showAnswer ? (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAnswer(true)}
            >
              <Eye size={16} /> Mostrar respuesta
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <RatingMenu onRate={handleEvaluation} disabled={loading} />
            <div className="flex justify-center pt-4 border-t border-v2-line/60">
              <Button variant="ghost" onClick={handleFinish}>
                <LogOut size={16} /> Finalizar sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegularStudySession;
