import { Navbar } from "../components/Navbar";
import Banner from "../components/Banner";
import MetodosCardsHome from "../components/CardsMethodsInfo";
import AnalisisContainer from "../components/AnalisysHomeContainer";
import QuienesSomosContainer from "../components/WhoareweContainerHome";
import CardsTypesStart from "@/components/CardsTypesStart";

const Home = () => {
  return (
    <>
      <Navbar />
      {/* Metodos Section */}
      <div className="w-full overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar-hide bg-darkBackground">
      <Banner />
        <MetodosCardsHome />
        <CardsTypesStart />
          <AnalisisContainer />
          <QuienesSomosContainer />
      </div>
    </>
  );
};

export default Home;
