import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

/**
 * Closing CTA block — gradient background with white-on-blue button.
 * Sits in its own section, full-bleed within the 1240px max-width.
 */
export const WelcomeFinalCTA = () => (
  <section className="max-w-[1340px] mx-auto px-10 pb-20">
    <div
      className="relative overflow-hidden rounded-[32px] px-15 py-20 text-center text-white max-w-[1240px] mx-auto mt-15"
      style={{
        background:
          "linear-gradient(160deg, var(--color-v2-primary), var(--color-v2-primary-deep))",
        padding: "80px 60px",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(166,131,255,0.2), transparent 50%)",
        }}
      />
      <div className="relative">
        <h2 className="m-0 mb-9 text-[clamp(40px,6vw,72px)] font-medium leading-none tracking-[-1.5px] [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal">
          Empieza a estudiar <em>distinto</em>.
        </h2>
        <Link to="/registro">
          <Button variant="onBlue" size="lg">
            Crear cuenta →
          </Button>
        </Link>
      </div>
    </div>
  </section>
);
