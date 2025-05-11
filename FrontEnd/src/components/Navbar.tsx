// Objective: Create a component to render the navbar. Make different navbar for different states.

import { Link } from "react-router-dom";

export function Navbar() {
  return (
    // NavBar Home
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
  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <nav className="container mx-auto flex justify-between items-center p-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-8 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 justify-end items-center w-full font-primary">
          <Link to="/mazos" className="hover:text-darkAccent">Mazos</Link>
          <Link to="/analisis" className="hover:text-darkAccent">Análisis</Link>
          <Link to="/sesionesEstudio" className="hover:text-darkAccent">Sesión de estudio</Link>
        </div>
      </nav>
    </header>
  );
}

export function NavbarStudySession() {
  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 justify-end items-center w-full font-primary">
          <p>Sesión de estudio: Regular</p>
        </div>
      </nav>
    </header>
  );
}