// rafce to create page template
// Imports
import Footer from "../components/Footer";
import MazoSesionCardsHome from "../components/MazoSesionCardsHome";
import ResumenAnalisis from "../components/ResumenAnalisis";
import { NavbarLoginIn } from "../components/Navbar";

const HomeLoginIn = () => {
  return (
    <div className="min-h-screen w-full font-primary bg-darkBackground flex flex-col overflow-y-auto scroll-smooth scrollbar-hide">
      
      {/* Navbar */}
      <NavbarLoginIn />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-15 overflow-y-auto scrollbar-hide scroll-smooth">
        <div className="mt-8 text-6xl text-center text-darkPSText">
          <h1>
            ¡Hola de nuevo
            <br />
            <strong>Tu Usuario</strong>!
          </h1>
          <p className="text-3xl mt-15">¿Qué quieres hacer hoy?</p>
        </div>

        <MazoSesionCardsHome />

        {/* Análisis Content */}
        <div className="flex flex-col items-center text-darkPSText text-3xl mt-8">
          <h1>Resúmen de análisis</h1>
        </div>
        <ResumenAnalisis />
      </main>

      {/* Footer */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};


export default HomeLoginIn;