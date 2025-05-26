import { useState, useEffect } from 'react';

interface PomodoroTimerProps {
    status: any;
    onStartBreak: () => void;
    onEndBreak: () => void;
    isOnBreak: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
    status,
    onStartBreak,
    onEndBreak,
    isOnBreak
}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

    // Actualizar cuando cambia el status del servidor
    useEffect(() => {
        if (status && status.timeRemaining !== undefined) {
            // timeRemaining ahora viene en segundos desde el backend
            setTimeLeft(status.timeRemaining);
            setLastUpdateTime(Date.now());
            console.log(`Timer updated from server: ${status.timeRemaining}s, phase: ${status.currentPhase}`);
        }
    }, [status]);

    // Timer local que cuenta hacia abajo
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const timeSinceLastUpdate = Math.floor((now - lastUpdateTime) / 1000);
            
            setTimeLeft(prev => {
                const newTime = Math.max(0, prev - 1);
                
                // Si han pasado más de 15 segundos desde la última actualización del servidor,
                // no confiar tanto en el timer local
                if (timeSinceLastUpdate > 15) {
                    console.log('Timer local might be out of sync, will sync with next server update');
                }
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [lastUpdateTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getPhaseText = () => {
        if (isOnBreak) return 'Descanso';
        return 'Estudio';
    };

    const getPhaseColor = () => {
        if (isOnBreak) return 'text-green-400';
        return 'text-blue-400';
    };

    const isTimeUp = timeLeft <= 0;

    return (
        <div className="bg-darkComponent2 rounded-lg p-6 text-center mb-6">
            <h3 className={`text-2xl font-bold mb-4 ${getPhaseColor()}`}>
                {getPhaseText()} - Ciclo {status?.currentCycle || 1}
            </h3>
            <div className={`text-6xl font-mono font-bold mb-4 ${isTimeUp ? 'text-red-400 animate-pulse' : getPhaseColor()}`}>
                {formatTime(timeLeft)}
            </div>
            <div className="flex gap-4 justify-center">
                {!isOnBreak && isTimeUp && (
                    <button 
                        onClick={onStartBreak}
                        className="btn btn-success animate-pulse"
                    >
                        ¡Tiempo de Descanso!
                    </button>
                )}
                {!isOnBreak && !isTimeUp && (
                    <button 
                        onClick={onStartBreak}
                        className="btn btn-outline btn-sm"
                    >
                        Iniciar Descanso Anticipado
                    </button>
                )}
                {isOnBreak && (
                    <div className="flex gap-2">
                        <button 
                            onClick={onEndBreak}
                            className="btn btn-primary"
                        >
                            Continuar Estudiando
                        </button>
                        {isTimeUp && (
                            <span className="text-green-400 font-semibold animate-pulse">
                                ¡Descanso completado!
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-4 text-sm text-gray-400">
                Objetivo: {status?.studyDuration || 25}min estudio / {status?.breakDuration || 5}min descanso
            </div>
            
            {/* Debug info - remover en producción */}
            <div className="mt-2 text-xs text-gray-500">
                Debug: Server time: {status?.timeRemaining}s | Local: {timeLeft}s | Phase: {status?.currentPhase}
            </div>
        </div>
    );
};