/**
 * Static "in-app screenshot" mockup shown inside the hero.
 * Recreates the chrome window + sidebar + Mis Mazos panel from
 * .design_review/project/welcome.html (Direction B).
 *
 * Pure presentational — no real data is fetched.
 */
const SIDE_ITEMS: { label: string; active?: boolean }[] = [
  { label: "Mis Mazos", active: true },
  { label: "Sesión" },
  { label: "Análisis" },
  { label: "Configuración" },
];

const DECK_PREVIEWS = [
  { tag: "CALCULO", title: "Cálculo Integral", count: 32, mastery: 84, dot: "var(--color-v2-primary)" },
  { tag: "PROG", title: "Programación OO", count: 24, mastery: 76, dot: "var(--color-v2-violet)" },
  { tag: "ED", title: "Estructuras de Datos", count: 41, mastery: 68, dot: "var(--color-v2-magenta)" },
];

export const WelcomeAppPreview = () => (
  <div
    className="mt-20 mx-auto max-w-[1240px] bg-v2-surface border border-v2-line rounded-[24px] p-2 relative"
    style={{
      boxShadow:
        "0 60px 120px -40px rgba(86,125,241,0.25), 0 24px 48px -20px rgba(27,29,45,0.12)",
    }}
  >
    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-3 bg-v2-surface border-b border-v2-line rounded-t-[18px]">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      </div>
      <div className="flex-1 text-center text-xs text-v2-ink-3 font-v2-mono">
        atenea.app / mis-mazos
      </div>
      <div className="w-10" />
    </div>

    {/* Inner: sidebar + content */}
    <div
      className="rounded-b-[18px] overflow-hidden grid min-h-[540px] grid-cols-1 sm:grid-cols-[220px_1fr]"
      style={{ background: "linear-gradient(180deg, var(--color-v2-bg), #fff)" }}
    >
      <aside className="hidden sm:flex flex-col gap-1 px-3.5 py-4 border-r border-v2-line bg-v2-bg">
        {SIDE_ITEMS.map((s) => (
          <div
            key={s.label}
            className={
              "flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] " +
              (s.active
                ? "bg-v2-primary-pale text-v2-primary-deep font-medium"
                : "text-v2-ink-2")
            }
          >
            <span
              className={
                "inline-block w-[18px] h-[18px] rounded-[5px] " +
                (s.active ? "bg-v2-primary" : "bg-v2-line")
              }
            />
            {s.label}
          </div>
        ))}
        <div className="mt-auto px-3 py-2.5 text-[11px] text-v2-ink-3 font-v2-mono tracking-[1px]">
          RACHA · 12 DÍAS
        </div>
      </aside>

      <div className="px-6 sm:px-8 py-7 text-left overflow-hidden">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <div className="font-v2-mono text-[11px] tracking-[2px] uppercase text-v2-ink-3 mb-1.5">
              PANEL
            </div>
            <div className="font-v2-serif italic text-[26px] leading-none">
              Mis Mazos
            </div>
          </div>
          <div className="bg-v2-primary text-white px-3.5 py-2 rounded-v2-sm text-xs font-medium">
            + Nuevo mazo
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {DECK_PREVIEWS.map((d) => (
            <div
              key={d.tag}
              className="p-[18px] bg-v2-bg rounded-[14px] border border-v2-line"
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ background: d.dot }}
                />
                <span className="font-v2-mono text-[10px] tracking-[1px] text-v2-ink-3">
                  {d.tag}
                </span>
              </div>
              <div className="font-medium text-[15px] mb-4">{d.title}</div>
              <div className="flex justify-between text-[11px] text-v2-ink-2">
                <span>{d.count} cartas</span>
                <span className="text-v2-primary-deep font-v2-mono">
                  {d.mastery}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 px-[22px] py-[18px] bg-v2-primary-pale rounded-[14px] flex items-center justify-between gap-4">
          <div>
            <div className="font-v2-mono text-[11px] text-v2-primary-deep tracking-[1px] mb-1">
              RECOMENDADO
            </div>
            <div className="text-v2-ink text-[14px]">
              Tienes 18 cartas pendientes de repaso en{" "}
              <strong>Cálculo Integral</strong>.
            </div>
          </div>
          <div className="bg-v2-primary text-white px-3.5 py-2 rounded-v2-sm text-xs font-medium whitespace-nowrap">
            Estudiar →
          </div>
        </div>
      </div>
    </div>
  </div>
);
