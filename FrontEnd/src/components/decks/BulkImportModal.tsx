import { useRef, useState, type ReactNode } from "react";
import {
  Download,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { useBulkCards, type BulkResult } from "@/hooks/useBulkCards";
import {
  downloadTemplate,
  parseTemplate,
  promptFor,
  validateRow,
  type BulkTemplateKind,
  type ParsedCardRow,
} from "@/utils/bulkCardTemplate";

export interface BulkImportModalProps {
  open: boolean;
  onClose: () => void;
  deckId: number;
  deckTitle: string;
  onImported: () => void;
}

type Step = "pick" | "preview" | "result";

const methodLabel = (m: ParsedCardRow["learningMethod"]) =>
  m === "cornell" ? "Cornell" : "Repaso Activo";

const cardPreview = (r: ParsedCardRow) =>
  r.learningMethod === "cornell"
    ? r.principalNote || r.noteQuestions || r.shortNote
    : r.questionTitle || r.answer;

const StepRow = ({
  n,
  title,
  children,
  last,
}: {
  n: number;
  title: string;
  children: ReactNode;
  last?: boolean;
}) => (
  <div className="flex gap-3.5">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-v2-primary text-white text-[13px] font-medium flex items-center justify-center">
        {n}
      </div>
      {!last && <div className="w-px flex-1 bg-v2-line mt-1" />}
    </div>
    <div className={last ? "pb-0" : "pb-5"}>
      <p className="text-[14px] font-medium text-v2-ink m-0 mb-2">{title}</p>
      {children}
    </div>
  </div>
);

export const BulkImportModal = ({
  open,
  onClose,
  deckId,
  deckTitle,
  onImported,
}: BulkImportModalProps) => {
  const { bulkCreate } = useBulkCards(deckId);
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<BulkTemplateKind>("activeRecall");
  const [step, setStep] = useState<Step>("pick");
  const [copied, setCopied] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [rows, setRows] = useState<ParsedCardRow[]>([]);
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkResult | null>(null);

  const reset = () => {
    setKind("activeRecall");
    setStep("pick");
    setCopied(false);
    setShowFullPrompt(false);
    setRows([]);
    setParsing(false);
    setSubmitting(false);
    setError(null);
    setResult(null);
  };

  const handleClose = () => {
    if (parsing || submitting) return;
    reset();
    onClose();
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptFor(kind));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar. Copia el prompt desde la hoja Instrucciones.");
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setParsing(true);
    try {
      const parsed = await parseTemplate(file);
      if (parsed.length === 0) {
        setError("No se encontraron filas en la hoja \"Cartas\".");
        return;
      }
      setRows(parsed);
      setStep("preview");
    } catch {
      setError("No se pudo leer el archivo. ¿Es la plantilla .xlsx?");
    } finally {
      setParsing(false);
    }
  };

  const validCount = rows.filter((r) => validateRow(r) === null).length;
  const invalidCount = rows.length - validCount;

  const handleImport = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await bulkCreate(rows);
      setResult(res);
      setStep("result");
      if (res.created > 0) onImported();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "No se pudo completar la carga."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateTitle = (sourceRow: number, title: string) =>
    setRows((prev) =>
      prev.map((r) => (r.sourceRow === sourceRow ? { ...r, title } : r))
    );

  const ErrorBanner = () =>
    error ? (
      <div
        role="alert"
        className="mb-4 text-[13px] px-4 py-2.5 rounded-v2-sm border text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
      >
        {error}
      </div>
    ) : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Carga masiva de cartas"
      maxWidth={720}
      staticBackdrop
    >
      <div className="max-h-[68vh] overflow-y-auto -mr-3 pr-3">
      {step === "pick" && (
        <div>
          <p className="text-[13px] text-v2-ink-2 m-0 mb-6 leading-[1.6]">
            Convierte tu PDF o apuntes en cartas usando cualquier IA. Sigue
            estos pasos. Las cartas visuales (imágenes) no se incluyen.
          </p>

          <StepRow n={1} title="Elige el tipo de carta y descarga la plantilla">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {(
                [
                  ["activeRecall", "Repaso Activo", "Pregunta y respuesta"],
                  ["both", "Repaso Activo + Cornell", "Ambos métodos"],
                ] as const
              ).map(([value, label, hint]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKind(value)}
                  className={`text-left p-3 rounded-v2-md border transition-colors ${
                    kind === value
                      ? "border-v2-primary bg-v2-primary-pale"
                      : "border-v2-line bg-v2-surface hover:border-v2-primary-soft"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-v2-ink">
                      {label}
                    </span>
                    {kind === value && (
                      <Check size={15} className="text-v2-primary" />
                    )}
                  </div>
                  <span className="text-[12px] text-v2-ink-2">{hint}</span>
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadTemplate(kind)}
            >
              <Download size={16} /> Descargar plantilla
            </Button>
          </StepRow>

          <StepRow
            n={2}
            title="Copia el prompt y pégalo en tu IA junto con tu PDF"
          >
            <p className="text-[13px] text-v2-ink-2 m-0 mb-3 leading-[1.55]">
              Abre ChatGPT, Claude o Gemini, adjunta tu material y pega el
              prompt. Te devolverá las tarjetas listas.
            </p>

            <div className="relative rounded-v2-sm border border-v2-line bg-v2-bg">
              <pre
                className={`m-0 p-3 text-[11.5px] leading-[1.5] text-v2-ink-2 font-v2-mono whitespace-pre-wrap break-words ${
                  showFullPrompt
                    ? "h-56 overflow-y-auto"
                    : "max-h-24 overflow-hidden"
                }`}
              >
                {promptFor(kind)}
              </pre>
              {!showFullPrompt && (
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-v2-bg to-transparent rounded-b-v2-sm pointer-events-none" />
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Button type="button" variant="secondary" onClick={copyPrompt}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Prompt copiado" : "Copiar prompt"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowFullPrompt((v) => !v)}
              >
                {showFullPrompt ? (
                  <>
                    <ChevronUp size={16} /> Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> Ver todo
                  </>
                )}
              </Button>
            </div>
          </StepRow>

          <StepRow
            n={3}
            title='Pega el resultado en la hoja "Cartas" y guarda'
          >
            <p className="text-[13px] text-v2-ink-2 m-0 leading-[1.55]">
              Copia el bloque que te dio la IA y pégalo en la celda{" "}
              <span className="font-medium text-v2-ink">A2</span> de la hoja{" "}
              <span className="font-medium text-v2-ink">"Cartas"</span> (no
              toques la fila de encabezados). Guarda el archivo.
            </p>
          </StepRow>

          <StepRow n={4} title="Sube la plantilla rellenada" last>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="primary"
              disabled={parsing}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={16} />
              {parsing ? "Leyendo…" : "Elegir archivo .xlsx"}
            </Button>
          </StepRow>

          <div className="mt-5">
            <ErrorBanner />
          </div>

          <div className="flex justify-end mt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div>
          <p className="text-[13px] text-v2-ink-2 m-0 mb-4">
            <span className="font-medium text-v2-ink">{rows.length}</span> fila(s)
            en <span className="font-medium text-v2-ink">{deckTitle}</span> ·{" "}
            <span className="text-v2-primary-deep">{validCount} válida(s)</span>
            {invalidCount > 0 && (
              <span className="text-v2-coral"> · {invalidCount} con errores</span>
            )}
          </p>

          <ErrorBanner />

          <div className="max-h-[44vh] overflow-auto border border-v2-line rounded-v2-md">
            <table className="w-full text-[13px] border-collapse">
              <thead className="sticky top-0 bg-v2-bg">
                <tr className="text-left text-v2-ink-3">
                  <th className="font-medium px-3 py-2 w-10">#</th>
                  <th className="font-medium px-3 py-2 w-[34%]">Título</th>
                  <th className="font-medium px-3 py-2">Vista previa</th>
                  <th className="font-medium px-3 py-2 w-44">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const err = validateRow(r);
                  const titleErr = err
                    ?.toLowerCase()
                    .includes("título");
                  return (
                    <tr
                      key={r.sourceRow}
                      className="border-t border-v2-line align-top"
                    >
                      <td className="px-3 py-2 text-v2-ink-3">{r.sourceRow}</td>
                      <td className="px-2 py-1.5">
                        <input
                          value={r.title}
                          onChange={(e) =>
                            updateTitle(r.sourceRow, e.target.value)
                          }
                          placeholder="Escribe un título…"
                          className={`w-full bg-transparent rounded-v2-sm px-2 py-1 text-[13px] text-v2-ink outline-none border transition-colors focus:border-v2-primary ${
                            titleErr
                              ? "border-v2-coral"
                              : "border-transparent hover:border-v2-line"
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 text-v2-ink-2">
                        <div className="flex items-center gap-2 max-w-[280px]">
                          {kind === "both" && (
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-v2-primary-pale text-v2-primary-deep flex-shrink-0">
                              {methodLabel(r.learningMethod)}
                            </span>
                          )}
                          <span className="truncate">
                            {cardPreview(r) || (
                              <span className="text-v2-ink-3 italic">
                                vacío
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {err ? (
                          <span className="text-v2-coral">{err}</span>
                        ) : (
                          <span className="text-v2-primary-deep">Lista</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[12px] text-v2-ink-3 m-0 mt-3">
            Puedes editar el título de cualquier fila aquí. Las filas con
            errores se omiten; el resto se crea.
          </p>

          <div className="flex justify-between gap-2 mt-6">
            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              onClick={() => {
                setRows([]);
                setStep("pick");
              }}
            >
              Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={submitting || validCount === 0}
              onClick={handleImport}
            >
              {submitting
                ? "Creando…"
                : `Crear ${validCount} carta(s)`}
            </Button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                result.created > 0
                  ? "bg-v2-primary-pale text-v2-primary-deep"
                  : "bg-v2-coral/[0.1] text-v2-coral"
              }`}
            >
              {result.created > 0 ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}
            </div>
            <div>
              <p className="text-[15px] font-medium text-v2-ink m-0">
                {result.created} carta(s) creada(s)
              </p>
              {result.skipped > 0 && (
                <p className="text-[13px] text-v2-ink-2 m-0">
                  {result.skipped} omitida(s) por errores
                </p>
              )}
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="max-h-[36vh] overflow-auto border border-v2-line rounded-v2-md mb-4">
              <table className="w-full text-[13px] border-collapse">
                <thead className="sticky top-0 bg-v2-bg">
                  <tr className="text-left text-v2-ink-3">
                    <th className="font-medium px-3 py-2 w-10">#</th>
                    <th className="font-medium px-3 py-2">Título</th>
                    <th className="font-medium px-3 py-2">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((e) => (
                    <tr
                      key={e.row}
                      className="border-t border-v2-line align-top"
                    >
                      <td className="px-3 py-2 text-v2-ink-3">{e.row}</td>
                      <td className="px-3 py-2 text-v2-ink">{e.title || "—"}</td>
                      <td className="px-3 py-2 text-v2-coral">{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <Button type="button" variant="primary" onClick={handleClose}>
              Listo
            </Button>
          </div>
        </div>
      )}
      </div>
    </Modal>
  );
};
