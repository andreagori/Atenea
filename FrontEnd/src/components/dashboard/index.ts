// V2 dashboard sections shown at /inicio (post-login home).
// Each section is independently composable so future changes (real
// streak widget, due-today queue, methods donut once /analisis ships)
// can drop in without rewriting the page.

export { DashboardHeader, type DashboardHeaderProps } from "./DashboardHeader";
export {
  DashboardKpiRow,
  type DashboardKpiRowProps,
} from "./DashboardKpiRow";
export { DashboardActions } from "./DashboardActions";
export {
  RecentDecksSection,
  type RecentDecksSectionProps,
} from "./RecentDecksSection";
