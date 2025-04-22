import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import MetodosCardsHome from "../components/MetodosCardsHome";
import AnalisisContainer from "../components/AnalisisContainer";
import QuienesSomosContainer from "../components/QuienesSomosContainer";
import GradientText from "../libs/reactbits/GradientText";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBackground">
      {/* NavBar Home */}
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

      {/* Main Content */}
      <div className="mt-8">
          <Banner />
      </div>

      {/* Gradient subtitle */}
      <main className="mt-24 text-center flex flex-col items-center justify-center flex-1">
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7"]}
          animationSpeed={5}
          showBorder={false}
          className="text-6xl font-bold mb-8"
        >
          Metodos
        </GradientText>
        <MetodosCardsHome />
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold mt-10"
        >
          Analisis
        </GradientText>
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold mt-10 mb-15"
        >
          <AnalisisContainer />
          ¿Quienes Somos?
        </GradientText>
        <QuienesSomosContainer />
      </main>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
