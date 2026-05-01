import { Link } from "react-router-dom";
import { Button } from "@/components/ui";
import { WelcomeAppPreview } from "./WelcomeAppPreview";

export const WelcomeHero = () => (
  <header
    id="top"
    className="max-w-[1340px] mx-auto px-10 pt-[100px] pb-[60px] text-center"
  >
    {/* "Nuevo" tag */}
    <div className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 bg-v2-surface border border-v2-line rounded-full text-[13px] text-v2-ink-2 mb-8">
      <span className="px-2.5 py-1 bg-v2-primary-pale text-v2-primary-deep font-semibold rounded-full text-[11px] font-v2-mono tracking-[1px]">
        NUEVO
      </span>
      Análisis basado en tu progreso real
    </div>

    <h1 className="m-0 mx-auto mb-6 max-w-[1100px] text-[clamp(48px,7vw,88px)] font-medium leading-[0.98] tracking-[-2px] [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal [&_em]:text-v2-primary [&_em]:tracking-[-1px]">
      Tu plataforma para <em>aprender</em> de verdad — no sólo memorizar.
    </h1>

    <p className="text-[19px] text-v2-ink-2 max-w-[620px] mx-auto mb-9 leading-[1.5]">
      Tres métodos de estudio probados, repetición espaciada y un análisis
      honesto que te dice qué funciona contigo. Diseñado para universitarios.
    </p>

    <div className="flex gap-3 justify-center flex-wrap">
      <Link to="/registro">
        <Button variant="primary" size="lg">
          Crear cuenta →
        </Button>
      </Link>
      <Link to="/inicioSesion">
        <Button variant="outline" size="lg">
          Ya tengo cuenta
        </Button>
      </Link>
    </div>

    <WelcomeAppPreview />
  </header>
);
