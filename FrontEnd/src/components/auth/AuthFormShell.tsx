import { type ReactNode } from "react";
import { Link } from "react-router-dom";

export interface AuthFormShellProps {
  /** Top-right "do you have an account?" link copy. */
  topPrompt: { text: string; cta: string; to: string };
  /** Eyebrow chip rendered above the title. */
  eyebrow: string;
  /** Form title. Use <em> for italic accent words. */
  title: ReactNode;
  /** Subtitle/lede under the title. */
  subtitle?: ReactNode;
  /** The actual form (rendered inside the centered max-w-[440px] column). */
  children: ReactNode;
}

/**
 * Right-side container for both /inicioSesion and /registro forms.
 * Renders: top-right alt-action link → centered form column → footer.
 */
export const AuthFormShell = ({
  topPrompt,
  eyebrow,
  title,
  subtitle,
  children,
}: AuthFormShellProps) => (
  <div className="flex flex-col bg-v2-bg min-h-screen px-7 lg:px-14 py-8">
    <div className="flex justify-end">
      <Link
        to={topPrompt.to}
        className="text-[13px] text-v2-ink-2 no-underline hover:text-v2-ink"
      >
        {topPrompt.text}{" "}
        <strong
          className="text-v2-ink ml-1.5 underline underline-offset-4"
          style={{ textDecorationColor: "var(--color-v2-primary)" }}
        >
          {topPrompt.cta}
        </strong>
      </Link>
    </div>

    <div className="flex-1 flex flex-col justify-center max-w-[440px] w-full mx-auto py-8">
      <span className="font-v2-mono inline-block self-start text-[11px] tracking-[1.5px] uppercase font-medium px-3 py-1 bg-v2-primary-pale text-v2-primary-deep rounded-full mb-5">
        {eyebrow}
      </span>
      <h1 className="text-[44px] font-medium leading-[1.02] tracking-[-1.2px] m-0 mb-3.5 [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal [&_em]:text-v2-primary">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[15px] text-v2-ink-2 m-0 mb-9 leading-[1.55]">
          {subtitle}
        </p>
      )}

      {children}
    </div>

    <div className="pt-5 font-v2-mono text-xs text-v2-ink-3 tracking-[0.5px] flex justify-between flex-wrap gap-2">
      <span>© 2026 Atenea</span>
      <span>Andrea Rivas Gómez</span>
    </div>
  </div>
);
