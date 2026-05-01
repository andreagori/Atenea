import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui";

interface SectionLink {
  href: string;
  label: string;
}

const WELCOME_SECTIONS: SectionLink[] = [
  { href: "#metodos", label: "Métodos" },
  { href: "#modos", label: "Modos" },
  { href: "#analisis", label: "Análisis" },
];

const handleAnchorClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!href.startsWith("#")) return;
  const target = document.getElementById(href.slice(1));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Public-site sticky topnav (70px) with backdrop blur.
 * Section pill links only render on the welcome page (`/`), where they
 * smooth-scroll to in-page anchors.
 */
export const PublicTopNav = () => {
  const { pathname } = useLocation();
  const onWelcome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 h-[70px] bg-v2-bg/80 backdrop-blur-[20px] border-b border-v2-line">
      <div className="max-w-[1340px] mx-auto px-10 h-full flex items-center justify-between gap-6">
        <Link
          to="/"
          className="font-v2-serif italic text-[26px] text-v2-primary-deep leading-none"
        >
          Atenea
        </Link>

        {onWelcome && (
          <nav className="hidden lg:flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-v2-surface border border-v2-line">
            {WELCOME_SECTIONS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleAnchorClick(e, l.href)}
                className="px-4 py-2 text-[13px] font-medium text-v2-ink-2 hover:text-v2-ink rounded-full transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <Link to="/inicioSesion">
            <Button variant="ghost">Iniciar sesión</Button>
          </Link>
          <Link to="/registro">
            <Button variant="primary">Crear cuenta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
