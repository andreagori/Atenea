import { type ReactNode } from "react";
import { Link } from "react-router-dom";

export interface AuthShowcasePanelProps {
  /** Eyebrow chip text (small uppercase mono label). */
  eyebrow: string;
  /** Title. Wrap an accent word in <em> for the Instrument Serif italic. */
  title: ReactNode;
  /** Body paragraph below the title. */
  description: ReactNode;
  /**
   * The glass-card preview shown beneath the description.
   * Login passes <MiniDashboardCard />; Register passes <MiniDeckLibraryCard />.
   */
  children: ReactNode;
}

/**
 * Left-side gradient panel shown on /inicioSesion and /registro.
 * Hidden below the lg breakpoint (matches prototype's 980px threshold).
 *
 * The media card slot (children) is what differentiates the two pages —
 * returning users see a dashboard preview, new users see a deck-library
 * preview. Pure presentational; no social-proof or live-counter widgets.
 */
export const AuthShowcasePanel = ({
  eyebrow,
  title,
  description,
  children,
}: AuthShowcasePanelProps) => (
  <div
    className="relative overflow-hidden hidden lg:flex flex-col justify-between text-white px-14 py-10"
    style={{
      background:
        "linear-gradient(160deg, var(--color-v2-primary-deep) 0%, var(--color-v2-primary) 50%, #6E89F4 100%)",
    }}
  >
    {/* Decorative radial highlights */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(166,131,255,0.35), transparent 50%), radial-gradient(circle at 20% 80%, rgba(192,85,231,0.25), transparent 50%)",
      }}
    />

    {/* Header: logo + back link */}
    <div className="relative z-[2] flex justify-between items-center">
      <Link
        to="/"
        className="font-v2-serif italic text-[26px] text-white leading-none no-underline"
      >
        Atenea
      </Link>
      <Link
        to="/"
        className="font-v2-mono text-xs tracking-[1.2px] uppercase text-white/85 hover:text-white no-underline"
      >
        ← Volver
      </Link>
    </div>

    {/* Body */}
    <div className="relative z-[2] max-w-[540px]">
      <span className="font-v2-mono inline-block text-[11px] tracking-[2.2px] uppercase text-white/70 px-3 py-1 bg-white/[0.12] rounded-full mb-6">
        {eyebrow}
      </span>
      <h2 className="text-[44px] leading-[1.05] tracking-[-1.2px] font-medium m-0 mb-4 [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal [&_em]:text-white/95">
        {title}
      </h2>
      <p className="text-[16px] leading-[1.55] text-white/85 m-0 mb-8 max-w-[480px]">
        {description}
      </p>

      {children}
    </div>

    {/* Foot: empty placeholder for visual balance */}
    <div className="relative z-[2]" />
  </div>
);
