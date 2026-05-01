import { SectionHeader } from "./SectionHeader";
import { HeatmapStrip } from "./HeatmapStrip";

interface MockStat {
  label: string;
  value: string;
  delta: string;
  deltaTone?: "up" | "neutral";
}

const STATS: MockStat[] = [
  { label: "TIEMPO TOTAL", value: "14h 32m", delta: "↑ +18%", deltaTone: "up" },
  { label: "PRECISIÓN", value: "84%", delta: "↑ +6%", deltaTone: "up" },
  { label: "DOMINADAS", value: "312", delta: "de 487", deltaTone: "neutral" },
  { label: "RACHA", value: "12 d", delta: "tu mejor", deltaTone: "neutral" },
];

interface MethodBar {
  label: string;
  pct: number;
  color: string;
}

const METHOD_BARS: MethodBar[] = [
  { label: "Cornell", pct: 91, color: "var(--color-v2-primary)" },
  { label: "Repaso Activo", pct: 82, color: "var(--color-v2-violet)" },
  { label: "Visual", pct: 76, color: "var(--color-v2-magenta)" },
];

interface InsightCard {
  tag: string;
  tone: "green" | "blue" | "orange";
  body: React.ReactNode;
}

const INSIGHTS: InsightCard[] = [
  {
    tag: "QUÉ FUNCIONA",
    tone: "green",
    body: (
      <>
        Cornell te funciona <strong>24% mejor</strong> que Repaso Activo en
        Estructuras de Datos.
      </>
    ),
  },
  {
    tag: "CUÁNDO ESTUDIAR",
    tone: "blue",
    body: (
      <>
        Tus mejores sesiones empiezan a las <strong>10:00</strong>. Tienes 18
        cartas pendientes.
      </>
    ),
  },
  {
    tag: "PUNTO DÉBIL",
    tone: "orange",
    body: (
      <>
        "Métodos de integración" — <strong>52%</strong> de aciertos. Vale la
        pena repasar.
      </>
    ),
  },
];

const TONE_STYLES: Record<InsightCard["tone"], { bg: string; color: string }> = {
  green: {
    bg: "oklch(0.95 0.05 155)",
    color: "oklch(0.45 0.12 155)",
  },
  blue: {
    bg: "var(--color-v2-primary-pale)",
    color: "var(--color-v2-primary-deep)",
  },
  orange: {
    bg: "oklch(0.95 0.06 70)",
    color: "oklch(0.5 0.13 70)",
  },
};

/**
 * Section 04 — Analytics dashboard mock with KPI strip, calendar heatmap,
 * per-method precision bars, and 3 plain-Spanish insight cards.
 */
export const SectionAnalysis = () => (
  <section
    id="analisis"
    className="max-w-[1340px] mx-auto px-10 py-[100px] border-t border-v2-line"
  >
    <SectionHeader
      eyebrow="04 · ANÁLISIS"
      title={
        <>
          El sistema te observa. <em>Tú</em> decides.
        </>
      }
      lede="Atenea analiza tu historial real de sesiones — sin algoritmos opacos — y te dice qué método funciona contigo, en qué horas rindes mejor, y qué temas necesitan repaso."
    />

    <div
      className="bg-v2-surface border border-v2-line rounded-[24px] p-8"
      style={{ boxShadow: "0 32px 80px -36px rgba(27,29,45,0.18)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-baseline mb-7 flex-wrap gap-3">
        <div>
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3 mb-1.5">
            PANEL DE ANÁLISIS
          </div>
          <div className="font-v2-serif italic text-[28px] leading-none">
            Últimos 30 días
          </div>
        </div>
        <div className="flex gap-1 p-1 bg-v2-bg rounded-[10px]">
          <span className="px-3 py-1.5 text-xs font-v2-mono text-v2-ink-3">
            7d
          </span>
          <span
            className="px-3 py-1.5 text-xs font-v2-mono bg-white rounded-[7px] text-v2-ink"
            style={{ boxShadow: "0 1px 3px rgba(27,29,45,0.06)" }}
          >
            30d
          </span>
          <span className="px-3 py-1.5 text-xs font-v2-mono text-v2-ink-3">
            90d
          </span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {STATS.map((s) => (
          <div key={s.label} className="px-5 py-4 bg-v2-bg rounded-[14px]">
            <div className="font-v2-mono text-[10px] tracking-[1.5px] text-v2-ink-3 mb-2">
              {s.label}
            </div>
            <div className="font-v2-serif italic text-[30px] leading-none">
              {s.value}
            </div>
            <div
              className="text-[11px] mt-1.5"
              style={{
                color:
                  s.deltaTone === "up"
                    ? "oklch(0.55 0.15 155)"
                    : "var(--color-v2-ink-3)",
              }}
            >
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap + method bars */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div>
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3 mb-3">
            CALENDARIO DE ACTIVIDAD
          </div>
          <HeatmapStrip />
        </div>
        <div>
          <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3 mb-3">
            PRECISIÓN POR MÉTODO
          </div>
          <div className="flex flex-col gap-3.5">
            {METHOD_BARS.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span>{m.label}</span>
                  <span className="text-v2-primary-deep font-v2-mono">
                    {m.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-v2-bg rounded-[3px] overflow-hidden">
                  <div
                    className="h-full rounded-[3px]"
                    style={{ width: `${m.pct}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {INSIGHTS.map((i) => {
          const styles = TONE_STYLES[i.tone];
          return (
            <div
              key={i.tag}
              className="px-6 py-[22px] bg-v2-bg rounded-[16px] border border-v2-line"
            >
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-v2-mono tracking-[1.2px] mb-3"
                style={{ background: styles.bg, color: styles.color }}
              >
                {i.tag}
              </span>
              <p className="font-v2-serif italic text-[18px] leading-[1.3] text-v2-ink m-0">
                {i.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
