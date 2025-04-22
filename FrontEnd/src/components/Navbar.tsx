// Objective: Create a component to render the navbar. Make different navbar for different states.

/*
var state = {
    isLogged: false,
    };
*/

import { Link } from "react-router-dom";

export function Navbar() {
  return (
    // NavBar Home
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
    <nav className="container mx-auto flex justify-between items-center p-4 bg-darkBackground">
      {/* Logo */}
      <Link to="/" className="flex items-center text-xl font-primary font-semibold">
        <img src="/Atenea logo.svg" alt="Logo" className="h-10 w-auto" />
        <span className="ml-2">Atenea</span>
      </Link>
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-6 justify-end items-center w-full font-primary">
        <Link to="/metodos" className="hover:text-darkAccent">Métodos</Link>
        <Link to="/analisis" className="hover:text-darkAccent">Analisis</Link>
        <Link to="/QuienesSomos" className="hover:text-darkAccent">Quienes Somos</Link>
      </div>
    </nav>
  </header>
  );
}

export function NavbarForms() {
  return (
    <header className="text-darkBgText w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4 bg-darkBackground">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/Atenea logo.svg" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>
      </nav>
    </header>
  );
}