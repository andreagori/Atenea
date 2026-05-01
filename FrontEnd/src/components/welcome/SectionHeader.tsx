import { type ReactNode } from "react";

export interface SectionHeaderProps {
  /** Mono-font eyebrow tag, e.g. "01 · MÉTODOS DE ESTUDIO" */
  eyebrow: string;
  /** Title text. Wrap accent words in <em> for the Instrument Serif italic treatment. */
  title: ReactNode;
  lede?: ReactNode;
}

export const SectionHeader = ({ eyebrow, title, lede }: SectionHeaderProps) => (
  <div className="flex flex-col items-center text-center mb-16">
    <span className="px-3 py-1.5 bg-v2-primary-pale text-v2-primary-deep rounded-full text-[11px] font-medium font-v2-mono tracking-[1.5px] uppercase mb-4">
      {eyebrow}
    </span>
    <h2 className="m-0 mb-4 text-[clamp(36px,5vw,56px)] font-medium leading-[1.05] tracking-[-1.5px] max-w-[820px] [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal [&_em]:text-v2-primary">
      {title}
    </h2>
    {lede && (
      <p className="m-0 text-[17px] text-v2-ink-2 max-w-[600px] leading-[1.55]">
        {lede}
      </p>
    )}
  </div>
);
