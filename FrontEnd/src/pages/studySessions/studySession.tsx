import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarLoginIn } from "../../components/Navbar";
import SelectDecksStudySession from "../../libs/daisyUI/SelectDecksStudySession";
import StudySessionsOptions from "../../components/StudySessionsOptions";

{/* Después hacer un hook con esto */}
const sesionEstudio = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!selectedOption) {
      alert("Por favor selecciona un tipo de sesión antes de comenzar.");
      return;
    }
  
    switch (selectedOption) {
      case "regular":
        navigate("/sesionesEstudio/regular");
        break;
      case "pomodoro":
        navigate("/sesionesEstudio/pomodoro");
        break;
      case "simuladas":
        navigate("/sesionesEstudio/simuladas");
        break;
      default:
        alert("Opción no válida.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="font-primary scroll-smooth scrollbar-hide">
      <NavbarLoginIn />
      <div className="w-full min-h-screen bg-darkBackground flex flex-col items-center mt-25 overflow-x-hidden">
        <h1 className="text-6xl font-bold text-lightComponent mb-8 text-center">
          SESIÓN DE <br /> ESTUDIO
        </h1>
        <p className="text-xl font-bold mt-2 mb-2 text-lightComponent">
          Selecciona el mazo a estudiar:
        </p>
        <SelectDecksStudySession />
        <p className="text-xl font-bold mt-10 text-lightComponent">
          Selecciona el tipo de sesión de estudio:
        </p>
        <StudySessionsOptions
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        {/* Botones */}
        <div className="mt-10 flex gap-6 m-10">
            <button
            onClick={handleBack}
            className="px-6 py-3 rounded text-white hover:bg-darkNeutral hover:text-darkNeutralText transition flex items-center gap-2"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
              />
            </svg>
            Regresar
            </button>


            <button
            onClick={handleStart}
            className={`px-6 py-3 rounded flex items-center gap-2 ${
              selectedOption
              ? "bg-darkPrimary hover:bg-darkSecondary"
              : "bg-gray-400 cursor-not-allowed"
            } text-white transition`}
            disabled={!selectedOption}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
            Comenzar
            </button>
        </div>
      </div>
    </div>
  );
};

export default sesionEstudio;