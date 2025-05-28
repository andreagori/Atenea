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
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [processingAnswer, setProcessingAnswer] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [isSessionFinished, setIsSessionFinished] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set<number>());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!sessionId || isSessionFinished || isInitialized) return;

        const initSession = async () => {
            try {
                setIsInitialized(true);
                await initializeSession();
            } catch (error) {
                setIsInitialized(false); // Reset en caso de error
                throw error;
            }
        };

        initSession();
    }, [sessionId]);

    useEffect(() => {
        if (!progress?.remainingTime || isSessionFinished) return;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (!prev || isSessionFinished) return prev;

                const newTime = prev.remainingTime - 1;

                if (newTime <= 0) {
                    clearInterval(timer);
                    handleFinishSession('timeout');
                    return { ...prev, remainingTime: 0 };
                }

                return { ...prev, remainingTime: newTime };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [progress?.remainingTime, isSessionFinished]);

    const initializeSession = async () => {
        try {
            console.log('Inicializando sesión...');
            await loadProgress();
            await loadQuestion();
        } catch (err) {
            console.error('Error inicializando sesión:', err);
            handleFinishSession('error');
        }
    };

    const handleOptionSelect = async (index: number) => {
        // Evitar selecciones múltiples o durante procesamiento
        if (!question || !sessionId || selectedOption !== null || processingAnswer || isSessionFinished) {
            console.log('Selección bloqueada:', { selectedOption, processingAnswer, isSessionFinished });
            return;
        }

        // Verificar si esta pregunta ya fue respondida
        if (answeredQuestions.has(question.questionId)) {
            console.log('Pregunta ya respondida, ignorando...');
            return;
        }

        // Validar índice de opción
        if (index < 0 || index >= question.options.length) {
            console.error('Índice de opción inválido:', index);
            return;
        }

        // Establecer estados para UI
        setSelectedOption(index);
        setProcessingAnswer(true);

        try {
            const timeSpent = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

            console.log('Enviando respuesta:', {
                sessionId,
                questionId: question.questionId,
                index,
                timeSpent
            });

            const response = await submitTestAnswer(
                parseInt(sessionId),
                question.questionId,
                index,
                timeSpent
            ) as { isCorrect: boolean, correctCardId?: number };

            console.log('Respuesta recibida:', response);

            // Validar respuesta del servidor
            if (typeof response.isCorrect !== 'boolean') {
                throw new Error('Respuesta del servidor inválida');
            }

            // Marcar pregunta como respondida
            setAnsweredQuestions(prev => new Set([...prev, question.questionId]));

            // Mostrar feedback de respuesta correcta/incorrecta
            setIsCorrect(response.isCorrect);

            // Esperar un momento para mostrar el feedback visual
            const feedbackTimeout = setTimeout(async () => {
                try {
                    await processAnswerAndContinue();
                } catch (processError) {
                    console.error('Error procesando respuesta:', processError);
                    handleProcessingError();
                }
            }, 1500);

            // Limpiar timeout si el componente se desmonta
            return () => clearTimeout(feedbackTimeout);

        } catch (err) {
            console.error('Error enviando respuesta:', err);

            // Mostrar error específico al usuario
            setIsCorrect(null);

            // Resetear estado después de mostrar error
            const errorTimeout = setTimeout(() => {
                handleSubmissionError(err);
            }, 1500);

            return () => clearTimeout(errorTimeout);
        }
    };

    // Función auxiliar para manejar errores de procesamiento
    const handleProcessingError = () => {
        console.log('Manejando error de procesamiento...');
        resetQuestionState();
        // Intentar continuar con la siguiente pregunta
        continueToNextQuestion().catch(err => {
            console.error('Error continuando después de error de procesamiento:', err);
            // Como último recurso, finalizar la sesión
            handleFinishSession('processing_error');
        });
    };

    // Función auxiliar para manejar errores de envío
    const handleSubmissionError = (error: unknown) => {
        console.log('Manejando error de envío...');

        // Determinar si es un error de red o del servidor
        const isNetworkError = error instanceof TypeError ||
            (error as any)?.message?.includes('fetch');

        if (isNetworkError) {
            // Para errores de red, permitir reintentar
            console.log('Error de red detectado, permitiendo reintento...');
            resetQuestionState();
        } else {
            // Para otros errores, continuar con la siguiente pregunta
            console.log('Error del servidor, continuando...');
            resetQuestionState();
            continueToNextQuestion().catch(err => {
                console.error('Error continuando después de error de envío:', err);
                handleFinishSession('submission_error');
            });
        }
    };

    const processAnswerAndContinue = async () => {
        if (isSessionFinished) return;

        try {
            // Actualizar progreso después de la respuesta
            const updatedProgress = await getTestProgress(parseInt(sessionId!)) as ExtendedTestProgress;
            setProgress(updatedProgress);

            console.log('Progreso actualizado:', {
                answered: updatedProgress.answeredQuestions,
                total: updatedProgress.totalQuestions,
                isComplete: updatedProgress.isComplete,
                questionsInMemory: answeredQuestions.size
            });

            // Verificar si el test debe finalizar basándose en el progreso del backend
            if (updatedProgress.isComplete ||
                updatedProgress.answeredQuestions >= updatedProgress.totalQuestions) {
                console.log('Test completado según backend, finalizando...');
                handleFinishSession('completed');
                return;
            }

            // Resetear estado y continuar con la siguiente pregunta
            resetQuestionState();
            await continueToNextQuestion();

        } catch (err) {
            console.error('Error procesando respuesta:', err);
            // En caso de error, intentar continuar
            resetQuestionState();
            await continueToNextQuestion();
        }
    };

    const resetQuestionState = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setProcessingAnswer(false);
        setStartTime(Date.now());
    };

    const continueToNextQuestion = async () => {
        if (isSessionFinished) return;

        console.log('Continuando a la siguiente pregunta...');

        // Cargar nueva pregunta
        await loadQuestion();
    };

    const handleFinishSession = async (reason: string = 'manual') => {
        if (isSessionFinished) {
            console.log('Sesión ya finalizada, ignorando...');
            return;
        }

        console.log(`Finalizando sesión por: ${reason}`);
        setIsSessionFinished(true);

        try {
            // Finalizar la sesión en el backend
            if (reason !== 'backend_complete') {
                await finishSession(parseInt(sessionId!));
                console.log('Sesión finalizada en backend');
            }

            // Obtener resultados finales
            const result = await getTestResult(parseInt(sessionId!));
            console.log('Resultados obtenidos:', result);
            setResults(result);

        } catch (err) {
            console.error('Error finalizando sesión:', err);

            // Crear resultados por defecto si hay error
            setResults({
                sessionId: parseInt(sessionId!),
                correctAnswers: progress?.correctAnswers || 0,
                incorrectAnswers: progress?.incorrectAnswers || 0,
                score: progress ? Math.round((progress.correctAnswers / (progress.correctAnswers + progress.incorrectAnswers)) * 100) : 0,
                timeSpent: 0
            });
        }
    };

    const loadProgress = async () => {
        try {
            if (!sessionId || isSessionFinished) return;

            console.log('Cargando progreso...');
            const currentProgress = await getTestProgress(parseInt(sessionId)) as ExtendedTestProgress;
            console.log('Progreso cargado:', currentProgress);

            setProgress(currentProgress);

            // Solo verificar finalización si ya se marcó como completo en el backend
            if (currentProgress?.isComplete) {
                console.log('Backend indica que el test está completo');
                handleFinishSession('backend_complete');
            }
        } catch (err) {
            console.error('Error cargando progreso:', err);
            // No finalizar automáticamente por error de progreso
        }
    };

    const loadQuestion = async () => {
        try {
            if (isSessionFinished) {
                console.log('Sesión finalizada, no cargando más preguntas');
                return;
            }

            console.log('Cargando nueva pregunta...');
            const newQuestion = await getTestQuestion(parseInt(sessionId!)) as TestQuestion | null;

            if (!newQuestion) {
                console.log('No hay más preguntas disponibles');
                handleFinishSession('no_more_questions');
                return;
            }

            console.log('Nueva pregunta cargada:', {
                questionId: newQuestion.questionId,
                current: newQuestion.progress.current,
                total: newQuestion.progress.total,
                alreadyAnswered: answeredQuestions.has(newQuestion.questionId)
            });

            // Si la pregunta ya fue respondida, es porque el backend tiene una inconsistencia
            // En lugar de ignorarla, vamos a limpiar el estado y aceptarla
            if (answeredQuestions.has(newQuestion.questionId)) {
                console.warn('Pregunta duplicada detectada. Limpiando estado...');
                // No la ignoramos, sino que actualizamos el estado
                setAnsweredQuestions(new Set()); // Reset del set si hay inconsistencias
            }

            setQuestion(newQuestion);

        } catch (err) {
            console.error('Error cargando pregunta:', err);
            handleFinishSession('question_load_error');
        }
    };

    // Calcular progreso visual basado en preguntas únicas respondidas
    const getVisualProgress = () => {
        if (!question || !progress) return { current: 0, total: 1, percentage: 0 };

        const current = answeredQuestions.size + 1; // +1 para la pregunta actual
        const total = progress.totalQuestions;
        const percentage = Math.min((answeredQuestions.size / total) * 100, 100);

        return { current, total, percentage };
    };

    // Renderizar resultados
    if (results) {
        return (
            <div className="font-primary scroll-smooth scrollbar-hide text-white"
                style={{
                    background: "radial-gradient(ellipse at bottom, #1e3a8a 0%, #1e1b4b 40%, #000000 100%)"
                }}>
                <NavbarStudySession />
                <div className="w-full min-h-screen flex flex-col items-center justify-center p-8">
                    <div className="bg-darkSecondary p-8 rounded-lg max-w-md w-full text-center">
                        <h2 className="text-3xl font-bold mb-6">¡Test Completado!</h2>
                        <div className="space-y-4">
                            <div className="text-xl">
                                <span className="text-green-400">Correctas: {results.correctAnswers}</span>
                            </div>
                            <div className="text-xl">
                                <span className="text-red-400">Incorrectas: {results.incorrectAnswers}</span>
                            </div>
                            <div className="text-2xl font-bold">
                                Puntuación: <span className="text-blue-400">{results.score}%</span>
                            </div>
                            <div className="text-lg">
                                Tiempo: {results.timeSpent} minutos
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/sesionesEstudio')}
                            className="mt-6 bg-darkPrimary hover:bg-darkPrimary/80 px-6 py-3 rounded-lg transition-colors"
                        >
                            Volver a Sesiones
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const visualProgress = getVisualProgress();

    return (
        <div className="font-primary scroll-smooth scrollbar-hide text-white"
            style={{
                background: "radial-gradient(ellipse at bottom, #1e3a8a 0%, #1e1b4b 40%, #000000 100%)"
            }}>
            <NavbarStudySession sessionType="simulated" />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden p-8">
                {/* Progress Bar */}
                {progress && question && (
                    <div className="w-full max-w-3xl mb-5 mt-5">
                        <div className="flex justify-between mb-2">
                            <span>Pregunta {visualProgress.current} de {visualProgress.total}</span>
                            <span>Correctas: {progress.correctAnswers} | Incorrectas: {progress.incorrectAnswers}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-darkPrimary h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${visualProgress.percentage}%` }}
                            ></div>
                        </div>
                        {progress.remainingTime > 0 && (
                            <div className="text-center mt-2 text-sm">
                                Tiempo restante: {Math.floor(progress.remainingTime / 60)}:{(progress.remainingTime % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>
                )}

                {/* Question */}
                {question && !isSessionFinished && (
                    <>
                        <h1 className="text-4xl font-bold text-center mb-5">
                            {question.title}
                        </h1>

                        <div className="grid gap-4 w-full max-w-3xl">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={selectedOption !== null || processingAnswer}
                                    className={`p-6 text-left rounded-lg transition-all duration-300 
                                        ${selectedOption === index && isCorrect === true ? 'bg-green-600 border-2 border-green-400' : ''}
                                        ${selectedOption === index && isCorrect === false ? 'bg-red-600 border-2 border-red-400' : ''}
                                        ${selectedOption === index && isCorrect === null ? 'bg-darkPrimary border-2 border-blue-400' : ''}
                                        ${selectedOption !== index && selectedOption === null ? 'bg-darkComponent hover:bg-darkPrimary/80 border-2 border-transparent' : ''}
                                        ${selectedOption !== null && selectedOption !== index ? 'bg-darkSecondary/50 opacity-50' : ''}
                                        ${processingAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    {option.type === 'visualCard' ? (
                                        <img src={option.content} alt="Opción visual" className="max-h-40 mx-auto rounded" />
                                    ) : (
                                        <p className="text-lg">{option.content}</p>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Feedback de respuesta */}
                        {selectedOption !== null && isCorrect !== null && (
                            <div className={`mt-6 p-4 text-center font-bold rounded-lg text-xl transition-all duration-300
                                ${isCorrect ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                            </div>
                        )}

                        {processingAnswer && (
                            <div className="mt-4 text-center text-blue-400">
                                <div className="animate-pulse">Procesando respuesta...</div>
                            </div>
                        )}
                    </>
                )}

                {/* Loading state */}
                {!question && !results && !isSessionFinished && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                        <p className="text-lg">Cargando pregunta...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulatedTestStudySession;