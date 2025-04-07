import { Link } from "react-router-dom";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-darkBackground">
      {/* NavBar Home */}
      <div>
        <header className="bg-darkComponent text-darkBgText shadow-md w-full fixed top-0 left-0 z-50 mb-0">
          <nav className="container mx-auto flex justify-between items-center p-4">
            {/* Logo */}
            <Link to="/" className="flex items-center text-xl font-primary font-semibold">
              <img src="/path-to-logo.png" alt="Logo" className="h-10 w-auto" />
              <span className="ml-2">Atenea</span>
            </Link>
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6 justify-end items-center w-full font-primary">
              <Link to="/metodos" className="hover:text-darkAccent">Métodos</Link>
              <Link to="/analitica" className="hover:text-darkAccent">Analítica</Link>
              <Link to="/pruebas" className="hover:text-darkAccent">Pruebas</Link>
              <Link to="/ajustes" className="hover:text-darkAccent">Ajustes</Link>
              <Link to="/QuienesSomos" className="hover:text-darkAccent">Quienes Somos</Link>
            </div>
          </nav>
        </header>
        {/* NavBar Home End */}
        {/* Content Home */}
          <Banner />
        </div>
        {/* Content Home End */}
      </div>
  );
};

export default Home;
