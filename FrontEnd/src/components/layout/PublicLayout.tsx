import { type ReactNode } from "react";
import { PublicTopNav } from "./PublicTopNav";

export interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Layout for public, unauthenticated routes (welcome, sign in, sign up).
 *
 * Not wired into AppRouter yet — exists so the welcome-page migration can
 * drop it in without writing new layout code first.
 */
export const PublicLayout = ({ children }: PublicLayoutProps) => (
  <div className="min-h-screen bg-v2-bg text-v2-ink">
    <PublicTopNav />
    <main>{children}</main>
  </div>
);
