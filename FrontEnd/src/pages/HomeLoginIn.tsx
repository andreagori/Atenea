// rafce to create page template
// Imports
import Footer from "../components/Footer";
import MazoSesionCardsHome from "../components/CreateStudyDeckMenu";
import ResumenAnalisis from "../components/AnalisysSummary";
import { NavbarLoginIn } from "../components/Navbar";
import { useUser } from "@/hooks/useUser";

const HomeLoginIn = () => {
  const { user, loading } = useUser();
  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lightComponent">Cargando...</div>;
  }
  if (!user) {
    return <div className="flex justify-center items-center h-screen text-lightComponent">No se pudo cargar el usuario.</div>;
  }
  return (
    <div className="min-h-screen w-full font-primary bg-darkBackground flex flex-col overflow-y-auto scroll-smooth scrollbar-hide"
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>

      {/* Navbar */}
      <NavbarLoginIn />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center mt-15 overflow-y-auto scrollbar-hide scroll-smooth">
        <div className="mt-8 text-6xl text-center text-lightComponent">
          <h1>
            ¡Hola de nuevo
            <br />
            <strong>{user.username}</strong>!
          </h1>
          <p className="text-3xl mt-15 text-darkSecondaryPurple">¿Qué quieres hacer hoy?</p>
        </div>

        <MazoSesionCardsHome />

        {/* Análisis Content */}
        <div className="flex flex-col items-center text-darkSecondaryPurple text-3xl mt-3">
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