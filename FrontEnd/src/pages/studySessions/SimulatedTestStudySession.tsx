import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavbarStudySession } from "@/components/Navbar";
import { useStudySession } from '@/hooks/useStudySessions';
import { TestQuestion, TestProgress, TestResultDto } from '@/types/simulatedStudySessions.types';

interface ExtendedTestProgress extends TestProgress {
    isComplete: boolean;
    sessionMethod?: string;
    error?: string;
}

const SimulatedTestStudySession = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<TestQuestion | null>(null);
    const [progress, setProgress] = useState<ExtendedTestProgress | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const { getTestQuestion, submitTestAnswer, getTestProgress, finishSession, getTestResult } = useStudySession();
    const [results, setResults] = useState<TestResultDto | null>(null);

    useEffect(() => {
        if (!sessionId) return;
        loadQuestion();
        loadProgress();
    }, [sessionId]);

    useEffect(() => {
        if (!progress?.remainingTime) return;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (!prev) return null;

                const newTime = prev.remainingTime - 1;

                if (newTime <= 0) {
                    clearInterval(timer);
                    handleFinishSession();
                    return { ...prev, remainingTime: 0 };
                }

                return { ...prev, remainingTime: newTime };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [progress?.remainingTime]);

    const handleOptionSelect = async (index: number) => {
        if (!question || !sessionId || selectedOption !== null) return;

        setSelectedOption(index);
        try {
            console.log('Seleccionando opción:', {
                sessionId,
                questionId: question.questionId,
                index,
                timeSpent: Math.floor((Date.now() - startTime) / 1000)
            });

            const response = await submitTestAnswer(
                parseInt(sessionId),
                question.questionId,
                index,
                Math.floor((Date.now() - startTime) / 1000)
            );

            // Verificar si esta es la última pregunta según el progreso
            const isLastQuestion = question.progress.current >= question.progress.total;

            // Esperar un breve momento antes de proceder
            setTimeout(async () => {
                // Actualizar el progreso para reflejar la respuesta actual
                await loadProgress();

                // Si es la última pregunta, mostramos los resultados después de un pequeño delay para que
                // el usuario pueda ver la respuesta seleccionada
                if (isLastQuestion) {
                    console.log('Esta fue la última pregunta, finalizando el test...');
                    // Esperar un poco más para que el usuario vea la selección
                    setTimeout(() => {
                        handleFinishSession();
                    }, 1500);
                } else {
                    // Si no es la última, cargamos la siguiente pregunta normalmente
                    setSelectedOption(null);
                    await loadQuestion();
                }
            }, 1000);
        } catch (err) {
            console.error('Error submitting answer:', err);
            alert('Error al enviar la respuesta. Intente nuevamente.');
        }
    };

    // Agregar estado para el tiempo transcurrido
    const [startTime, setStartTime] = useState(Date.now());

    const handleFinishSession = async () => {
        if (!sessionId) return;

        try {
            // Primero, intentamos finalizar la sesión
            await finishSession(parseInt(sessionId));
            console.log("Sesión finalizada correctamente");

            try {
                // Usar el nuevo endpoint para obtener resultados
                const result = await getTestResult(parseInt(sessionId));
                console.log("Resultados obtenidos:", result);
                setResults(result);
            } catch (resultError) {
                console.error("Error obteniendo resultados:", resultError);
                setResults({
                    sessionId: parseInt(sessionId),
                    correctAnswers: 0,
                    incorrectAnswers: 0,
                    score: 0,
                    timeSpent: 0
                });
            }
        } catch (err) {
            console.error("Error general finalizando sesión:", err);

            // Intentar mostrar algunos resultados incluso con error
            setResults({
                sessionId: parseInt(sessionId),
                correctAnswers: 0,
                incorrectAnswers: 0,
                score: 0,
                timeSpent: 0
            });
        }
    };

    // Renderizar resultados
    if (results) {
        return (
            <div className="...">
                <h2>¡Test Completado!</h2>
                <p>Correctas: {results.correctAnswers}</p>
                <p>Incorrectas: {results.incorrectAnswers}</p>
                <p>Puntuación: {results.score}%</p>
                <p>Tiempo: {results.timeSpent.toFixed(1)} minutos</p>
                <button onClick={() => navigate('/sesionesEstudio')}>
                    Volver
                </button>
            </div>
        );
    }

    const loadQuestion = async () => {
        try {
            setStartTime(Date.now());
            const newQuestion = await getTestQuestion(parseInt(sessionId!));

            // Verificar si realmente recibimos una pregunta válida
            if (
                !newQuestion ||
                typeof newQuestion !== 'object' ||
                Array.isArray(newQuestion) ||
                !('questionId' in newQuestion)
            ) {
                const currentProgress = await getTestProgress(parseInt(sessionId!)) as ExtendedTestProgress;

                if (currentProgress.answeredQuestions >= currentProgress.totalQuestions) {
                    console.log('Has completado todas las preguntas del test. Mostrando resultados...');
                    await handleFinishSession();
                    return;
                }

                console.log('No hay más preguntas disponibles, finalizando sesión...');
                await handleFinishSession();
                return;
            }

            setQuestion(newQuestion as TestQuestion);
            setSelectedOption(null);
        } catch (err) {
            console.error('Error loading question:', err);

            // Verificar si el error es porque el test ya completó todas las preguntas
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as any).response === "object" &&
                (err as any).response !== null &&
                (err as any).response.status === 400 &&
                ((err as any).response.data?.message?.includes('suficientes cartas') ||
                    (err as any).response.data?.message?.includes('finalizada'))
            ) {

                console.log('Test completado, mostrando resultados');
                await handleFinishSession();
            } else {
                // Otro tipo de error
                alert('Error al cargar la siguiente pregunta. Intentaremos finalizar la sesión.');
                await handleFinishSession();
            }
        }
    };

    const loadProgress = async () => {
        try {
            if (!sessionId) return;
            const currentProgress = await getTestProgress(parseInt(sessionId)) as ExtendedTestProgress;
            setProgress(currentProgress);

            if (currentProgress?.isComplete) {
                handleFinishSession();
            }
        } catch (err) {
            console.error('Error loading progress:', err);
        }
    };

    return (
        <div className="font-primary scroll-smooth scrollbar-hide bg-gradient-to-b from-darkBackground via-darkGradientBlueText to-darkPrimary text-white">
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden p-8">
                {/* Progress Bar */}
                {progress && (
                    <div className="w-full max-w-3xl mb-8">
                        <div className="flex justify-between mb-2">
                            <span>Pregunta {question?.progress.current} de {question?.progress.total}</span>
                            <span>Correctas: {progress.correctAnswers}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${(question?.progress.current || 0) / (question?.progress.total || 1) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Question */}
                {question && (
                    <>
                        <h1 className="text-4xl font-bold text-center mb-10">
                            {question.title}
                        </h1>

                        <div className="grid gap-4 w-full max-w-3xl">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={selectedOption !== null}
                                    className={`p-6 text-left rounded-lg transition-colors ${selectedOption === index
                                        ? 'bg-darkPrimary'
                                        : 'bg-darkSecondary hover:bg-darkPrimary/80'
                                        }`}
                                >
                                    {option.type === 'visualCard' ? (
                                        <img src={option.content} alt="Opción visual" className="max-h-40 mx-auto" />
                                    ) : (
                                        <p className="text-lg">{option.content}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SimulatedTestStudySession;
