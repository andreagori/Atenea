/**
 * Shared chart palette + helpers for V2 Analysis charts.
 *
 * Chart libraries (chart.js, recharts) want concrete color strings, not CSS
 * variable references, so we resolve V2 tokens to the literal hex values
 * here. Keep these in sync with `--color-v2-*` in index.css.
 */

export const V2 = {
  ink: "#1B1D2D",
  ink2: "#686868",
  ink3: "rgba(27, 29, 45, 0.5)",
  line: "#E0E5F5",
  surface: "#FFFFFF",
  bg: "#FAFBFD",
  paper: "#F5F4EE",

  primary: "#567DF1",
  primaryDeep: "#344FA4",
  primarySoft: "#90A5F5",
  primaryTint: "#C6D2FF",
  primaryPale: "#EBF0FF",

  violet: "#A683FF",
  magenta: "#C055E7",
  coral: "#FF4540",
  // green and amber are oklch in CSS — these are visually-matched fallbacks
  // for chart.js / recharts which don't read CSS vars.
  green: "#3FB97C",
  amber: "#E8A93D",
} as const;

/** Tooltip styling shared by chart.js charts. */
export const tooltipChartJs = {
  backgroundColor: "#FFFFFF",
  borderColor: V2.line,
  borderWidth: 1,
  titleColor: V2.ink,
  bodyColor: V2.ink2,
  cornerRadius: 8,
  padding: 10,
  titleFont: { size: 12, weight: "bold" as const },
  bodyFont: { size: 12 },
  displayColors: false,
} as const;
