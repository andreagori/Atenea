import { type ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { Sidebar, type SidebarUser } from "./Sidebar";

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Returns true when the current pathname is an _active_ study session
 * (e.g. /sesionesEstudio/regular/:sessionId). The setup route
 * /sesionesEstudio (no extra segments) keeps the expanded sidebar.
 */
const isActiveStudySession = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "sesionesEstudio" && parts.length >= 3;
};

/**
 * Authenticated layout shell. Persistent sidebar + main content area.
 *
 * The sidebar auto-collapses to 88px on active study session routes so
 * the study card has room. See DESIGN_SYSTEM_ANALYSIS.md §10.1.
 */
export const AppShell = ({ children }: AppShellProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const collapsed = useMemo(() => isActiveStudySession(pathname), [pathname]);

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
      />
      <main className="min-w-0 px-10 py-8">{children}</main>
    </div>
  );
};
