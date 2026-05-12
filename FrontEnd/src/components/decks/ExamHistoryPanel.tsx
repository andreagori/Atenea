import { useMemo } from "react";
import { Trash2, Plus, GraduationCap } from "lucide-react";
import { Button, IconButton } from "@/components/ui";
import { type Exam } from "@/hooks/useExams";

export interface ExamHistoryPanelProps {
  exams: Exam[];
  loading?: boolean;
  error?: string | null;
  onAdd: () => void;
  onDelete: (exam: Exam) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const scoreColor = (pct: number) => {
  if (pct >= 80) return "text-[color:var(--color-v2-green)]";
  if (pct >= 60) return "text-v2-primary-deep";
  if (pct >= 40) return "text-[color:var(--color-v2-amber)]";
  return "text-v2-coral";
};

const Loading = () => (
  <div className="space-y-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <div
        key={i}
        className="h-14 bg-v2-line/40 rounded-v2-sm animate-pulse"
      />
    ))}
  </div>
);

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="bg-v2-bg border border-dashed border-v2-line rounded-v2-sm px-5 py-6 text-center">
    <div className="inline-flex w-10 h-10 rounded-full bg-v2-primary-pale text-v2-primary-deep items-center justify-center mb-2">
      <GraduationCap size={18} />
    </div>
    <p className="text-[14px] text-v2-ink m-0 mb-1 font-medium">
      Aún no hay exámenes registrados
    </p>
    <p className="text-[12px] text-v2-ink-2 m-0 mb-4 max-w-sm mx-auto leading-[1.5]">
      Registra tus notas reales para descubrir qué método te funciona mejor.
    </p>
    <Button variant="secondary" size="sm" onClick={onAdd}>
      <Plus size={14} /> Registrar examen
    </Button>
  </div>
);

/**
 * History of exams logged for a given deck. Shows the score as a percentage
 * of the max so different grading scales (e.g. 10/20, 0/100) read at a
 * glance, while keeping the raw values visible in a smaller label.
 */
export const ExamHistoryPanel = ({
  exams,
  loading,
  error,
  onAdd,
  onDelete,
}: ExamHistoryPanelProps) => {
  const sorted = useMemo(
    () =>
      [...exams].sort(
        (a, b) =>
          new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
      ),
    [exams]
  );

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[18px] font-medium m-0 text-v2-ink">Exámenes</h2>
        {exams.length > 0 && (
          <Button variant="secondary" size="sm" onClick={onAdd}>
            <Plus size={14} /> Registrar examen
          </Button>
        )}
      </div>

      {error ? (
        <div
          role="alert"
          className="text-[13px] px-4 py-3 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
        >
          No se pudieron cargar los exámenes. {error}
        </div>
      ) : loading ? (
        <Loading />
      ) : sorted.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <ul className="space-y-2 list-none m-0 p-0">
          {sorted.map((exam) => {
            const pct = exam.maxScore > 0
              ? Math.round((exam.examScore / exam.maxScore) * 100)
              : exam.examScore;
            return (
              <li
                key={exam.examId}
                className="bg-v2-surface border border-v2-line rounded-v2-sm px-4 py-3 flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 text-right">
                  <span
                    className={`text-[20px] font-medium tabular-nums ${scoreColor(pct)}`}
                  >
                    {pct}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-v2-ink m-0 font-medium">
                    {formatDate(exam.examDate)}
                  </div>
                  <div className="text-[12px] text-v2-ink-3 m-0 tabular-nums">
                    {exam.examScore} / {exam.maxScore}
                    {exam.note ? (
                      <span className="text-v2-ink-2"> · {exam.note}</span>
                    ) : null}
                  </div>
                </div>
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(exam)}
                  aria-label="Eliminar examen"
                >
                  <Trash2 size={15} />
                </IconButton>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
