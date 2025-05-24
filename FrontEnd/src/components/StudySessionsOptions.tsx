import { useState } from "react";
import SpotlightCard from "../libs/reactbits/SpotlightCard";
import { StudySessionsOptionsConfig_Regular, StudySessionsOptionsConfig_Pomodoro, StudySessionsOptionsConfig_SimulatedTests } from "../components/StudySessionsOptionsCofig";

interface Props {
  selectedOption: string | null;
  setSelectedOption: (id: string) => void;
  deckId: number | null;
  disabled?: boolean;
}

const options = [
  {
    id: "regular",
    title: "Memorización espaciada",
    description:
      "En esta sesión de estudio, puedes comenzar a estudiar a tu propio ritmo, utilizando memorización activa y repeticiones espaciadas.",
    background: "var(--color-darkSecondary)",
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    description:
      "En esta sesión puedes estudiar utilizando la técnica Pomodoro: trabajar durante 25 minutos y tomar un descanso de 5 minutos.",
    background: "var(--color-darkPrimary2)",
  },
  {
    id: "simuladas",
    title: "Pruebas simuladas",
    description:
      "En esta sesión puedes practicar con preguntas de opción múltiple y de verdadero o falso. Puedes personalizar cantidad y tiempo.",
    background: "var(--color-darkComponent2)",
  },
];

function StudySessionsOptions({ selectedOption, setSelectedOption, deckId, disabled }: Props) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [modalOptionId, setModalOptionId] = useState<string | null>(null);

  const renderConfigModal = () => {
    if (!deckId) return null;

    switch (modalOptionId) {
      case "regular":
        return <StudySessionsOptionsConfig_Regular onClose={() => setShowConfigModal(false)} deckId={deckId} />;
      case "pomodoro":
        return <StudySessionsOptionsConfig_Pomodoro onClose={() => setShowConfigModal(false)} deckId={deckId} />;
      case "simuladas":
        return <StudySessionsOptionsConfig_SimulatedTests onClose={() => setShowConfigModal(false)} deckId={deckId} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-11/12 min-h-full flex flex-col gap-4 font-primary px-4 relative">
      {options.map(({ id, title, description, background }) => (
        <div
          key={id}
          className={`relative rounded-xl transition-all duration-300 ${selectedOption === id ? "ring-4 ring-darkAccent scale-[1.01]" : ""
            }`}
        >
          {/* Ícono de Configuración */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled && deckId) {
                setModalOptionId(id);
                setShowConfigModal(true);
              }
            }}
            disabled={disabled || !deckId}
            className={`absolute top-6 right-6 z-10 text-lg ${!disabled && deckId ? 'hover:scale-110' : 'cursor-not-allowed opacity-50'
              } transition-transform duration-200`}
          >
            <img
              src="/src/assets/settingsIcon.svg"
              alt="Configurar"
              className="w-6 h-6"
            />
          </button>

          <div onClick={() => !disabled && setSelectedOption(id)} className={`cursor-${disabled ? 'not-allowed' : 'pointer'}`}>
            <SpotlightCard
              className="w-full"
              enableSpotlight={false}
              backgroundColor={background}
              withBorder={true}
              borderColor="var(--color-darkAccent)"
            >
              <div className="flex flex-col p-2 text-white">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="mt-2 text-m">{description}</p>
              </div>
            </SpotlightCard>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showConfigModal && deckId && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {renderConfigModal()}
        </div>
      )}
    </div>
  );
}

export default StudySessionsOptions;
