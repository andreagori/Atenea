// rafce to create page template
// Imports
import Footer from "../components/Footer";
import MazoSesionCardsHome from "../components/MazoSesionCardsHome";
import { NavbarLoginIn } from "../components/Navbar";

const HomeLoginIn = () => {
  return (
    <div className="flex flex-col min-h-screen font-primary bg-darkBackground">
      {/* Navbar */}
      <NavbarLoginIn />
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center mt-15">
        {/* Title Content */}
        <div className="mt-8 text-5xl text-center text-darkPSText">
          <h1>
            ¡Hola de nuevo
            <br />
            <strong>Tu Usuario</strong>!
          </h1>
          <p className="text-lg mt-12">¿Qué quieres hacer hoy?</p>
        </div>

        <MazoSesionCardsHome />

        {/* Análisis Content */}
        <div className="flex flex-col items-center text-darkPSText text-2xl mt-8">
          <h1>Resúmen de análisis</h1>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default HomeLoginIn;