import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Sidebar, type SidebarUser } from "./Sidebar";

export interface AppShellProps {
  children: ReactNode;
}

const SIDEBAR_PREF_KEY = "v2-sidebar-collapsed";

/**
 * Returns true when the current pathname is an _active_ study session
 * (e.g. /sesionesEstudio/regular/:sessionId). The setup route
 * /sesionesEstudio (no extra segments) keeps the expanded sidebar.
 */
const isActiveStudySession = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "sesionesEstudio" && parts.length >= 3;
};

const readStoredPref = (): boolean | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(SIDEBAR_PREF_KEY);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return null;
};

/**
 * Authenticated layout shell. Persistent sidebar + main content area.
 *
 * Sidebar collapse logic:
 *  - First visit, no stored preference → auto-collapse on active study
 *    sessions (`/sesionesEstudio/<mode>/:id`) for screen real estate.
 *  - User clicks the chevron toggle → preference persists in localStorage
 *    and overrides the auto-collapse on every route afterward.
 *
 * Main content is capped at 1340px (DESIGN_SYSTEM_ANALYSIS.md §3) and
 * centered, so wide displays don't leave content flush left.
 */
export const AppShell = ({ children }: AppShellProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [userPref, setUserPref] = useState<boolean | null>(readStoredPref);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (userPref === null) {
      window.localStorage.removeItem(SIDEBAR_PREF_KEY);
    } else {
      window.localStorage.setItem(SIDEBAR_PREF_KEY, String(userPref));
    }
  }, [userPref]);

  const routeForcesCollapse = useMemo(
    () => isActiveStudySession(pathname),
    [pathname]
  );

  const collapsed = userPref !== null ? userPref : routeForcesCollapse;

  const handleToggleCollapse = () => {
    setUserPref((prev) => !(prev ?? routeForcesCollapse));
  };

  const sidebarUser: SidebarUser | null = user
    ? { name: user.username, initial: user.username.charAt(0).toUpperCase() }
    : null;

  const handleLogout = () => {
    Cookies.remove("auth_token");
    navigate("/inicioSesion");
  };

  return (
    <div
      className={cn(
        "grid min-h-screen bg-v2-bg text-v2-ink",
        collapsed ? "grid-cols-[88px_1fr]" : "grid-cols-[248px_1fr]"
      )}
    >
      <Sidebar
        collapsed={collapsed}
        user={sidebarUser}
        onLogout={handleLogout}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="min-w-0">
        <div className="mx-auto max-w-[1340px] px-10 py-8">{children}</div>
      </main>
    </div>
  );
};
