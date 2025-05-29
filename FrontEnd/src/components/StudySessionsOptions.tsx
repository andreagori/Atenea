import { useState } from "react";
import SpotlightCard from "../libs/reactbits/SpotlightCard";
import { StudySessionsOptionsConfig_Regular, StudySessionsOptionsConfig_Pomodoro, StudySessionsOptionsConfig_SimulatedTests } from "../components/StudySessionsOptionsCofig";
import { CreateStudySessionDto } from "@/types/studySessions.types";

interface Props {
  selectedOption: string | null;
  setSelectedOption: (id: string) => void;
  deckId: number | null;
  disabled?: boolean;
  onConfigSave: (config: any) => void;
  hasCustomConfig?: boolean;
}

const options = [
  {
    id: "regular",
    title: "Memorización espaciada",
    description:
      "En esta sesión de estudio, puedes comenzar a estudiar a tu propio ritmo, utilizando memorización activa y repeticiones espaciadas.",
    background: "var(--color-darkSecondary)",
    accentColor: "#002FE1",
    lightAccent: "#002FE1"
  },
  {
    id: "pomodoro",
    title: "Pomodoro",
    description:
      "En esta sesión puedes estudiar utilizando la técnica Pomodoro: trabajar durante 25 minutos y tomar un descanso de 5 minutos.",
    background: "var(--color-darkPrimary2)",
    accentColor: "#002FE1",
    lightAccent: "#002FE1"
  },
  {
    id: "simuladas",
    title: "Pruebas simuladas",
    description:
      "En esta sesión puedes practicar con preguntas de opción múltiple. Puedes personalizar cantidad y tiempo.",
    background: "var(--color-darkComponent2)",
    accentColor: "#002FE1",
    lightAccent: "#002FE1"
  },
];

function StudySessionsOptions({ selectedOption, setSelectedOption, deckId, disabled, onConfigSave, hasCustomConfig }: Props) {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [modalOptionId, setModalOptionId] = useState<string | null>(null);

  const handleConfigSave = (config: CreateStudySessionDto) => {
    onConfigSave(config);
    setShowConfigModal(false);
  };

  const renderConfigModal = () => {
    if (!deckId) return null;

    switch (modalOptionId) {
      case "regular":
        return <StudySessionsOptionsConfig_Regular
          onClose={() => setShowConfigModal(false)}
          onSave={handleConfigSave}
          deckId={deckId}
        />
      case "pomodoro":
        return <StudySessionsOptionsConfig_Pomodoro 
        onClose={() => setShowConfigModal(false)} 
        onSave={handleConfigSave}
        deckId={deckId} />;
      case "simuladas":
        return <StudySessionsOptionsConfig_SimulatedTests 
        onClose={() => setShowConfigModal(false)} 
        onSave={handleConfigSave}
        deckId={deckId} />;
      default:
        return null;
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'regular':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'pomodoro':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'simuladas':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-11/12 flex flex-col gap-6 font-primary relative">
      {options.map(({ id, title, description, background, accentColor }) => {
        const isSelected = selectedOption === id;
        
        return (
          <div
            key={id}
            className={`relative group transition-all duration-300 ${
              isSelected 
                ? "transform scale-[1.02]" 
                : "hover:scale-[1.01]"
            }`}
            style={{
              filter: isSelected ? `drop-shadow(0 8px 25px ${accentColor}40)` : 'none'
            }}
          >
            {/* Badge de configuración personalizada */}
            {isSelected && hasCustomConfig && (
              <div className="absolute -top-3 -right-3 z-20">
                <div 
                  className="px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Personalizada
                  </div>
                </div>
              </div>
            )}

            {/* Botón de configuración */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled && deckId) {
                  setModalOptionId(id);
                  setShowConfigModal(true);
                }
              }}
              disabled={disabled || !deckId}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-lg transition-all duration-200 ${
                !disabled && deckId 
                  ? 'bg-white/10 hover:bg-white/20 hover:scale-110 backdrop-blur-sm border border-white/20' 
                  : 'cursor-not-allowed opacity-30'
              }`}
              title="Personalizar configuración"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Contenedor principal */}
            <div 
              onClick={() => !disabled && setSelectedOption(id)} 
              className={`cursor-${disabled ? 'not-allowed' : 'pointer'} relative overflow-hidden rounded-xl`}
            >
              <SpotlightCard
                className="w-full"
                enableSpotlight={false}
                backgroundColor={background}
                withBorder={true}
                borderColor={isSelected ? "#00D390" : "var(--color-darkAccent)"}
              >
                <div className="relative">
                  {/* Contenido */}
                  <div className="relative flex items-start gap-4 p-6 text-white">
                    {/* Icono temático */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'shadow-lg' 
                        : 'group-hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? '#00D390' : `${accentColor}40`,
                      color: 'white'
                    }}>
                      {getIcon(id)}
                    </div>
                    
                    {/* Contenido textual */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2 text-white">
                        {title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        );
      })}

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