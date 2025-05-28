import { useStudySession } from "@/hooks/useStudySessions";
import { useState } from "react";
import { ButtonCustom } from "./Buttons";
import { CreateStudySessionDto, LearningMethod, StudyMethod } from "@/types/studySessions.types";
import { X, Clock, Target, BookOpen, Eye, FileText, Brain } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  onSave: (config: CreateStudySessionDto) => void;
  deckId: number;
}

const LearningMethodSelector = ({
  selectedMethods,
  setSelectedMethods
}: {
  selectedMethods: LearningMethod[],
  setSelectedMethods: (methods: LearningMethod[]) => void
}) => {
  const allMethods = [
    { value: LearningMethod.ACTIVE_RECALL, label: 'Repaso Activo', icon: Brain },
    { value: LearningMethod.CORNELL, label: 'Método Cornell', icon: FileText },
    { value: LearningMethod.VISUAL_CARD, label: 'Cartas Visuales', icon: Eye }
  ];

  const toggleMethod = (method: LearningMethod) => {
    if (selectedMethods.includes(method)) {
      setSelectedMethods(selectedMethods.filter(m => m !== method));
    } else {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  const toggleAll = () => {
    if (selectedMethods.length === allMethods.length) {
      setSelectedMethods([]);
    } else {
      setSelectedMethods(allMethods.map(m => m.value));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white">Tipos de cartas a estudiar:</label>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
        >
          {selectedMethods.length === allMethods.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>

      <div className="grid gap-2">
        {allMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethods.includes(method.value);

          return (
            <button
              key={method.value}
              type="button"
              onClick={() => toggleMethod(method.value)}
              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${
                isSelected ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                <Icon className="w-3 h-3" />
              </div>
              <span className="font-medium text-sm">{method.label}</span>
              {isSelected && (
                <div className="ml-auto w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export function StudySessionsOptionsConfig_Regular({ onClose, onSave }: ModalProps) {
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
      numCardsSpaced: numCards ? parseInt(numCards) : -1
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
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-gradient-to-br from-darkSecondary to-darkPrimary rounded-xl shadow-2xl w-full max-w-sm border border-purple-500/20 transform transition-all duration-300 ease-out">

        {/* Header más pequeño */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sesión Regular</h2>
              <p className="text-purple-100 text-xs">Repetición espaciada</p>
            </div>
          </div>
        </div>

        {/* Content más compacto */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Number of cards */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <Target className="w-4 h-4 text-purple-400" />
              Número de cartas a revisar:
            </label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
              type="number"
              value={numCards}
              onChange={(e) => setNumCards(e.target.value)}
              placeholder="Número entre 1 y 99"
              min="1"
              max="99"
              required
            />
          </div>

          {/* Learning methods selector */}
          <LearningMethodSelector
            selectedMethods={selectedMethods}
            setSelectedMethods={setSelectedMethods}
          />

          {/* Error message */}
          {(validateError || error) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validateError || error}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-3 pt-2">
            <ButtonCustom
              type="button"
              text="Cerrar"
              onClick={onClose}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#FF2F2F', '#650707']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#FF2F2F"
              width="90px"
              height="36px"
              fontSize="13px"
            />
            <ButtonCustom
              type="submit"
              text={loading ? "Guardando..." : "Guardar"}
              disabled={loading}
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="110px"
              height="36px"
              fontSize="13px"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export function StudySessionsOptionsConfig_Pomodoro({ onClose, onSave }: ModalProps) {
  const [numCards, setNumCards] = useState('');
  const [studyMinutes, setStudyMinutes] = useState('');
  const [restMinutes, setRestMinutes] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<LearningMethod[]>([]);
  const [validateError, setValidateError] = useState('');
  const { error, loading } = useStudySession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidateError('');

    if (!numCards || !studyMinutes || !restMinutes || selectedMethods.length === 0) {
      setValidateError('Por favor completa todos los campos');
      return;
    }

    const config: CreateStudySessionDto = {
      studyMethod: StudyMethod.POMODORO,
      learningMethod: selectedMethods,
      numCards: numCards ? parseInt(numCards) : -1,
      studyMinutes: studyMinutes ? parseInt(studyMinutes) : 25,
      restMinutes: restMinutes ? parseInt(restMinutes) : 5
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
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-gradient-to-br from-darkPrimary2 to-darkSecondary rounded-xl shadow-2xl w-full max-w-sm border border-red-500/20 transform transition-all duration-300 ease-out">

        {/* Header más pequeño */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-xl p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sesión Pomodoro</h2>
              <p className="text-orange-100 text-xs">Técnica de concentración</p>
            </div>
          </div>
        </div>

        {/* Content más compacto */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">

          {/* Number of cards */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <Target className="w-4 h-4 text-red-400" />
              Número de cartas:
            </label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 placeholder-gray-400"
              type="number"
              value={numCards}
              onChange={(e) => setNumCards(e.target.value)}
              placeholder="Entre 1 y 99"
              min="1"
              max="99"
              required
            />
          </div>

          {/* Study and rest minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-white">
                <BookOpen className="w-3 h-3 text-green-400" />
                Estudio (min):
              </label>
              <input
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                type="number"
                value={studyMinutes}
                onChange={(e) => setStudyMinutes(e.target.value)}
                placeholder="1-60"
                min="1"
                max="60"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-white">
                <Clock className="w-3 h-3 text-blue-400" />
                Descanso (min):
              </label>
              <input
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                type="number"
                value={restMinutes}
                onChange={(e) => setRestMinutes(e.target.value)}
                placeholder="1-60"
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          {/* Learning methods selector */}
          <LearningMethodSelector
            selectedMethods={selectedMethods}
            setSelectedMethods={setSelectedMethods}
          />

          {/* Error message */}
          {(validateError || error) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validateError || error}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-3 pt-2">
            <ButtonCustom
              type="button"
              text="Cerrar"
              onClick={onClose}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#FF2F2F', '#650707']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#FF2F2F"
              width="90px"
              height="36px"
              fontSize="13px"
            />
            <ButtonCustom
              type="submit"
              text={loading ? "Guardando..." : "Guardar"}
              disabled={loading}
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="110px"
              height="36px"
              fontSize="13px"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export function StudySessionsOptionsConfig_SimulatedTests({ onClose, onSave }: ModalProps) {
  const [numQuestions, setNumQuestions] = useState('');
  const [testDuration, setTestDuration] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<LearningMethod[]>([]);
  const [validateError, setValidateError] = useState('');
  const { error, loading } = useStudySession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidateError('');

    if (!numQuestions || !testDuration || selectedMethods.length === 0) {
      setValidateError('Por favor completa todos los campos');
      return;
    }

    const config: CreateStudySessionDto = {
      studyMethod: StudyMethod.SIMULATED_TEST,
      learningMethod: selectedMethods,
      numQuestions: numQuestions ? parseInt(numQuestions) : -1,
      testDurationMinutes: testDuration ? parseInt(testDuration) : 15
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
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-gradient-to-br from-darkComponent2 to-darkPrimary rounded-xl shadow-2xl w-full max-w-sm border border-green-500/20 transform transition-all duration-300 ease-out">

        {/* Header más pequeño */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-xl p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Prueba Simulada</h2>
              <p className="text-green-100 text-xs">Evaluación cronometrada</p>
            </div>
          </div>
        </div>

        {/* Content más compacto */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Number of questions and duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-white">
                <Target className="w-3 h-3 text-green-400" />
                Preguntas:
              </label>
              <input
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                placeholder="1-40"
                min="1"
                max="40"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-white">
                <Clock className="w-3 h-3 text-blue-400" />
                Tiempo (min):
              </label>
              <input
                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                type="number"
                value={testDuration}
                onChange={(e) => setTestDuration(e.target.value)}
                placeholder="1-60"
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          {/* Learning methods selector */}
          <LearningMethodSelector
            selectedMethods={selectedMethods}
            setSelectedMethods={setSelectedMethods}
          />

          {/* Error message */}
          {(validateError || error) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {validateError || error}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-3 pt-2">
            <ButtonCustom
              type="button"
              text="Cerrar"
              onClick={onClose}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#FF2F2F', '#650707']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#FF2F2F"
              width="90px"
              height="36px"
              fontSize="13px"
            />
            <ButtonCustom
              type="submit"
              text={loading ? "Guardando..." : "Guardar"}
              disabled={loading}
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="110px"
              height="36px"
              fontSize="13px"
            />
          </div>
        </form>
      </div>
    </div>
  );
}