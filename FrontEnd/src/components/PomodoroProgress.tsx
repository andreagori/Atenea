interface PomodoroProgressProps {
    progress: any;
}

export const PomodoroProgress: React.FC<PomodoroProgressProps> = ({ progress }) => {
    if (!progress) return null;

    const cardsProgress = progress.totalCards > 0 ? (progress.uniqueCardsReviewed / progress.totalCards * 100) : 0;

    return (
        <div className="bg-white/12 backdrop-blur-sm border border-white/40 rounded-xl p-4 mb-4">
            {/* Header compacto */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Progreso</h3>
                <span className="text-xs text-gray-400">
                    Ciclo {progress.currentCycle} • {progress.isOnBreak ? 'Descanso' : 'Estudio'}
                </span>
            </div>
            
            {/* Estadísticas en una fila */}
            <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-blue-400">{progress.uniqueCardsReviewed}</div>
                    <div className="text-xs text-gray-400">únicas</div>
                </div>
                
                <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-green-400">{progress.reviewedCards}</div>
                    <div className="text-xs text-gray-400">total</div>
                </div>
                
                <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-purple-400">{progress.studyTimeElapsed}m</div>
                    <div className="text-xs text-gray-400">estudio</div>
                </div>
                
                <div className="flex items-center gap-1">
                    <div className="text-lg font-bold text-orange-400">{progress.breakTimeElapsed}m</div>
                    <div className="text-xs text-gray-400">descanso</div>
                </div>
            </div>

            {/* Barra de progreso compacta */}
            <div className="flex items-center gap-3">
                <div className="flex-1 bg-darkComponent2 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(cardsProgress, 100)}%` }}
                    ></div>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    {progress.uniqueCardsReviewed}/{progress.totalCards}
                </span>
            </div>
        </div>
    );
};