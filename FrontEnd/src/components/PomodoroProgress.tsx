interface PomodoroProgressProps {
    progress: any;
}

export const PomodoroProgress: React.FC<PomodoroProgressProps> = ({ progress }) => {
    if (!progress) return null;

    const cardsProgress = progress.totalCards > 0 ? (progress.uniqueCardsReviewed / progress.totalCards * 100) : 0;

    return (
        <div className="bg-darkComponent2 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Progreso de la Sesión</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {progress.uniqueCardsReviewed}
                    </div>
                    <div className="text-sm text-gray-400">Cartas Únicas</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                        {progress.reviewedCards}
                    </div>
                    <div className="text-sm text-gray-400">Total Revisadas</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                        {progress.studyTimeElapsed}m
                    </div>
                    <div className="text-sm text-gray-400">Tiempo Estudio</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                        {progress.breakTimeElapsed}m
                    </div>
                    <div className="text-sm text-gray-400">Tiempo Descanso</div>
                </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(cardsProgress, 100)}%` }}
                ></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-400">
                {progress.uniqueCardsReviewed} de {progress.totalCards} cartas únicas completadas
            </div>
            
            {/* Información adicional del ciclo */}
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-400">
                    Ciclo {progress.currentCycle} • 
                    {progress.isOnBreak ? ' En descanso' : ' Estudiando'} • 
                    Objetivo: {progress.cardsTarget} cartas
                </span>
            </div>
        </div>
    );
};