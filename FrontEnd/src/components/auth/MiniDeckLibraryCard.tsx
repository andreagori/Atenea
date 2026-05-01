/**
 * Glass-morphism deck-library preview rendered inside the *signup* showcase.
 *
 * Shows three mock deck rows in the same compact format used by the
 * authenticated app's Mis Mazos panel — name + card count + accent dot —
 * to give a new user a concrete preview of what their library will look
 * like. Mastery percentages are intentionally omitted because a brand-new
 * account has no progress data yet; only fields that exist on `Deck` and
 * are visible from day one (title, card count) appear here.
 */
const DECKS = [
  {
    name: "Cálculo Integral",
    cards: 32,
    color: "var(--color-v2-primary-tint)",
  },
  {
    name: "Programación OO",
    cards: 24,
    color: "var(--color-v2-violet)",
  },
  {
    name: "Estructuras de Datos",
    cards: 41,
    color: "var(--color-v2-magenta)",
  },
];

export const MiniDeckLibraryCard = () => (
  <div
    className="relative z-[2] rounded-[18px] px-6 py-[22px]"
    style={{
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.22)",
    }}
  >
    <div className="mb-[18px]">
      <div className="font-v2-mono text-[11px] tracking-[1.5px] text-white/70">
        PANEL · MIS MAZOS
      </div>
      <div className="font-v2-serif italic text-[22px] mt-1">
        Tu primera biblioteca
      </div>
    </div>

    <div className="flex flex-col gap-2.5">
      {DECKS.map((d) => (
        <div
          key={d.name}
          className="flex items-center gap-3.5 rounded-[12px] px-4 py-3.5"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: d.color }}
          />
          <div className="flex-1 text-[14px] font-medium leading-tight">
            {d.name}
          </div>
          <div className="font-v2-mono text-[10px] tracking-[1.5px] text-white/65 whitespace-nowrap">
            {d.cards} CARTAS
          </div>
        </div>
      ))}
    </div>
  </div>
);
