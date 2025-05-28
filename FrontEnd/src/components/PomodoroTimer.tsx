import { useState, useEffect } from 'react';

interface PomodoroTimerProps {
    status: any;
    onStartBreak: () => void;
    onEndBreak: () => void;
    isOnBreak: boolean;
    onTimerComplete?: () => void; // Nueva prop
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
    status,
    isOnBreak,
    onTimerComplete
}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
    const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false);

    // Actualizar cuando cambia el status del servidor
    useEffect(() => {
        if (status && status.timeRemaining !== undefined) {
            setTimeLeft(status.timeRemaining);
            setLastUpdateTime(Date.now());
            setHasTriggeredComplete(false); // Reset cuando se actualiza desde servidor
            console.log(`Timer updated from server: ${status.timeRemaining}s, phase: ${status.currentPhase}, isOnBreak: ${status.isOnBreak}`);
        }
    }, [status]);

    // Timer local que cuenta hacia abajo
    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const timeSinceLastUpdate = Math.floor((now - lastUpdateTime) / 1000);
            
            setTimeLeft(prev => {
                const newTime = Math.max(0, prev - 1);
                
                // Si llegó a 0 y no hemos disparado el evento aún
                if (newTime === 0 && !hasTriggeredComplete && onTimerComplete) {
                    console.log('Timer reached 0 - triggering completion check');
                    setHasTriggeredComplete(true);
                    // Disparar después de un pequeño delay para evitar conflictos
                    setTimeout(() => {
                        onTimerComplete();
                    }, 500);
                }
                
                if (timeSinceLastUpdate > 15) {
                    console.log('Timer local might be out of sync, will sync with next server update');
                }
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [lastUpdateTime, hasTriggeredComplete, onTimerComplete]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Usar el estado del servidor como prioridad, fallback a la prop
    const currentlyOnBreak = status?.isOnBreak !== undefined ? status.isOnBreak : isOnBreak;

    const getPhaseColor = () => {
        if (currentlyOnBreak) return 'text-green-400';
        return 'text-blue-400';
    };

    const isTimeUp = timeLeft <= 0;

    return (
        <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3">
            {/* Indicador de fase */}
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${currentlyOnBreak ? 'bg-green-400' : 'bg-blue-400'} ${isTimeUp ? 'animate-pulse' : ''}`}></div>
                <span className={`text-sm font-medium ${getPhaseColor()}`}>
                    {currentlyOnBreak ? 'Descanso' : 'Estudio'}
                </span>
            </div>

            {/* Separador */}
            <div className="w-px h-6 bg-white/20"></div>

            {/* Timer */}
            <div className={`text-2xl font-mono font-bold ${isTimeUp ? 'text-red-400 animate-pulse' : getPhaseColor()}`}>
                {formatTime(timeLeft)}
            </div>

            {/* Separador */}
            <div className="w-px h-6 bg-white/20"></div>

            {/* Ciclo */}
            <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm text-gray-300 font-medium">
                    {status?.currentCycle || 1}
                </span>
            </div>
        </div>
    );
};