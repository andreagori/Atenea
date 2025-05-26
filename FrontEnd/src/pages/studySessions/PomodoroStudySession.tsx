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
            loadInitialData();
            const interval = setInterval(checkPomodoroStatus, 5000); // Check every 30 seconds
            return () => clearInterval(interval);
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

            console.log('Status update:', status);
            setPomodoroStatus(status);
            setProgress(progressData);

            // Si cambió el estado de descanso
            if (status.isOnBreak !== isOnBreak) {
                console.log(`Break state changed: ${isOnBreak} -> ${status.isOnBreak}`);
                setIsOnBreak(status.isOnBreak);
                if (!status.isOnBreak) {
                    // Si salió del descanso, cargar nueva carta
                    await loadNextCard();
                }
            }
        } catch (err) {
            console.error('Error checking status:', err);
        }
    };

    const loadNextCard = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            const card = await getPomodoroNextCard(sessionIdNum);

            if (!card) {
                // En Pomodoro, esto no debería suceder a menos que haya un error
                console.warn('No card received, but Pomodoro should continue until break time');
                setIsSessionComplete(true);
                return;
            }

            setCurrentCard(card);
            setShowAnswer(false);
        } catch (err: any) {
            if (err.message?.includes('está en descanso')) {
                setIsOnBreak(true);
                setCurrentCard(null); // Limpiar la carta actual cuando entra en descanso
            } else if (err.message?.includes('Tiempo de estudio completado')) {
                // El tiempo de estudio se completó automáticamente
                setIsOnBreak(true);
                setCurrentCard(null);
                // Actualizar el estado
                const status = await getPomodoroStatus(parseInt(sessionId!));
                setPomodoroStatus(status);
            } else {
                console.error('Error loading next card:', err);
                // En caso de error, no marcar como completado inmediatamente
                // El usuario puede intentar continuar o finalizar manualmente
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

            // Usar el método específico de Pomodoro
            await evaluatePomodoroCard(sessionIdNum, currentCard.cardId, evaluation);

            // Actualizar progreso
            const progressData = await getPomodoroProgress(sessionIdNum);
            setProgress(progressData);

            // Cargar siguiente carta
            await loadNextCard();
        } catch (err) {
            console.error('Error evaluating card:', err);
        }
    };

    const handleStartBreak = async () => {
        try {
            const sessionIdNum = parseInt(sessionId!);
            await startPomodoroBreak(sessionIdNum);
            setIsOnBreak(true);
            setCurrentCard(null);

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
                <NavbarStudySession />
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
        <div className="font-primary scroll-smooth scrollbar-hide bg-gradient-to-b from-darkBackground via-darkGradientBlueText to-darkPrimary text-white">
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                {/* Progress and Timer */}
                <div className="w-full max-w-4xl px-4 mt-25">
                    <PomodoroProgress progress={progress} />
                    <PomodoroTimer
                        status={pomodoroStatus}
                        onStartBreak={handleStartBreak}
                        onEndBreak={handleEndBreak}
                        isOnBreak={isOnBreak}
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    {isOnBreak ? (
                        <div className="text-center">
                            <h1 className="text-4xl font-bold mb-6">¡Tiempo de Descanso!</h1>
                            <p className="text-xl mb-8">Relájate por unos minutos</p>
                            <button
                                onClick={handleEndBreak}
                                className="btn btn-primary"
                            >
                                Finalizar Descanso
                            </button>
                        </div>
                    ) : currentCard ? (
                        <>
                            {renderCardContent()}

                            <div className="flex flex-col items-center mt-8">
                                {!showAnswer ? (
                                    <button
                                        onClick={handleShowAnswer}
                                        className="btn btn-primary"
                                    >
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
                <div className="w-full flex justify-center pb-8">
                    <button
                        onClick={handleFinishSession}
                        className="btn btn-secondary"
                    >
                        Finalizar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PomodoroStudySession;
