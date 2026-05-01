import { useMemo } from "react";

const COLORS = [
  "var(--color-v2-bg)",
  "rgba(86,125,241,0.25)",
  "rgba(86,125,241,0.5)",
  "rgba(86,125,241,0.75)",
  "var(--color-v2-primary)",
];

/**
 * Tiny deterministic LCG so the heatmap pattern is stable across re-renders
 * and SSR-safe. Ports the random distribution from welcome.html's inline
 * script (Math.floor(Math.random() * 5 - 0.5), clamped at 0).
 */
function pseudoRandomIntensities(seed: number, count: number): number[] {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const r = (s & 0xffffffff) / 0xffffffff;
    out.push(Math.max(0, Math.floor(r * 5 - 0.5)));
  }
  return out;
}

export interface HeatmapStripProps {
  /** Number of cells (default 91 = ~13 weeks). */
  cells?: number;
  /** Number of columns in the grid (default 13). */
  columns?: number;
  /** Stable seed for the deterministic intensity pattern. */
  seed?: number;
}

export const HeatmapStrip = ({
  cells = 91,
  columns = 13,
  seed = 42,
}: HeatmapStripProps) => {
  const intensities = useMemo(
    () => pseudoRandomIntensities(seed, cells),
    [seed, cells]
  );

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {intensities.map((v, i) => (
        <div
          key={i}
          className="aspect-square rounded-[3px]"
          style={{ background: COLORS[v] }}
        />
      ))}
    </div>
  );
};
