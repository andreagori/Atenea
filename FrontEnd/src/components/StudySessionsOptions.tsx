import { Link } from "react-router-dom"
import SpotlightCard from "../libs/reactbits/SpotlightCard"

function StudySessionsOptions() {
    return (
      <div className="w-full min-h-full flex flex-col mt-5 font-primary px-4">
        <SpotlightCard
          className="w-full"
          enableSpotlight={false}
          backgroundColor="var(--color-darkComponentElement)"
          withBorder={true}
          borderColor="var(--color-darkAccent)"
        >
          <div className="flex flex-col h-full p-4 text-darkNeutral">
            <img src="/src/assets/createDeckIcon.svg" alt="Mazo" className="w-10 h-10 mb-2" />
            <h2 className="text-5xl font-bold">Crear un <br />Mazo.</h2>
            <p className="mt-2 mb-2 text-xl">
              Crea un nuevo mazo de cartas para estudiar.
            </p>
            <Link to="/inicio"
              className="flex justify-center items-center mt-4 px-4 py-2 bg-gradient-to-b from-darkCustomEnd1 to-darkCustomStart1 text-darkPrimary rounded hover:from-darkNeutral hover:to-darkSecondary transition duration-300">
              Ir
            </Link>
          </div>
        </SpotlightCard>
      </div>
    )
  }
  

export default StudySessionsOptions