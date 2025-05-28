import { useLogout } from "@/hooks/useLogin";
import { Link, useLocation } from "react-router-dom";

interface NavbarStudySessionProps {
  sessionType?: string | null;
}


export function Navbar() {
  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 justify-end items-center w-full font-primary">
          <a href="#metodos" className="hover:text-darkAccent">Métodos</a>
          <a href="#tiposCartas" className="hover:text-darkAccent">Tipos de cartas</a>
          <a href="#analisis" className="hover:text-darkAccent">Análisis</a>
          <a href="#quienesomos" className="hover:text-darkAccent">Quienes Somos</a>
        </div>
      </nav>
    </header>
  );
}

export function NavbarForms() {
  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
      </nav>
    </header>
  );
}

export function NavbarLoginIn() {
  const { logout } = useLogout();

  return (
    <>
      <header className="text-darkBgText w-full fixed top-0 left-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <nav className="container mx-auto flex justify-between items-center p-3.5">
          {/* Logo */}
          <Link to="/inicio" className="flex items-center text-xl font-primary font-semibold">
            <img
              src="/AteneaIcon.svg"
              alt="Logo"
              className="h-8 w-auto cursor-pointer"
            />
            <span className="ml-2 cursor-pointer">Atenea</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center font-primary">
            <Link to="/mazos" className="hover:text-darkAccent transition-colors duration-200">Mazos</Link>
            <Link to="/analisis" className="hover:text-darkAccent transition-colors duration-200">Análisis</Link>
            <Link to="/sesionesEstudio" className="hover:text-darkAccent transition-colors duration-200">Sesión de estudio</Link>

            {/* Botón discreto de cerrar sesión */}
            <button
              onClick={logout}
              className=" text-darkBgText hover:text-darkPSText rounded-lg transition-all duration-200 group cursor-pointer"
              title="Cerrar sesión"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export function NavbarStudySession({ sessionType }: NavbarStudySessionProps = {}) {
  const location = useLocation();
  
  // Detectar tipo de sesión desde la URL si no se proporciona
  const getSessionTypeFromUrl = () => {
    if (sessionType) return sessionType;
    
    const path = location.pathname;
    if (path.includes('/espaciada/')) return 'espaciada';
    if (path.includes('/activa/')) return 'activa';
    if (path.includes('/rapida/')) return 'rapida';
    if (path.includes('/personalizada/')) return 'personalizada';
    if (path.includes('/pomodoro/')) return 'pomodoro';
    if (path.includes('/examen/')) return 'examen';
    return null;
  };

  const getSessionDisplayName = (type: string | null) => {
    switch (type) {
      case 'regular':
        return 'Memorización Espaciada';
      case 'pomodoro':
        return 'Técnica Pomodoro';
      case 'simuladas':
        return 'Examen Simulado';
      default:
        return 'Configurando Sesión';
    }
  };

  const getSessionIcon = (type: string | null) => {
    switch (type) {
      case 'regular':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pomodoro':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'simuladas':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
    }
  };

  const currentSessionType = getSessionTypeFromUrl();
  const isInSession = currentSessionType && location.pathname.includes('/sesionesEstudio/') && location.pathname.split('/').length > 3;

  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/inicio" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center w-full font-primary justify-end">
          <div className="flex items-center space-x-3">
            {getSessionIcon(currentSessionType)}
            <span className="text-lg">
              {getSessionDisplayName(currentSessionType)}
            </span>
            {isInSession && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">En progreso</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}