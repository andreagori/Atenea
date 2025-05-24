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
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const {
        currentCard,
        showAnswer,
        setShowAnswer,
        loading,
        error,
        getNextCard,
        evaluateCard,
        finishSession
    } = useStudySession();

    useEffect(() => {
        if (!sessionId) {
            console.error('Session ID is not defined');
            return;
        }

        const loadCard = async () => {
            try {
                const card = await getNextCard(parseInt(sessionId));
                if (!card) {
                    console.log('No more cards to study, showing completion screen');
                }
            } catch (err) {
                console.error('Error loading card:', err);
            } finally {
                setIsInitialLoad(false);
            }
        };

        loadCard();
    }, [sessionId]);

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
            setSessionCompleted(true);
        } catch (err) {
            console.error('Error al finalizar sesión:', err);
        }
    };

    if (sessionCompleted || (!currentCard && !IsInitialLoad)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-darkBackground text-white font-primary">
                <h2 className="text-2xl mb-4">¡Has completado la sesión!</h2>
                <p className="text-lg mb-6">
                    {sessionCompleted
                        ? "Has decidido finalizar la sesión."
                        : "No hay más cartas para repasar en esta sesión."}
                </p>
                <div className="flex gap-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/sesionesEstudio')}
                    >
                        Volver a Sesiones
                    </button>
                </div>
            </div>
        );
    }


    if (loading || IsInitialLoad) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-darkBackground">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-darkPrimary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-darkBackground">
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="font-primary scroll-smooth scrollbar-hide bg-gradient-to-b from-darkBackground via-darkGradientBlueText to-darkPrimary text-white">
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                <h1 className="text-4xl font-semibold text-center mt-25 mb-20">
                    {currentCard?.title}
                </h1>

                <StudySessionsRemember
                    currentCard={currentCard ?? undefined}
                    showAnswer={showAnswer}
                />

                {!showAnswer && (
                    <button
                        className="btn btn-primary mt-30"
                        onClick={handleShowAnswer}
                    >
                        Mostrar respuesta
                    </button>
                )}

                {showAnswer && (
                    <div className="mt-10">
                        <StudySessionsUserLevelsMenu onEvaluate={handleEvaluation} />
                    </div>
                )}
            <button
                className="btn btn-secondary mt-10"
                onClick={handleFinishSession}
            >
                Finalizar sesión de estudio
            </button>
            </div>
        </div>
    );
}

export default RegularStudySession