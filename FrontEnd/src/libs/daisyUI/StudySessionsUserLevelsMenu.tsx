interface StudySessionsUserLevelsMenuProps {
  onEvaluate: (evaluation: string) => Promise<void>;
}

const StudySessionsUserLevelsMenu: React.FC<StudySessionsUserLevelsMenuProps> = ({ onEvaluate }) => {
    const levels = [
        {
            id: 'dificil',
            label: 'Difícil',
            color: 'from-red-500 to-red-600',
            hoverColor: 'hover:from-red-600 hover:to-red-700',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        },
        {
            id: 'masomenos',
            label: 'Más o menos',
            color: 'from-orange-500 to-amber-500',
            hoverColor: 'hover:from-orange-600 hover:to-amber-600',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'bien',
            label: 'Bien',
            color: 'from-green-500 to-emerald-500',
            hoverColor: 'hover:from-green-600 hover:to-emerald-600',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        {
            id: 'facil',
            label: 'Fácil',
            color: 'from-blue-500 to-cyan-500',
            hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            {/* Título instructivo */}
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                    ¿Qué tan bien recordaste esta tarjeta?
                </h3>
            </div>

            {/* Botones de evaluación */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => onEvaluate(level.id)}
                        className={`group relative overflow-hidden bg-gradient-to-r ${level.color} ${level.hoverColor} 
                                  text-white px-6 py-4 rounded-xl font-medium shadow-lg 
                                  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                                  focus:outline-none focus:ring-4 focus:ring-white/30`}
                    >
                        {/* Efecto de brillo en hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        
                        {/* Contenido del botón */}
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="transform group-hover:scale-110 transition-transform duration-200">
                                {level.icon}
                            </div>
                            <span className="text-sm font-semibold">{level.label}</span>
                        </div>

                        {/* Indicador de selección activa */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/50 transform scale-x-0 
                                      group-hover:scale-x-100 transition-transform duration-300"></div>
                    </button>
                ))}
            </div>

            {/* Indicadores de nivel */}
            <div className="flex justify-between items-center mt-6 px-2">
                <div className="flex items-center gap-2 text-red-400">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">Difícil</span>
                </div>
                <div className="flex-1 mx-4">
                    <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 via-green-500 to-blue-500 rounded-full opacity-30"></div>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                    <span className="text-xs">Fácil</span>
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="text-center mt-4">
                <p className="text-gray-400 text-xs">
                    Difícil: La verás pronto • Fácil: La verás en más tiempo
                </p>
            </div>
        </div>
    );
}

export default StudySessionsUserLevelsMenu;