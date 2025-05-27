import { useLogout } from "@/hooks/useLogin";
import { useState } from "react";
import { Link } from "react-router-dom";

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
              className=" text-darkBgText hover:text-darkPSText rounded-lg transition-all duration-200 group"
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

          {/* Mobile menu button - Solo en móviles */}
          <div className="md:hidden">
            <button
              onClick={logout}
              className=" text-darkBgText hover:text-darkPSText rounded-lg transition-all duration-200 group"
              title="Cerrar sesión"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
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

export function NavbarStudySession() {
  const { logout } = useLogout();

  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/inicio" className="flex items-center text-xl font-primary font-semibold">
          <img src="/AteneaIcon.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 items-center w-full font-primary justify-center">
          <p className="text-lg">Sesión de estudio: Regular</p>
        </div>

        {/* Botón discreto de cerrar sesión */}
        <button
          onClick={logout}
          className=" text-darkBgText hover:text-darkPSText rounded-lg transition-all duration-200 group"
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
      </nav>
    </header>
  );
}