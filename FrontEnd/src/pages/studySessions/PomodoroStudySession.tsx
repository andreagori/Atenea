import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavbarStudySession } from "@/components/Navbar";
import StudySessionsUserLevelsMenu from "@/libs/daisyUI/StudySessionsUserLevelsMenu";
import { useStudySession } from "@/hooks/useStudySessions";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { PomodoroProgress } from "@/components/PomodoroProgress";

interface CurrentCard {
    cardId: number;
    title: string;
    learningMethod: string;
    activeRecall?: {
        answer: string;
        questionTitle: string;
    };
    cornell?: {
        principalNote: string;
        noteQuestions: string;
        shortNote: string;
    };
    visualCard?: {
        urlImage: string;
    };
}

const PomodoroStudySession = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const {
        getPomodoroNextCard,
        evaluatePomodoroCard,
        finishSession,
        getPomodoroStatus,
        getPomodoroProgress,
        startPomodoroBreak,
        endPomodoroBreak,
    } = useStudySession();

    const [currentCard, setCurrentCard] = useState<CurrentCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [pomodoroStatus, setPomodoroStatus] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // Cargar estado inicial
    useEffect(() => {
        if (sessionId) {
            loadInitialData();;
        }
    }, [sessionId]);

    const loadInitialData = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);

            // Cargar estado y progreso
            const [status, progressData] = await Promise.all([
                getPomodoroStatus(sessionIdNum),
                getPomodoroProgress(sessionIdNum)
            ]);

            
            setPomodoroStatus(status);
            setProgress(progressData);
            setIsOnBreak(status.isOnBreak);

            // Si no está en descanso, cargar la siguiente carta
            if (!status.isOnBreak) {
                await loadNextCard();
            } else {
                // Si ya está en descanso, limpiar carta
                setCurrentCard(null);
                setShowAnswer(false);
            }
        } catch (err) {
            console.error('Error loading initial data:', err);
        }
    };

    const checkPomodoroStatus = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            const [status, progressData] = await Promise.all([
                getPomodoroStatus(sessionIdNum),
                getPomodoroProgress(sessionIdNum)
            ]);

            console.log('Status check:', {
                oldBreak: isOnBreak,
                newBreak: status.isOnBreak,
                timeRemaining: status.timeRemaining,
                currentPhase: status.currentPhase
            });

            setPomodoroStatus(status);
            setProgress(progressData);

            // Si cambió el estado de descanso
            if (status.isOnBreak !== isOnBreak) {
                console.log(`Break state changed: ${isOnBreak} -> ${status.isOnBreak}`);
                setIsOnBreak(status.isOnBreak);

                if (status.isOnBreak) {
                    // Entró en descanso - limpiar la tarjeta actual
                    console.log('Entering break mode - clearing current card');
                    setCurrentCard(null);
                    setShowAnswer(false);
                } else {
                    // Salió del descanso - cargar nueva carta
                    console.log('Exiting break mode - loading next card');
                    await loadNextCard();
                }
            }

        } catch (err) {
            console.error('Error checking status:', err);
        }
    };

    // Función para forzar verificación cuando el timer llegue a 0
    const handleTimerComplete = async () => {
        console.log('Timer completed - forcing status check');
        await checkPomodoroStatus();
    };

    const loadNextCard = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            const card = await getPomodoroNextCard(sessionIdNum);

            if (!card) {
                console.warn('No card received');
                // Verificar si está en descanso
                const status = await getPomodoroStatus(sessionIdNum);
                if (status.isOnBreak) {
                    console.log('No card because session is on break');
                    setIsOnBreak(true);
                    setCurrentCard(null);
                    setPomodoroStatus(status);
                } else {
                    console.log('No more cards - session might be complete');
                    setIsSessionComplete(true);
                }
                return;
            }

            console.log('Loaded card:', card);
            setCurrentCard(card);
            setShowAnswer(false);

        } catch (err: any) {
            console.error('Error loading next card:', err);

            if (err.message?.includes('está en descanso') || err.message?.includes('Tiempo de estudio completado')) {
                console.log('Session entered break mode due to time completion');
                setIsOnBreak(true);
                setCurrentCard(null);
                setShowAnswer(false);

                // Actualizar el estado desde el servidor
                try {
                    const status = await getPomodoroStatus(parseInt(sessionId!));
                    setPomodoroStatus(status);
                    console.log('Updated status after break:', status);
                } catch (statusErr) {
                    console.error('Error updating status:', statusErr);
                }
            } else {
                console.error('Unexpected error loading card:', err);
            }
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleEvaluate = async (evaluation: string) => {
        if (!currentCard || !sessionId) return;

        try {
            const sessionIdNum = parseInt(sessionId);

            console.log('Evaluating card:', currentCard.cardId, 'with evaluation:', evaluation);

            await evaluatePomodoroCard(sessionIdNum, currentCard.cardId, evaluation);

            // Actualizar progreso
            const progressData = await getPomodoroProgress(sessionIdNum);
            setProgress(progressData);

            // Verificar estado antes de cargar siguiente carta
            const status = await getPomodoroStatus(sessionIdNum);
            setPomodoroStatus(status);

            if (status.isOnBreak) {
                console.log('Session entered break after evaluation');
                setIsOnBreak(true);
                setCurrentCard(null);
                setShowAnswer(false);
            } else {
                // Cargar siguiente carta solo si no está en descanso
                await loadNextCard();
            }

        } catch (err: any) {
            console.error('Error evaluating card:', err);

            if (err.message?.includes('está en descanso') || err.message?.includes('Tiempo de estudio completado')) {
                console.log('Entered break mode after evaluation');
                setIsOnBreak(true);
                setCurrentCard(null);
                setShowAnswer(false);

                try {
                    const status = await getPomodoroStatus(parseInt(sessionId!));
                    setPomodoroStatus(status);
                } catch (statusErr) {
                    console.error('Error updating status after evaluation:', statusErr);
                }
            }
        }
    };

    const handleStartBreak = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            await startPomodoroBreak(sessionIdNum);
            setIsOnBreak(true);
            setCurrentCard(null);
            setShowAnswer(false);

            // Actualizar estado
            const status = await getPomodoroStatus(sessionIdNum);
            setPomodoroStatus(status);
        } catch (err) {
            console.error('Error starting break:', err);
        }
    };

    const handleEndBreak = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            await endPomodoroBreak(sessionIdNum);
            setIsOnBreak(false);

            // Actualizar estado y cargar nueva carta
            const status = await getPomodoroStatus(sessionIdNum);
            setPomodoroStatus(status);
            await loadNextCard();
        } catch (err) {
            console.error('Error ending break:', err);
        }
    };

    const handleFinishSession = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            await finishSession(sessionIdNum);
            navigate('/sesionesEstudio');
        } catch (err) {
            console.error('Error finishing session:', err);
        }
    };

    const renderCardContent = () => {
        if (!currentCard) return null;

        switch (currentCard.learningMethod) {
            case 'activerecall':
                return (
                    <div className="text-center max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">
                            {currentCard.activeRecall?.questionTitle || currentCard.title}
                        </h2>
                        {showAnswer && (
                            <div className="mt-6 p-4 bg-darkComponent2 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2">Respuesta:</h3>
                                <p className="text-lg">{currentCard.activeRecall?.answer}</p>
                            </div>
                        )}
                    </div>
                );

            case 'cornell':
                return (
                    <div className="text-center max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">{currentCard.title}</h2>
                        {showAnswer && currentCard.cornell && (
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-darkComponent2 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Nota Principal:</h3>
                                    <p>{currentCard.cornell.principalNote}</p>
                                </div>
                                <div className="p-4 bg-darkComponent2 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Preguntas:</h3>
                                    <p>{currentCard.cornell.noteQuestions}</p>
                                </div>
                                <div className="p-4 bg-darkComponent2 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">Resumen:</h3>
                                    <p>{currentCard.cornell.shortNote}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'visualcard':
                return (
                    <div className="text-center max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">{currentCard.title}</h2>
                        {showAnswer && currentCard.visualCard && (
                            <div className="mt-6">
                                <img
                                    src={currentCard.visualCard.urlImage}
                                    alt={currentCard.title}
                                    className="max-w-full h-auto rounded-lg mx-auto"
                                />
                            </div>
                        )}
                    </div>
                );

            default:
                return <p>Tipo de carta no soportado</p>;
        }
    };

    if (isSessionComplete) {
        return (
            <div className="font-primary scroll-smooth scrollbar-hide bg-gradient-to-b from-darkBackground via-darkGradientBlueText to-darkPrimary text-white">
                <NavbarStudySession sessionType="pomodoro" />
                <div className="w-full min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
                    <h1 className="text-4xl font-bold text-center mb-10">
                        ¡Sesión Completada!
                    </h1>
                    <p className="text-xl mb-6">Has terminado tu sesión de estudio Pomodoro</p>
                    <button
                        onClick={handleFinishSession}
                        className="btn btn-primary"
                    >
                        Finalizar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="font-primary scroll-smooth scrollbar-hide text-white"
            style={{
                background: "radial-gradient(ellipse at bottom, #1e3a8a 0%, #1e1b4b 40%, #000000 100%)"
            }}>
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                {/* Progress and Timer */}
                <div className="w-full px-4 mt-18">
                    <PomodoroTimer
                        status={pomodoroStatus}
                        onStartBreak={handleStartBreak}
                        onEndBreak={handleEndBreak}
                        isOnBreak={isOnBreak}
                        onTimerComplete={handleTimerComplete}
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center mt-5">
                    {isOnBreak ? (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-6">¡Tiempo de Descanso!</h1>
                            <p className="text-xl mb-8">Relájate por unos minutos</p>
                            <button
                                onClick={handleEndBreak}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                                Finalizar Descanso
                            </button>
                        </div>
                    ) : currentCard ? (
                        <>
                            {renderCardContent()}

                            <div className="flex flex-col items-center mt-15 mb-5">
                                {!showAnswer ? (
                                    <button
                                        onClick={handleShowAnswer}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                    >
                                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Mostrar respuesta
                                    </button>
                                ) : (
                                    <div className="mt-8">
                                        <StudySessionsUserLevelsMenu onEvaluate={handleEvaluate} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-6">Cargando...</h1>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex justify-center">
                    <button
                        onClick={handleFinishSession}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Finalizar Sesión
                    </button>
                </div>
                <div className="w-full px-4 mt-4">
                    <PomodoroProgress progress={progress} />
                </div>
            </div>
        </div>
    );
};

export default PomodoroStudySession;