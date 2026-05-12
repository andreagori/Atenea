import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button, IconButton, useToast } from "@/components/ui";
import { useDecks } from "@/hooks/useDeck";
import { useStudySession } from "@/hooks/useStudySessions";
import { useStudySessionDefaults } from "@/hooks/useStudySessionsDefaults";
import { CreateStudySessionDto } from "@/types/studySessions.types";
import {
  DeckPicker,
  MethodPicker,
  RegularConfigDialog,
  PomodoroConfigDialog,
  SimulatedConfigDialog,
  type StudyMode,
} from "@/components/studySessions";

const StudySession = () => {
  const navigate = useNavigate();
  const showToast = useToast();
  const [searchParams] = useSearchParams();
  const { decks, loading: decksLoading, error: decksError } = useDecks();
  const { createStudySession, loading: creating } = useStudySession();

  const [deckId, setDeckId] = useState<number | null>(null);
  const [mode, setMode] = useState<StudyMode | null>(null);
  const [openDialog, setOpenDialog] = useState<StudyMode | null>(null);
  // Per-method custom configs; only the active mode's entry is used at submit.
  const [customConfigs, setCustomConfigs] = useState<
    Partial<Record<StudyMode, CreateStudySessionDto>>
  >({});

  const defaults = useStudySessionDefaults(mode);

  // Preseleccionar mazo si viene del botón "Estudiar".
  useEffect(() => {
    const fromUrl = searchParams.get("deckId");
    if (fromUrl) {
      const n = parseInt(fromUrl);
      if (!Number.isNaN(n)) setDeckId(n);
    }
  }, [searchParams]);

  const customizedSet = useMemo(
    () => new Set(Object.keys(customConfigs) as StudyMode[]),
    [customConfigs]
  );

  const canStart = deckId !== null && mode !== null && !creating;

  const handleStart = async () => {
    if (!deckId || !mode) return;
    const config = customConfigs[mode] ?? defaults;
    if (!config) {
      showToast("No se pudo armar la configuración.", { kind: "error" });
      return;
    }
    try {
      const res = await createStudySession(deckId, config);
      if (res?.sessionId) {
        navigate(`/sesionesEstudio/${mode}/${res.sessionId}`, {
          replace: true,
        });
      }
    } catch (err) {
      console.error("Error creating study session:", err);
      showToast("No se pudo iniciar la sesión.", { kind: "error" });
    }
  };

  const saveConfig = (m: StudyMode) => (cfg: CreateStudySessionDto) => {
    setCustomConfigs((prev) => ({ ...prev, [m]: cfg }));
    showToast("Configuración guardada", { kind: "success" });
  };

  return (
    <div className="animate-v2-fade max-w-[1100px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-3">
        <Link to="/inicio" aria-label="Volver a inicio">
          <IconButton variant="default" size="sm">
            <ChevronLeft size={16} />
          </IconButton>
        </Link>
        <Link
          to="/inicio"
          className="text-[13px] text-v2-ink-2 hover:text-v2-ink transition-colors"
        >
          Inicio
        </Link>
        <span className="text-[13px] text-v2-ink-3">/</span>
        <span className="text-[13px] text-v2-ink font-medium">
          Nueva sesión
        </span>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px] text-v2-ink">
          Nueva sesión de estudio
        </h1>
        <p className="text-[15px] text-v2-ink-2 m-0 mt-1.5">
          Elige un mazo y la modalidad. Personaliza si quieres ajustar
          duración o tipos de carta.
        </p>
      </div>

      {/* Section: deck */}
      <section className="mb-8">
        <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 mb-3 font-medium">
          1 · Mazo
        </div>
        <DeckPicker
          decks={decks}
          value={deckId}
          onChange={setDeckId}
          loading={decksLoading}
          error={decksError}
        />
      </section>

      {/* Section: method */}
      <section className="mb-8">
        <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 mb-3 font-medium">
          2 · Modalidad
        </div>
        <MethodPicker
          value={mode}
          onChange={setMode}
          onConfigure={setOpenDialog}
          customized={customizedSet}
          disabled={deckId === null}
        />
        {deckId === null && (
          <p className="mt-3 text-xs text-v2-ink-3">
            Selecciona un mazo para habilitar las modalidades.
          </p>
        )}
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t border-v2-line/60 mt-10 pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!canStart}
          onClick={handleStart}
        >
          {creating ? "Iniciando…" : "Comenzar"}
          {!creating && <ArrowRight size={16} />}
        </Button>
      </div>

      {/* Config dialogs */}
      <RegularConfigDialog
        open={openDialog === "regular"}
        onClose={() => setOpenDialog(null)}
        onSave={saveConfig("regular")}
        initial={customConfigs.regular}
      />
      <PomodoroConfigDialog
        open={openDialog === "pomodoro"}
        onClose={() => setOpenDialog(null)}
        onSave={saveConfig("pomodoro")}
        initial={customConfigs.pomodoro}
      />
      <SimulatedConfigDialog
        open={openDialog === "simuladas"}
        onClose={() => setOpenDialog(null)}
        onSave={saveConfig("simuladas")}
        initial={customConfigs.simuladas}
      />
    </div>
  );
};

export default StudySession;
