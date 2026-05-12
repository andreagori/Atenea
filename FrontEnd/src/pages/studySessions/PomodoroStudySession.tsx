import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Eye, LogOut, Coffee, Clock } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { useStudySession } from "@/hooks/useStudySessions";
import {
  StudyCardDisplay,
  RatingMenu,
  SessionLoading,
  SessionComplete,
  PomodoroTimer,
  PomodoroProgress,
  type RuntimeCard,
  type Rating,
} from "@/components/studySessions";

const PomodoroStudySession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const showToast = useToast();

  const {
    getPomodoroNextCard,
    evaluatePomodoroCard,
    finishSession,
    getPomodoroStatus,
    getPomodoroProgress,
    endPomodoroBreak,
  } = useStudySession();

  const [card, setCard] = useState<RuntimeCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [complete, setComplete] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ── data flow ────────────────────────────────────────
  const sessionIdNum = sessionId ? parseInt(sessionId) : null;

  useEffect(() => {
    if (!sessionIdNum) return;
    (async () => {
      try {
        const [st, pr] = await Promise.all([
          getPomodoroStatus(sessionIdNum),
          getPomodoroProgress(sessionIdNum),
        ]);
        setStatus(st);
        setProgress(pr);
        setIsOnBreak(st.isOnBreak);
        if (!st.isOnBreak) await loadNextCard();
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setInitialLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdNum]);

  const loadNextCard = async () => {
    if (!sessionIdNum) return;
    try {
      const next = await getPomodoroNextCard(sessionIdNum);
      if (!next) {
        const st = await getPomodoroStatus(sessionIdNum);
        setStatus(st);
        if (st.isOnBreak) {
          setIsOnBreak(true);
          setCard(null);
        } else {
          setComplete(true);
        }
        return;
      }
      setCard(next as RuntimeCard);
      setShowAnswer(false);
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("descanso") || msg.includes("Tiempo de estudio")) {
        setIsOnBreak(true);
        setCard(null);
        setShowAnswer(false);
        try {
          const st = await getPomodoroStatus(sessionIdNum);
          setStatus(st);
        } catch {
          /* ignore secondary status fetch failure */
        }
      } else {
        console.error("Error loading next card:", err);
      }
    }
  };

  const refreshStatus = async () => {
    if (!sessionIdNum) return;
    try {
      const [st, pr] = await Promise.all([
        getPomodoroStatus(sessionIdNum),
        getPomodoroProgress(sessionIdNum),
      ]);
      setStatus(st);
      setProgress(pr);
      if (st.isOnBreak !== isOnBreak) {
        setIsOnBreak(st.isOnBreak);
        if (st.isOnBreak) {
          setCard(null);
          setShowAnswer(false);
        } else {
          await loadNextCard();
        }
      }
    } catch (err) {
      console.error("Error refreshing status:", err);
    }
  };

  const handleEvaluation = async (rating: Rating) => {
    if (!card || !sessionIdNum) return;
    try {
      await evaluatePomodoroCard(sessionIdNum, card.cardId, rating);
      const [pr, st] = await Promise.all([
        getPomodoroProgress(sessionIdNum),
        getPomodoroStatus(sessionIdNum),
      ]);
      setProgress(pr);
      setStatus(st);
      if (st.isOnBreak) {
        setIsOnBreak(true);
        setCard(null);
        setShowAnswer(false);
      } else {
        await loadNextCard();
      }
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("descanso") || msg.includes("Tiempo de estudio")) {
        setIsOnBreak(true);
        setCard(null);
        setShowAnswer(false);
      } else {
        showToast("No se pudo registrar la evaluación.", { kind: "error" });
      }
    }
  };

  const handleEndBreak = async () => {
    if (!sessionIdNum) return;
    try {
      await endPomodoroBreak(sessionIdNum);
      setIsOnBreak(false);
      const st = await getPomodoroStatus(sessionIdNum);
      setStatus(st);
      await loadNextCard();
    } catch (err) {
      console.error("Error ending break:", err);
      showToast("No se pudo terminar el descanso.", { kind: "error" });
    }
  };

  const handleFinish = async () => {
    if (!sessionIdNum) return;
    try {
      // Refresh progress one last time so the completion screen shows the
      // most up-to-date stats.
      try {
        const pr = await getPomodoroProgress(sessionIdNum);
        setProgress(pr);
      } catch {
        /* non-fatal; fall through with whatever we have */
      }
      await finishSession(sessionIdNum);
      setComplete(true);
    } catch (err) {
      console.error("Error finishing session:", err);
      showToast("No se pudo finalizar la sesión.", { kind: "error" });
    }
  };

  // ── render states ────────────────────────────────────
  if (initialLoading) return <SessionLoading message="Cargando Pomodoro…" />;

  if (complete) {
    const stats = progress
      ? [
          {
            label: "Únicas",
            value: progress.uniqueCardsReviewed,
            accent: "text-v2-primary-deep",
          },
          {
            label: "Total",
            value: progress.reviewedCards,
            accent: "text-v2-ink",
          },
          {
            label: "Estudio",
            value: `${progress.studyTimeElapsed}m`,
            accent: "text-[color:var(--color-v2-green)]",
          },
          {
            label: "Descanso",
            value: `${progress.breakTimeElapsed}m`,
            accent: "text-[color:var(--color-v2-amber)]",
          },
        ]
      : undefined;
    return (
      <SessionComplete
        title="¡Pomodoro completado!"
        description="Terminaste tu sesión Pomodoro. Buen trabajo."
        stats={stats}
      />
    );
  }

  return (
    // Vertically center the runtime content within the AppShell content area.
    // AppShell applies py-8 (64px) so 100vh - 64px is the available height.
    <div className="animate-v2-fade max-w-[820px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-4">
      {/* Eyebrow — no big page title; the timer pill + break panel carry context */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-v2-primary-deep" />
        <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
          Pomodoro
        </span>
      </div>

      {/* Timer pill */}
      <div className="flex justify-center mb-6">
        <PomodoroTimer status={status} onTimerComplete={refreshStatus} />
      </div>

      {/* Main */}
      {isOnBreak ? (
        <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-10 shadow-v2-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-v2-green/10 text-[color:var(--color-v2-green)] mb-4">
            <Coffee size={32} />
          </div>
          <h2 className="text-[22px] font-medium m-0 mb-2 text-v2-ink">
            Pausa breve
          </h2>
          <p className="text-[14px] text-v2-ink-2 m-0 mb-6 max-w-md mx-auto leading-[1.55]">
            Relájate unos minutos. Cuando quieras retomar, presiona el botón.
          </p>
          <Button variant="primary" size="lg" onClick={handleEndBreak}>
            Terminar descanso
          </Button>
        </div>
      ) : card ? (
        <>
          <StudyCardDisplay card={card} revealed={showAnswer} />
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
              <RatingMenu onRate={handleEvaluation} />
            )}
          </div>
        </>
      ) : (
        <SessionLoading message="Cargando carta…" />
      )}

      {/* Progress strip + finish */}
      <div className="mt-8">
        <PomodoroProgress progress={progress} />
      </div>
      <div className="flex justify-center mt-4">
        <Button variant="ghost" onClick={handleFinish}>
          <LogOut size={16} /> Finalizar sesión
        </Button>
      </div>
    </div>
  );
};

export default PomodoroStudySession;
