import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TestResultDto } from '@/types/simulatedStudySessions.types';

interface CreateStudySessionDto {
    studyMethod: 'spacedRepetition' | 'pomodoro' | 'simulatedTest';
    learningMethod: string[];
    numCardsSpaced?: number;
    numCards?: number;
    studyMinutes?: number;
    restMinutes?: number;
    numQuestions?: number;
    testDurationMinutes?: number;
}

interface StudySessionResponse {
    sessionId: number;
    studyMethod: string;
    learningMethod: string[];
    numCardsSpaced?: number;
    numCards?: number;
    studyMinutes?: number;
    restMinutes?: number;
    numQuestions?: number;
    testDurationMinutes?: number;
}

interface CurrentCard {
    cardId: number;
    title: string;
    learningMethod: string;
    answer?: string;          // Para activeRecall
    principalNote?: string;   // Para cornell
    urlImage?: string;        // Para visualCard
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

interface CardResponse {
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

interface PomodoroStatus {
    sessionId: number;
    currentCycle: number;
    currentPhase: 'study' | 'break' | 'not_started';
    isOnBreak: boolean;
    timeRemaining: number; // en minutos
    studyDuration: number;
    breakDuration: number;
    totalStudyTime: number;
    totalBreakTime: number;
}

interface PomodoroProgress {
    currentCycle: number;
    isOnBreak: boolean;
    studyTimeElapsed: number;
    breakTimeElapsed: number;
    studyTimeTarget: number;
    breakTimeTarget: number;
    totalCards: number;
    reviewedCards: number;
    uniqueCardsReviewed: number;
    cardsTarget: number;
}

export const useStudySession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCard, setCurrentCard] = useState<CurrentCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    const createStudySession = async (deckId: number, sessionConfig: CreateStudySessionDto) => {
        const token = Cookies.get("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post<StudySessionResponse>(
                `http://localhost:3000/study-sessions/deck/${deckId}`,
                sessionConfig,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.data.sessionId) {
                throw new Error('No session ID received from server');
            }
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear la sesión de estudio';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Obtener siguiente carta
    const getNextCard = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            setLoading(true);
            const response = await axios.get<CardResponse>(
                `http://localhost:3000/study-sessions/${sessionId}/next-card`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const card = response.data;

            // Si no hay más cartas, manejarlo gracefully
            if (!card || !card.cardId || !card.learningMethod) {
                console.log('No more cards available');
                setCurrentCard(null);
                setIsSessionComplete(true);
                return null;
            }

            let cardContent: CurrentCard = {
                cardId: card.cardId,
                title: card.title || 'Sin título',
                learningMethod: card.learningMethod.toLowerCase(),
                answer: card.activeRecall?.answer,
                principalNote: card.cornell?.principalNote,
                urlImage: card.visualCard?.urlImage,
                activeRecall: card.activeRecall,
                cornell: card.cornell,
                visualCard: card.visualCard
            };

            setCurrentCard(cardContent);
            setShowAnswer(false);
            return cardContent;
        } catch (err: any) {
            // Si es error 404 (no más cartas) o la sesión ya finalizó
            if (err.response?.status === 404) {
                console.log('Session completed or no more cards');
                setCurrentCard(null);
                setIsSessionComplete(true);
                return null;
            }

            setError(err.response?.data?.message || 'Error al obtener la siguiente carta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Evaluar carta
    const evaluateCard = async (sessionId: number, cardId: number, evaluation: string) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");
        if (!cardId) throw new Error("Card ID is required");

        try {
            setLoading(true);
            await axios.post(
                `http://localhost:3000/card-reviews/session/${sessionId}/card/${cardId}`,
                {
                    evaluation,
                    timeSpent: 1
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const nextCard = await getNextCard(sessionId);

            if (!nextCard) {
                return null;
            }

            return nextCard;
        } catch (err: any) {
            if (err.response?.status === 404) {
                setIsSessionComplete(true);
                return null;
            }
            setError(err.response?.data?.message || 'Error al evaluar la carta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Finalizar sesión
    const finishSession = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            setLoading(true);
            await axios.post(
                `http://localhost:3000/study-sessions/${sessionId}/finish`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (err: any) {
            if (err.response?.status === 404) {
                setIsSessionComplete(true);
                return;
            }
            setError(err.response?.data?.message || 'Error al finalizar la sesión');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // SIMULATED TEST
    const getTestQuestion = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");
        try {
            const response = await axios.get(
                `http://localhost:3000/study-sessions/${sessionId}/test-question`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Si la respuesta es exitosa pero no hay más preguntas, manejarlo adecuadamente
            if (response.status === 204) {
                console.log('No hay más preguntas disponibles');
                return null;
            }

            return response.data;
        } catch (err: any) {
            console.error('Error fetching test question:', err);

            // Extraer mensaje de error más útil
            const errorMessage = err.response?.data?.message || err.message;
            console.log('Detalle del error:', errorMessage);

            // Si el error es porque se completó el número de preguntas o no hay más cartas,
            // podemos devolver null para indicar finalización
            if (err.response?.status === 400 &&
                (errorMessage.includes('No hay suficientes cartas') ||
                    errorMessage.includes('alcanzado el límite'))) {
                return null;
            }

            throw err;
        }
    };

    const submitTestAnswer = async (sessionId: number, questionId: number, selectedOptionIndex: number, timeSpent?: number) => {
        try {
            console.log('Enviando respuesta:', {
                questionId,
                selectedOptionIndex,
                timeSpent: timeSpent || 1
            });

            const response = await axios.post(
                `http://localhost:3000/study-sessions/${sessionId}/test-answer`,
                {
                    questionId,
                    selectedOptionIndex,
                    timeSpent: timeSpent || 1
                },
                {
                    headers: { Authorization: `Bearer ${Cookies.get('auth_token')}` }
                }
            );

            return response.data;
        } catch (err: any) {
            console.error('Error submitting answer:', err);
            console.error('Error response data:', err.response?.data);
            throw err;
        }
    };

    const getTestProgress = async (sessionId: number) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/study-sessions/${sessionId}/test-progress`,
                {
                    headers: { Authorization: `Bearer ${Cookies.get('auth_token')}` }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Error fetching test progress:', err);
            throw err;
        }
    };

    const getTestResult = async (sessionId: number): Promise<TestResultDto> => {
        try {
            const response = await axios.get<TestResultDto>(
                `http://localhost:3000/study-sessions/${sessionId}/test-result`,
                {
                    headers: { Authorization: `Bearer ${Cookies.get('auth_token')}` }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Error fetching test result:', err);
            throw err;
        }
    };

    // POMODORO
    const getPomodoroNextCard = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            setLoading(true);
            const response = await axios.get<CardResponse>(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/next-card`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const card = response.data;

            if (!card || !card.cardId || !card.learningMethod) {
                console.log('No more cards available');
                setCurrentCard(null);
                return null;
            }

            let cardContent: CurrentCard = {
                cardId: card.cardId,
                title: card.title || 'Sin título',
                learningMethod: card.learningMethod.toLowerCase(),
                answer: card.activeRecall?.answer,
                principalNote: card.cornell?.principalNote,
                urlImage: card.visualCard?.urlImage,
                activeRecall: card.activeRecall,
                cornell: card.cornell,
                visualCard: card.visualCard
            };

            setCurrentCard(cardContent);
            setShowAnswer(false);
            return cardContent;
        } catch (err: any) {
            // Manejar errores específicos de Pomodoro
            if (err.response?.status === 400) {
                const errorMessage = err.response?.data?.message || '';

                if (errorMessage.includes('está en descanso')) {
                    throw new Error('La sesión está en descanso');
                } else if (errorMessage.includes('Tiempo de estudio completado')) {
                    throw new Error('Tiempo de estudio completado. Inicia tu descanso.');
                }
            }

            if (err.response?.status === 404) {
                // En Pomodoro, un 404 podría indicar un problema del servidor
                // No debería suceder si la lógica está correcta
                console.error('Unexpected 404 in Pomodoro session:', err);
                throw new Error('Error del servidor al obtener la siguiente carta');
            }

            setError(err.response?.data?.message || 'Error al obtener la siguiente carta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPomodoroProgress = async (sessionId: number): Promise<PomodoroProgress> => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            const response = await axios.get<PomodoroProgress>(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/progress`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al obtener el progreso');
            throw err;
        }
    };

    const evaluatePomodoroCard = async (sessionId: number, cardId: number, evaluation: string) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            setLoading(true);
            const response = await axios.post(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/evaluate`,
                {
                    cardId,
                    evaluation
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al evaluar la carta');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const startPomodoroBreak = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            const response = await axios.post(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/start-break`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar el descanso');
            throw err;
        }
    };

    const endPomodoroBreak = async (sessionId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            const response = await axios.post(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/end-break`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al finalizar el descanso');
            throw err;
        }
    };

    const getPomodoroStatus = async (sessionId: number): Promise<PomodoroStatus> => {
        const token = Cookies.get("auth_token");
        if (!token) throw new Error("No authentication token found");

        try {
            const response = await axios.get<PomodoroStatus>(
                `http://localhost:3000/study-sessions/${sessionId}/pomodoro/status`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al obtener el estado');
            throw err;
        }
    };

    return {
        createStudySession,
        getNextCard,
        evaluateCard,
        finishSession,
        currentCard,
        showAnswer,
        setShowAnswer,
        loading,
        error,
        isSessionComplete,
        setIsSessionComplete,
        getTestQuestion,
        submitTestAnswer,
        getTestProgress,
        getTestResult,
        getPomodoroNextCard,
        getPomodoroProgress,
        startPomodoroBreak,
        endPomodoroBreak,
        getPomodoroStatus,
        evaluatePomodoroCard
    };
};