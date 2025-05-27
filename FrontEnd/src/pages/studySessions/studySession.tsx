import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavbarLoginIn } from "../../components/Navbar";
import SelectDecksStudySession from "../../libs/daisyUI/SelectDecksStudySession";
import StudySessionsOptions from "../../components/StudySessionsOptions";
import { useStudySession } from "@/hooks/useStudySessions";
import { useStudySessionDefaults } from "@/hooks/useStudySessionsDefaults";
import { CreateStudySessionDto } from "@/types/studySessions.types";

function sesionEstudio() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [sessionConfig, setSessionConfig] = useState<CreateStudySessionDto | null>(null);
  const [searchParams] = useSearchParams();
  const { createStudySession } = useStudySession();
  const defaultConfig = useStudySessionDefaults(selectedOption);
  const navigate = useNavigate();

  // Preseleccionar mazo si viene del botón "Estudiar"
  useEffect(() => {
    const deckIdFromUrl = searchParams.get('deckId');
    if (deckIdFromUrl) {
      setSelectedDeckId(parseInt(deckIdFromUrl));
    }
  }, [searchParams]);

  const handleConfigSave = (config: CreateStudySessionDto) => {
    setSessionConfig(config);
  };

  const handleStart = async () => {
    if (!selectedOption || !selectedDeckId) {
      alert("Por favor selecciona un mazo y un tipo de sesión antes de comenzar.");
      return;
    }

    try {
      // Use custom config if available, otherwise use default
      const configToUse = sessionConfig || defaultConfig;

      if (!configToUse) {
        throw new Error('No se pudo obtener la configuración');
      }

      console.log('Using configuration:', configToUse);
      
      const response = await createStudySession(selectedDeckId, configToUse);

      if (response && response.sessionId) {
        const path = `/sesionesEstudio/${selectedOption}/${response.sessionId}`;
        navigate(path, { replace: true });
      }
    } catch (err) {
      console.error('Error creating study session:', err);
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
        <h1 className="text-6xl text-lightComponent mt-10 mb-8 text-center font-bold">
          Sesión de <br /> estudio
        </h1>
        <p className="text-2xl mt-2 mb-2 text-lightComponent">
          Selecciona el mazo a estudiar:
        </p>
        <SelectDecksStudySession 
          onDeckSelect={setSelectedDeckId}
          preselectedDeckId={selectedDeckId} // Pasar el mazo preseleccionado
        />
        <p className="text-2xl mt-10 text-lightComponent">
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