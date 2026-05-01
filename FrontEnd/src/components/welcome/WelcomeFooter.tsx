import { Link } from "react-router-dom";

interface FooterColumn {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: "Producto",
    links: [
      { label: "Métodos", href: "#metodos", external: true },
      { label: "Modos", href: "#modos", external: true },
      { label: "Análisis", href: "#analisis", external: true },
    ],
  },
  {
    heading: "Cuenta",
    links: [
      { label: "Iniciar sesión", href: "/inicioSesion" },
      { label: "Crear cuenta", href: "/registro" },
    ],
  },
];

const FooterLink = ({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) => {
  const cls =
    "block text-v2-ink-2 py-1 text-sm hover:text-v2-ink transition-colors";
  if (external || href === "#" || href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={cls}>
      {children}
    </Link>
  );
};

export const WelcomeFooter = () => (
  <footer className="pt-[70px] pb-12 border-t border-v2-line">
    <div className="max-w-[1340px] mx-auto px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-15 mb-10">
        <div>
          <div className="font-v2-serif italic text-[26px] text-v2-primary-deep leading-none mb-4">
            Atenea
          </div>
          <p className="text-v2-ink-2 text-sm max-w-[320px] leading-[1.55] m-0">
            Una plataforma honesta para estudiantes universitarios que quieren
            entender — no sólo aprobar.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="font-v2-mono text-[11px] tracking-[1.5px] uppercase text-v2-ink-3 mb-3.5 font-medium">
              {col.heading}
            </div>
            {col.links.map((link) => (
              <FooterLink
                key={link.label}
                href={link.href}
                external={link.external}
              >
                {link.label}
              </FooterLink>
            ))}
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-v2-line flex justify-between flex-wrap gap-2 font-v2-mono text-xs text-v2-ink-3 tracking-[1px]">
        <span>© 2026 Atenea</span>
        <span>Andrea Rivas Gómez</span>
      </div>
    </div>
  </footer>
);
