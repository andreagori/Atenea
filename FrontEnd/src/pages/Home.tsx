import { Navbar } from "../components/Navbar";
import Banner from "../components/Banner";
import MetodosCardsHome from "../components/MetodosCardsHome";
import AnalisisContainer from "../components/AnalisisContainer";
import QuienesSomosContainer from "../components/QuienesSomosContainer";
import GradientText from "../libs/reactbits/GradientText";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBackground">
      <Navbar />
      {/* Main Content */}
      <div className="mt-8">
          <Banner />
      </div>

      {/* Gradient subtitle. Metodos Section */}
      <section id="metodos" className="mt-24 text-center flex flex-col items-center justify-center flex-1">
          <GradientText
            colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7"]}
            animationSpeed={4}
            showBorder={false}
            className="text-6xl font-bold mb-8"
          >
            Metodos
          </GradientText>
          <MetodosCardsHome />
        </section>

      {/* Gradient subtitle. Analisis Section */}
      <section id="analisis" className="mt-24 text-center flex flex-col items-center justify-center flex-1">
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7", "#001144"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold mt-10"
        >
          Analisis
        </GradientText>
        </section>

        {/* Quienes Somos Section */}
        <section id="quienesomos" className="mt-24 text-center flex flex-col items-center justify-center flex-1">
        <GradientText
          colors={["#193AB7", "#001144", "#193AB7", "#001144", "#193AB7", "#001144"]}
          animationSpeed={5}
          showBorder={false}
          className="text-5xl font-bold mt-10 mb-15"
        >
          <AnalisisContainer />
          ¿Quienes Somos?
        </GradientText>
        <QuienesSomosContainer />
        </section>
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
