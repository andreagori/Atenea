// Objective: Create a component to render the navbar. Make different navbar for different states.

/*
var state = {
    isLogged: false,
    };
*/

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-darkComponent text-darkBgText shadow-md w-full fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-xl font-primary font-semibold">
          <img src="/path-to-logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="ml-2">Atenea</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 justify-center items-center w-full font-primary">
          <Link to="/metodos" className="hover:text-darkAccent">Métodos</Link>
          <Link to="/analitica" className="hover:text-darkAccent">Analítica</Link>
          <Link to="/pruebas" className="hover:text-darkAccent">Pruebas</Link>
          <Link to="/ajustes" className="hover:text-darkAccent">Ajustes</Link>
          <Link to= "/QuienesSomos" className="hover:text-darkAccent">Quienes Somos</Link>
        </div>
      </nav>
    </header>
  );
}

  