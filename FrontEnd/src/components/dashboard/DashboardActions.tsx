import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Brain, Layers, ArrowRight } from "lucide-react";

interface ActionCardProps {
  to: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  icon: ReactNode;
  /** Visual variant — primary = gradient blue card, surface = neutral white. */
  variant: "primary" | "surface";
}

const ActionCard = ({
  to,
  eyebrow,
  title,
  description,
  icon,
  variant,
}: ActionCardProps) => {
  const isPrimary = variant === "primary";
  return (
    <Link
      to={to}
      className={
        "group relative overflow-hidden rounded-v2-lg p-7 flex flex-col justify-between min-h-[200px] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px " +
        (isPrimary
          ? "text-white border border-transparent hover:shadow-[0_24px_48px_-20px_rgba(86,125,241,0.45)]"
          : "bg-v2-surface border border-v2-line hover:border-v2-line-2 hover:shadow-v2-md")
      }
      style={
        isPrimary
          ? {
              background:
                "linear-gradient(160deg, var(--color-v2-primary), var(--color-v2-primary-deep))",
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={
            "w-10 h-10 rounded-[12px] flex items-center justify-center " +
            (isPrimary
              ? "bg-white/15 text-white"
              : "bg-v2-primary-pale text-v2-primary-deep")
          }
        >
          {icon}
        </div>
        <ArrowRight
          size={18}
          className={
            "transition-transform duration-200 group-hover:translate-x-1 " +
            (isPrimary ? "text-white/70" : "text-v2-ink-3")
          }
        />
      </div>

      <div>
        <div
          className={
            "font-v2-mono text-[11px] tracking-[1.5px] uppercase mb-2 font-medium " +
            (isPrimary ? "text-white/70" : "text-v2-ink-3")
          }
        >
          {eyebrow}
        </div>
        <h3
          className={
            "text-[24px] font-medium m-0 mb-1.5 leading-tight tracking-[-0.3px] [&_em]:font-v2-serif [&_em]:italic [&_em]:font-normal"
          }
        >
          {title}
        </h3>
        <p
          className={
            "text-[14px] m-0 leading-[1.45] " +
            (isPrimary ? "text-white/80" : "text-v2-ink-2")
          }
        >
          {description}
        </p>
      </div>
    </Link>
  );
};

/**
 * Two-card action row beneath the KPI strip. Replaces the prototype's
 * "Siguiente en cola" + donut row, since neither feature ships today.
 */
export const DashboardActions = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-9">
    <ActionCard
      to="/sesionesEstudio"
      eyebrow="Sesión de estudio"
      title={
        <>
          Estudiar <em>ahora</em>
        </>
      }
      description="Elige un mazo y un método: repaso libre, Pomodoro o prueba simulada."
      icon={<Brain size={20} />}
      variant="primary"
    />
    <ActionCard
      to="/mazos"
      eyebrow="Mis mazos"
      title="Crear y organizar"
      description="Tus mazos, todas las cartas y los tres tipos en un solo lugar."
      icon={<Layers size={20} />}
      variant="surface"
    />
  </div>
);
