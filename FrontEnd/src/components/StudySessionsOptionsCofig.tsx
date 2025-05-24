import { useStudySession } from "@/hooks/useStudySessions";
import { useState } from "react";
import { ButtonCustom } from "./Buttons";
import { CreateStudySessionDto, LearningMethod, StudyMethod } from "@/types/studySessions.types";

interface ModalProps {
  onClose: () => void;
  onSave: (config: CreateStudySessionDto) => void;
  deckId: number;
}

export function StudySessionsOptionsConfig_Regular({ onClose, onSave, deckId }: ModalProps) {
  const [numCards, setNumCards] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<LearningMethod[]>([]);
  const [validateError, setValidateError] = useState('');
  const { error, loading } = useStudySession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidateError('');

    if (!numCards || selectedMethods.length === 0) {
      setValidateError('Por favor completa todos los campos');
      return;
    }

    const config: CreateStudySessionDto = {
      studyMethod: StudyMethod.SPACED_REPETITION,
      learningMethod: selectedMethods,
      numCardsSpaced: parseInt(numCards)
    };

    try {
      onSave(config);
      onClose();
    } catch (err) {
      console.error(err);
      setValidateError('Error al guardar la configuración');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkSecondary p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-white">
          Configura tu sesión regular de estudio:
        </h2>
        <form name="config" onSubmit={handleSubmit}>
          <p className="mt-4 text-white">Ingresa el número de cartas a revisar en la sesión: </p>
          <input
            className="input-primary input validator mt-2 w-full bg-white"
            type="number"
            value={numCards}
            onChange={(e) => setNumCards(e.target.value)}
            placeholder="Debe ser un número entre 1 y 99"
            min="1"
            max="99"
            required
          />

          <p className="mt-4 text-white">Selecciona el tipo de cartas que deseas estudiar:</p>
          <select
            multiple
            value={selectedMethods}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions).map(
              option => option.value as LearningMethod);
              setSelectedMethods(options);
            }}
            required
            className="select select-m select-primary w-full bg-white mt-2 text-black/50">
            <option disabled={true}>Tipo de cartas</option>
            <option value={LearningMethod.ACTIVE_RECALL}>Repaso Activo</option>
            <option value={LearningMethod.CORNELL}>Método de cornell</option>
            <option value={LearningMethod.VISUAL_CARD}>Cartas visuales</option>
          </select>

          {(validateError || error) && (
            <p className="text-red-500 mt-2">
              {validateError || error}
            </p>
          )}

          {/* Buttons Form */}
          <div className="flex justify-between mt-4">
            <ButtonCustom
              type="button"
              text="Cerrar"
              onClick={() => { onClose() }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#FF2F2F', '#650707']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#FF2F2F"
              width="80px"
              height="35px"
            />
            <ButtonCustom
              type="submit"
              text="Guardar"
              disabled={loading}
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="80px"
              height="35px"
            />
          </div>
        </form>
      </div>
    </div >
  );
}

export function StudySessionsOptionsConfig_Pomodoro({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkPrimary2 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-white">
          Configura tu sesión pomodoro de estudio:
        </h2>
        <p className="mt-4 text-white">Ingresa el número de cartas a revisar en la sesión: </p>
        <input
          className="input-primary input validator mt-2 w-full bg-white"
          type="number"
          placeholder="Debe ser un número entre 1 y 99"
          min="1"
          max="99"
        />
        <p className="mt-4 text-white">Ingresa el número de minutos de estudio en la sesión: </p>
        <input
          className="input-primary input validator mt-2 w-full bg-white"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />
        <p className="mt-4 text-white">Ingresa el número de minutos de descanso en la sesión: </p>
        <input
          className="input-primary input validator mt-2 w-full bg-white"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />

        {/* Settings Form */}
        <p className="mt-4 text-white">Selecciona el tipo de cartas que deseas estudiar:</p>
        <select
          defaultValue="Tipo de cartas"
          className="select select-m select-primary w-full bg-white mt-3 text-black/50">
          <option disabled={true}>Tipo de cartas</option>
          <option>Repaso Activo</option>
          <option>Método de cornell</option>
          <option>Cartas visuales</option>
          <option>Todas las anteriores</option>
        </select>

        {/* Buttons Form */}
        <div className="flex justify-between mt-4">
          <ButtonCustom
            type="button"
            text="Cerrar"
            onClick={() => { onClose() }}
            isGradient={true}
            gradientDirection="to bottom"
            gradientColors={['#FF2F2F', '#650707']}
            color="#fff"
            hoverColor="#fff"
            hoverBackground="#FF2F2F"
            width="80px"
            height="35px"
          />
          <ButtonCustom
            type="button"
            text="Guardar"
            onClick={() => { onClose() }}
            isGradient={true}
            gradientDirection="to bottom"
            gradientColors={['#0C3BEB', '#1A368B']}
            color="#fff"
            hoverColor="#fff"
            hoverBackground="#0C3BEB"
            width="80px"
            height="35px"
          />
        </div>
      </div>
    </div>
  );
}

export function StudySessionsOptionsConfig_SimulatedTests({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkComponent2 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-white">
          Configura tu sesión regular de estudio:
        </h2>
        <p className="mt-4 text-white">Ingresa el número de preguntas a revisar en la sesión: </p>
        <input
          className="input-primary input validator mt-2 w-full bg-white"
          type="number"
          placeholder="Debe ser un número entre 1 y 40"
          min="1"
          max="40"
        />
        <p className="mt-4 text-white">Ingresa el tiempo de la prueba: </p>
        <input
          className="input-primary input validator mt-2 w-full bg-white"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />

        {/* Settings Form */}
        <p className="mt-4 text-white">Selecciona el tipo de cartas que deseas estudiar:</p>
        <select
          defaultValue="Tipo de cartas"
          className="select select-m select-primary w-full bg-white mt-2 text-black/50">
          <option disabled={true}>Tipo de cartas</option>
          <option>Repaso Activo</option>
          <option>Método de cornell</option>
          <option>Cartas visuales</option>
          <option>Todas las anteriores</option>
        </select>

        {/* Buttons Form */}
        <div className="flex justify-between mt-4">
          <ButtonCustom
            type="button"
            text="Cerrar"
            onClick={() => { onClose() }}
            isGradient={true}
            gradientDirection="to bottom"
            gradientColors={['#FF2F2F', '#650707']}
            color="#fff"
            hoverColor="#fff"
            hoverBackground="#FF2F2F"
            width="80px"
            height="35px"
          />
          <ButtonCustom
            type="button"
            text="Guardar"
            onClick={() => { onClose() }}
            isGradient={true}
            gradientDirection="to bottom"
            gradientColors={['#0C3BEB', '#1A368B']}
            color="#fff"
            hoverColor="#fff"
            hoverBackground="#0C3BEB"
            width="80px"
            height="35px"
          />
        </div>
      </div>
    </div>
  );
}