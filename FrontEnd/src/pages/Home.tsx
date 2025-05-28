import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import Banner from "../components/Banner";
import MetodosCardsHome from "../components/CardsMethodsInfo";
import AnalisisContainer from "../components/AnalisysHomeContainer";
import QuienesSomosContainer from "../components/WhoareweContainerHome";
import CardsTypesStart from "@/components/CardsTypesStart";

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

      {/* Botón flotante para subir */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white/10 hover:bg-darkSecondary/40  rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 z-50"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 10l7-7m0 0l7 7m-7-7v18" 
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Home;
