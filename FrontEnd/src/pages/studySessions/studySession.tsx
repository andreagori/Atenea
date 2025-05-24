import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarLoginIn } from "../../components/Navbar";
import SelectDecksStudySession from "../../libs/daisyUI/SelectDecksStudySession";
import StudySessionsOptions from "../../components/StudySessionsOptions";
import { useStudySession } from "@/hooks/useStudySessions";
import { useStudySessionDefaults } from "@/hooks/useStudySessionsDefaults";
import { CreateStudySessionDto } from "@/types/studySessions.types";

{/* Después hacer un hook con esto */ }
function sesionEstudio() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [sessionConfig, setSessionConfig] = useState<CreateStudySessionDto | null>(null);
  const { createStudySession } = useStudySession();
  const defaultConfig = useStudySessionDefaults(selectedOption);
  const navigate = useNavigate();

  const handleConfigSave = (config: CreateStudySessionDto) => {
    console.log('Saving custom config:', config);
    setSessionConfig(config);
  };

  const handleStart = async () => {
    if (!selectedOption || !selectedDeckId || !defaultConfig) {
      alert("Por favor selecciona un mazo y un tipo de sesión antes de comenzar.");
      return;
    }

    try {
      // Determinar qué configuración usar
      let configToUse: CreateStudySessionDto;

      if (sessionConfig) {
        console.log('Using custom config:', sessionConfig);
        configToUse = sessionConfig;
      } else {
        console.log('Using default config:', defaultConfig);
        configToUse = defaultConfig;
      }

      const response = await createStudySession(selectedDeckId, configToUse);
      console.log('Session created:', response);

      if (response && response.sessionId) {
        const path = `/sesionesEstudio/${selectedOption}/${response.sessionId}`;
        console.log('Navigating to:', path);
        navigate(path, { replace: true });
      } else {
        console.error('No sessionId received in response');
      }
    } catch (err) {
      console.error('Error al crear la sesión:', err);
      alert('Error al crear la sesión de estudio');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="font-primary scroll-smooth scrollbar-hide">
      <NavbarLoginIn />
      <div className="w-full min-h-screen bg-darkBackground flex flex-col items-center mt-15 overflow-x-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
        }}>
        <h1 className="text-6xl text-lightComponent mt-10 mb-8 text-center">
          Sesión de <br /> estudio
        </h1>
        <p className="text-2xl font-semibold mt-2 mb-2 text-lightComponent">
          Selecciona el mazo a estudiar:
        </p>
        <SelectDecksStudySession onDeckSelect={setSelectedDeckId} />
        <p className="text-2xl font-semibold mt-10 text-lightComponent">
          Selecciona el tipo de sesión de estudio:
        </p>
        <StudySessionsOptions
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          deckId={selectedDeckId}
          disabled={!selectedDeckId}
          onConfigSave={handleConfigSave}
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
            className={`px-6 py-3 rounded flex items-center gap-2 ${selectedOption && selectedDeckId
              ? "bg-darkPrimary hover:bg-darkSecondary"
              : "bg-gray-400 cursor-not-allowed"
              } text-white transition`}
            disabled={!selectedOption || !selectedDeckId}
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

function setSessionConfig(config: CreateStudySessionDto) {
  throw new Error("Function not implemented.");
}
