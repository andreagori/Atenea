import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStudySession } from "@/hooks/useStudySessions"
import { NavbarStudySession } from "@/components/Navbar"
import StudySessionsRemember from "@/components/StudySessionsInStudy"
import StudySessionsUserLevelsMenu from "@/libs/daisyUI/StudySessionsUserLevelsMenu"

const RegularStudySession = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [IsInitialLoad, setIsInitialLoad] = useState(true);

    const {
        currentCard,
        showAnswer,
        setShowAnswer,
        loading,
        error,
        getNextCard,
        evaluateCard,
        finishSession,
        isSessionComplete,
        setIsSessionComplete
    } = useStudySession();

    useEffect(() => {
        if (!sessionId) {
            console.error('Session ID is not defined');
            return;
        }

        // Solo cargar si es la primera vez
        if (IsInitialLoad) {
            const loadCard = async () => {
                try {
                    const card = await getNextCard(parseInt(sessionId));
                    if (!card) {
                        // No hay cartas disponibles
                    }
                } catch (err) {
                    console.error('Error al cargar la carta:', err);
                } finally {
                    setIsInitialLoad(false);
                }
            };

            loadCard();
        }
    }, [sessionId, IsInitialLoad, getNextCard]);

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    const handleEvaluation = async (evaluation: string) => {
        if (!sessionId || !currentCard?.cardId) {
            console.error('Missing sessionId or cardId:', { sessionId, cardId: currentCard?.cardId });
            return;
        }

        try {
            console.log('Evaluating card:', {
                sessionId,
                cardId: currentCard.cardId,
                evaluation
            });
            await evaluateCard(parseInt(sessionId), currentCard.cardId, evaluation);
        } catch (err) {
            console.error('Error al evaluar carta:', err);
        }
    };

    const handleFinishSession = async () => {
        if (!sessionId) return;
        try {
            await finishSession(parseInt(sessionId));
            setIsSessionComplete(true);
        } catch (err) {
            console.error('Error al finalizar la sesión:', err);
        }
    };

    if (isSessionComplete || (!currentCard && !IsInitialLoad)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-darkBackground text-white font-primary">
                <div className="text-center max-w-md px-6">
                    <div className="mb-8">
                        <svg className="w-20 h-20 mx-auto text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-3xl font-bold mb-4 text-white">¡Sesión completada!</h2>
                        <p className="text-lg text-gray-300">
                            {isSessionComplete
                                ? "Has finalizado exitosamente tu sesión de estudio."
                                : "No hay más cartas para repasar en esta sesión."}
                        </p>
                    </div>
                    <button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/sesionesEstudio')}
                    >
                        Volver a Sesiones
                    </button>
                </div>
            </div>
        );
    }

    if ((loading && IsInitialLoad) || IsInitialLoad) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-darkBackground">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-white text-lg font-medium">Cargando tarjeta...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-darkBackground px-4">
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl shadow-lg max-w-md text-center">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-primary scroll-smooth scrollbar-hide text-white min-h-screen"
            style={{
                background: "radial-gradient(ellipse at bottom, #1e3a8a 0%, #1e1b4b 40%, #000000 100%)"
            }}>
            <NavbarStudySession sessionType="regular" />
            {/* Contenedor principal con mejor distribución */}
            <div className="flex flex-col min-h-screen">
                {/* Header con título */}
                <div className="flex-shrink-0 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mt-19 mb-5">
                        {currentCard?.title}
                    </h1>
                </div>

                {/* Contenido principal de la tarjeta */}
                <div className="flex-1 flex flex-col justify-center items-center px-4 pb-4">
                    <StudySessionsRemember
                        currentCard={currentCard ?? undefined}
                        showAnswer={showAnswer}
                    />
                </div>

                {/* Sección de botones - Parte inferior fija */}
                <div className="flex-shrink-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        {!showAnswer ? (
                            /* Botón mostrar respuesta */
                            <div className="text-center">
                                <button
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                                    onClick={handleShowAnswer}
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Mostrar respuesta
                                </button>
                            </div>
                        ) : (
                            /* Menú de evaluación y botón finalizar */
                            <div className="space-y-6">
                                <StudySessionsUserLevelsMenu onEvaluate={handleEvaluation} />

                                <div className="text-center pt-4 border-t border-white/10">
                                    <button
                                        className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                                        onClick={handleFinishSession}
                                    >
                                        <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Finalizar sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegularStudySession;