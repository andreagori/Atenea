import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipboardList, Clock, ArrowLeft } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { useStudySession } from "@/hooks/useStudySessions";
import {
  TestQuestion,
  TestProgress,
  TestResultDto,
} from "@/types/simulatedStudySessions.types";
import {
  SessionLoading,
  TestOptionCard,
} from "@/components/studySessions";

interface ExtendedTestProgress extends TestProgress {
  isComplete: boolean;
  sessionMethod?: string;
}

const formatRemaining = (s: number) => {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
};

const SimulatedTestStudySession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const showToast = useToast();
  const {
    getTestQuestion,
    submitTestAnswer,
    getTestProgress,
    finishSession,
    getTestResult,
  } = useStudySession();

  const [question, setQuestion] = useState<TestQuestion | null>(null);
  const [progress, setProgress] = useState<ExtendedTestProgress | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<TestResultDto | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<number>>(new Set());
  const [initialized, setInitialized] = useState(false);

  const sessionIdNum = sessionId ? parseInt(sessionId) : null;

  // ── init ────────────────────────────────────────────
  useEffect(() => {
    if (!sessionIdNum || initialized || finished) return;
    setInitialized(true);
    (async () => {
      try {
        const pr = (await getTestProgress(sessionIdNum)) as ExtendedTestProgress;
        setProgress(pr);
        if (pr?.isComplete) {
          await endSession("backend_complete");
          return;
        }
        await loadQuestion();
      } catch (err) {
        console.error("Error inicializando sesión:", err);
        await endSession("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdNum]);

  // ── countdown ───────────────────────────────────────
  useEffect(() => {
    if (!progress?.remainingTime || finished) return;
    const t = setInterval(() => {
      setProgress((prev) => {
        if (!prev || finished) return prev;
        const next = prev.remainingTime - 1;
        if (next <= 0) {
          clearInterval(t);
          endSession("timeout");
          return { ...prev, remainingTime: 0 };
        }
        return { ...prev, remainingTime: next };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [progress?.remainingTime, finished]);

  // ── helpers ─────────────────────────────────────────
  const loadQuestion = async () => {
    if (!sessionIdNum || finished) return;
    try {
      const q = (await getTestQuestion(sessionIdNum)) as TestQuestion | null;
      if (!q) {
        await endSession("no_more_questions");
        return;
      }
      // If backend re-serves a question we've already answered, reset the set
      // to avoid getting stuck.
      if (answeredIds.has(q.questionId)) setAnsweredIds(new Set());
      setQuestion(q);
      setStartTime(Date.now());
    } catch (err) {
      console.error("Error cargando pregunta:", err);
      await endSession("question_load_error");
    }
  };

  const handleSelect = async (index: number) => {
    if (
      !question ||
      !sessionIdNum ||
      selectedIndex !== null ||
      processing ||
      finished
    )
      return;
    if (answeredIds.has(question.questionId)) return;

    setSelectedIndex(index);
    setProcessing(true);

    try {
      const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      const res = (await submitTestAnswer(
        sessionIdNum,
        question.questionId,
        index,
        timeSpent
      )) as { isCorrect: boolean };

      if (typeof res.isCorrect !== "boolean") {
        throw new Error("Respuesta del servidor inválida");
      }
      setAnsweredIds((prev) => new Set([...prev, question.questionId]));
      setIsCorrect(res.isCorrect);

      // Hold the visual feedback briefly so the user sees correctness.
      setTimeout(async () => {
        try {
          const pr = (await getTestProgress(
            sessionIdNum
          )) as ExtendedTestProgress;
          setProgress(pr);
          if (pr.isComplete || pr.answeredQuestions >= pr.totalQuestions) {
            await endSession("completed");
            return;
          }
          resetQuestion();
          await loadQuestion();
        } catch (err) {
          console.error("Error procesando respuesta:", err);
          resetQuestion();
          await loadQuestion();
        }
      }, 1500);
    } catch (err) {
      console.error("Error enviando respuesta:", err);
      showToast("No se pudo registrar tu respuesta.", { kind: "error" });
      setTimeout(() => resetQuestion(), 1200);
    }
  };

  const resetQuestion = () => {
    setSelectedIndex(null);
    setIsCorrect(null);
    setProcessing(false);
    setStartTime(Date.now());
  };

  const endSession = async (reason: string) => {
    if (finished) return;
    setFinished(true);
    try {
      if (reason !== "backend_complete") {
        await finishSession(sessionIdNum!);
      }
      const r = await getTestResult(sessionIdNum!);
      setResults(r);
    } catch (err) {
      console.error("Error finalizando sesión:", err);
      // Best-effort fallback from progress.
      setResults({
        sessionId: sessionIdNum!,
        correctAnswers: progress?.correctAnswers ?? 0,
        incorrectAnswers: progress?.incorrectAnswers ?? 0,
        score: progress
          ? Math.round(
              (progress.correctAnswers /
                Math.max(
                  1,
                  progress.correctAnswers + progress.incorrectAnswers
                )) *
                100
            )
          : 0,
        timeSpent: 0,
      });
    }
  };

  // ── results screen ──────────────────────────────────
  if (results) {
    const correct = results.correctAnswers;
    const incorrect = results.incorrectAnswers;
    const total = correct + incorrect;
    return (
      <div className="animate-v2-fade max-w-[640px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-4">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={14} className="text-v2-primary-deep" />
          <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
            Resultado
          </span>
        </div>
        <h1 className="text-[32px] font-medium m-0 mb-2 leading-[1.1] tracking-[-0.3px] text-v2-ink">
          ¡Test completado!
        </h1>
        <p className="text-[15px] text-v2-ink-2 m-0 mb-6">
          Aquí está tu desempeño en esta prueba.
        </p>

        <div className="bg-v2-surface border border-v2-line rounded-v2-lg p-7 shadow-v2-sm">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[56px] font-medium text-v2-primary-deep leading-none tabular-nums">
              {results.score}
            </span>
            <span className="text-[24px] text-v2-ink-2">%</span>
            <span className="ml-auto font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3">
              Puntuación
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <ResultStat
              label="Correctas"
              value={correct}
              accent="text-[color:var(--color-v2-green)]"
            />
            <ResultStat
              label="Incorrectas"
              value={incorrect}
              accent="text-v2-coral"
            />
            <ResultStat label="Total" value={total} accent="text-v2-ink" />
          </div>

          {results.timeSpent > 0 && (
            <p className="text-[12px] text-v2-ink-3 m-0">
              Tiempo: {results.timeSpent} minutos
            </p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/sesionesEstudio")}
          >
            <ArrowLeft size={16} /> Volver a sesiones
          </Button>
        </div>
      </div>
    );
  }

  if (!question && !finished) {
    return <SessionLoading message="Cargando pregunta…" />;
  }

  // ── question screen ─────────────────────────────────
  const visualCurrent = answeredIds.size + 1;
  const total = progress?.totalQuestions ?? question?.progress.total ?? 1;
  const pct = Math.min(100, (answeredIds.size / total) * 100);

  return (
    <div className="animate-v2-fade max-w-[820px] mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center py-4">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList size={14} className="text-v2-primary-deep" />
        <span className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-primary-deep font-medium">
          Prueba simulada
        </span>
      </div>

      {/* Progress + timer */}
      <div className="bg-v2-surface border border-v2-line rounded-v2-md p-4 mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-[14px] text-v2-ink-2">
            Pregunta{" "}
            <span className="font-medium text-v2-ink">{visualCurrent}</span> de{" "}
            <span className="font-medium text-v2-ink">{total}</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-v2-ink-3 tabular-nums">
              ✓ {progress?.correctAnswers ?? 0} · ✕{" "}
              {progress?.incorrectAnswers ?? 0}
            </span>
            {progress && progress.remainingTime > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-v2-primary-deep tabular-nums">
                <Clock size={14} />
                {formatRemaining(progress.remainingTime)}
              </span>
            )}
          </div>
        </div>
        <div className="h-1.5 bg-v2-line rounded-full overflow-hidden">
          <div
            className="h-full bg-v2-primary transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {question && (
        <>
          <h1 className="text-[24px] sm:text-[28px] font-medium m-0 mb-6 leading-[1.25] text-v2-ink">
            {question.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, i) => {
              let s:
                | "idle"
                | "selected-pending"
                | "correct"
                | "incorrect"
                | "muted" = "idle";
              if (selectedIndex === i) {
                s =
                  isCorrect === true
                    ? "correct"
                    : isCorrect === false
                      ? "incorrect"
                      : "selected-pending";
              } else if (selectedIndex !== null) {
                s = "muted";
              }
              return (
                <TestOptionCard
                  key={i}
                  index={i}
                  content={opt.content}
                  type={opt.type}
                  status={s}
                  onClick={() => handleSelect(i)}
                  disabled={selectedIndex !== null || processing}
                />
              );
            })}
          </div>

          {selectedIndex !== null && isCorrect !== null && (
            <div
              role="status"
              className={`mt-5 px-4 py-3 rounded-v2-sm text-center text-[14px] font-medium ${
                isCorrect
                  ? "bg-v2-green/[0.10] text-[color:var(--color-v2-green)] border border-v2-green/30"
                  : "bg-v2-coral/[0.08] text-v2-coral border border-v2-coral/30"
              }`}
            >
              {isCorrect ? "¡Correcto!" : "Incorrecto"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ResultStat = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) => (
  <div>
    <div className={`text-[28px] font-medium ${accent} tabular-nums leading-none`}>
      {value}
    </div>
    <div className="font-v2-mono text-[10px] tracking-[1.2px] uppercase text-v2-ink-3 mt-1.5">
      {label}
    </div>
  </div>
);

export default SimulatedTestStudySession;
