import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  Layers,
  Brain,
  BarChart3,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarUser {
  name: string;
  /** Single-character avatar fallback. Defaults to first letter of `name`. */
  initial?: string;
}

export interface SidebarProps {
  collapsed: boolean;
  user?: SidebarUser | null;
  onLogout?: () => void;
  /**
   * If provided, renders a chevron toggle below the logo so the user can
   * collapse / expand the sidebar manually.
   */
  onToggleCollapse?: () => void;
  /** Replace the default text logo. */
  logo?: ReactNode;
  className?: string;
}

interface NavItem {
  to: string;
  /** Pathname prefixes that mark this item as active. */
  matches: string[];
  label: string;
  icon: ReactNode;
}

// Configuración intentionally omitted — not designed in the V2 bundle.
// See DESIGN_SYSTEM_ANALYSIS.md §10.2.
const NAV_ITEMS: NavItem[] = [
  {
    to: "/inicio",
    matches: ["/inicio"],
    label: "Inicio",
    icon: <HomeIcon size={20} />,
  },
  {
    to: "/mazos",
    matches: ["/mazos"],
    label: "Mis Mazos",
    icon: <Layers size={20} />,
  },
  {
    to: "/sesionesEstudio",
    matches: ["/sesionesEstudio"],
    label: "Sesión de Estudio",
    icon: <Brain size={20} />,
  },
  {
    to: "/analisis",
    matches: ["/analisis"],
    label: "Análisis",
    icon: <BarChart3 size={20} />,
  },
];

const isMatch = (pathname: string, matches: string[]) =>
  matches.some((m) => pathname === m || pathname.startsWith(`${m}/`));

const DefaultLogo = ({ collapsed }: { collapsed: boolean }) => (
  <span
    className={cn(
      "font-v2-serif italic text-v2-primary-deep leading-none",
      collapsed ? "text-[22px]" : "text-[26px]"
    )}
  >
    {collapsed ? "A" : "Atenea"}
  </span>
);

export const Sidebar = ({
  collapsed,
  user,
  onLogout,
  onToggleCollapse,
  logo,
  className,
}: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col bg-v2-bg border-r border-v2-line",
        "transition-[width,padding] duration-200",
        collapsed ? "w-[88px] px-3 py-6" : "w-[248px] px-[22px] py-6",
        className
      )}
    >
      {/* Logo + collapse toggle on the same row */}
      <div className="flex items-center justify-between gap-2 h-9">
        {logo ?? <DefaultLogo collapsed={collapsed} />}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
            }
            title={
              collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
            }
            className={cn(
              "w-7 h-7 flex-shrink-0 inline-flex items-center justify-center rounded-md",
              "text-v2-ink-3 hover:bg-v2-primary/[0.06] hover:text-v2-primary-deep",
              "transition-colors duration-150"
            )}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        )}
      </div>

      <nav className="mt-8 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = isMatch(pathname, item.matches);
          return (
            <Link
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-[14px] text-[15px] font-medium border",
                "transition-[background-color,color,border-color] duration-150",
                collapsed
                  ? "justify-center py-[11px] px-0"
                  : "py-[11px] px-3.5",
                active
                  ? "bg-v2-surface text-v2-primary-deep border-v2-line shadow-v2-sm"
                  : "bg-transparent text-v2-ink-2 border-transparent hover:bg-v2-primary/[0.06] hover:text-v2-primary-deep"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div
          className={cn(
            "mt-auto flex items-center gap-3 p-2 rounded-[14px]",
            collapsed && "justify-center"
          )}
        >
          <div className="w-[34px] h-[34px] rounded-full bg-v2-primary-soft text-white font-semibold text-sm flex items-center justify-center flex-shrink-0">
            {(user.initial ?? user.name.charAt(0) ?? "?").toUpperCase()}
          </div>
          {!collapsed && (
            <>
              <div className="text-[15px] text-v2-primary-deep font-medium truncate">
                {user.name}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="ml-auto p-1.5 rounded-md text-v2-ink-2 hover:bg-v2-coral/10 hover:text-v2-coral transition-colors"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  type="button"
                >
                  <LogOut size={18} />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </aside>
  );
};
