import { type ReactNode } from "react";

export interface DashboardHeaderProps {
  /** Logged-in user's display name (we have `username` only, no full name). */
  username: string | null | undefined;
  /** Loading state from the user fetch. */
  loading?: boolean;
}

export const DashboardHeader = ({ username, loading }: DashboardHeaderProps) => {
  const greeting: ReactNode = loading ? (
    <span className="inline-block w-32 h-5 bg-v2-line rounded animate-pulse" />
  ) : (
    <>¡Hola, <strong className="text-v2-ink font-medium">{username ?? "estudiante"}</strong>!</>
  );

  return (
    <div className="mb-7">
      <div className="text-[18px] text-v2-ink-3 font-normal mb-1.5">{greeting}</div>
      <h1 className="text-[38px] font-medium m-0 leading-[1.05] tracking-[-0.5px] [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal">
        ¿Qué quieres <em>aprender</em> hoy?
      </h1>
    </div>
  );
};
