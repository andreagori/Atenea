/**
 * Glass-morphism dashboard preview rendered inside the auth showcase panel.
 *
 * Each stat label maps to a real field/aggregation in the product:
 *  - TIEMPO    → UserStats.totalStudyMin (Daily Study Time chart)
 *  - PRECISIÓN → SessionsResult.score / cardRetention
 *  - SESIONES  → UserStats.totalSessions
 *
 * Values are mockup data illustrating what the analytics screen looks like;
 * they are not marketing claims. The prototype's "EN VIVO" badge,
 * "X students online now" social proof, and "RACHA" stat (streak feature
 * not shipped — see RESEARCH_IMPLEMENTATION_PLAN.md Track 6) are dropped.
 */
const STATS = [
  { label: "TIEMPO", value: "14h 32m" },
  { label: "PRECISIÓN", value: "84%" },
  { label: "SESIONES", value: "32" },
];

const BAR_HEIGHTS = [30, 50, 35, 70, 60, 85, 75, 90, 65, 95];

export const MiniDashboardCard = () => (
  <div
    className="relative z-[2] rounded-[18px] px-6 py-[22px]"
    style={{
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.22)",
    }}
  >
    <div className="flex justify-between items-baseline mb-[18px]">
      <div>
        <div className="font-v2-mono text-[11px] tracking-[1.5px] text-white/70">
          PANEL · ÚLTIMOS 30 DÍAS
        </div>
        <div className="font-v2-serif italic text-[22px] mt-1">
          Tu progreso real
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2.5 mb-[18px]">
      {STATS.map((s) => (
        <div
          key={s.label}
          className="rounded-[12px] p-3.5"
          style={{ background: "rgba(255,255,255,0.10)" }}
        >
          <div className="font-v2-mono text-[9px] tracking-[1.5px] text-white/65 mb-1.5">
            {s.label}
          </div>
          <div className="font-v2-serif italic text-[24px] leading-none">
            {s.value}
          </div>
        </div>
      ))}
    </div>

    <div className="flex gap-1 items-end h-[60px]">
      {BAR_HEIGHTS.map((h, i) => {
        const isLast = i === BAR_HEIGHTS.length - 1;
        return (
          <div
            key={i}
            className="flex-1 rounded-[3px]"
            style={{
              height: `${h}%`,
              background: isLast ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          />
        );
      })}
    </div>
  </div>
);
