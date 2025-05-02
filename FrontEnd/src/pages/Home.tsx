import { Navbar } from "../components/Navbar";
import Banner from "../components/Banner";
import MetodosCardsHome from "../components/MetodosCardsInfo";
import AnalisisContainer from "../components/AnalisisContainer";
import QuienesSomosContainer from "../components/QuienesSomosContainer";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* Metodos Section */}
      <div className="h-screen w-full overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-hide bg-darkBackground">
      <Banner />
        <MetodosCardsHome />
          <AnalisisContainer />
          <QuienesSomosContainer />
        <footer className="w-full">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Home;
