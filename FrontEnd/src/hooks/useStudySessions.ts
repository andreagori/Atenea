import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

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

export const useStudySession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCard, setCurrentCard] = useState<CurrentCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

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
        console.log('Raw next card data:', card);

        // Si no hay más cartas, manejarlo gracefully
        if (!card || !card.cardId || !card.learningMethod) {
            console.log('No more cards available');
            setCurrentCard(null);
            // En lugar de lanzar error, finalizamos la sesión
            await finishSession(sessionId);
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

        console.log('Processed card content:', cardContent);
        setCurrentCard(cardContent);
        setShowAnswer(false);
        return cardContent;
    } catch (err: any) {
        // Si es error 404 (no más cartas) o la sesión ya finalizó
        if (err.response?.status === 404 || 
            err.response?.data?.message?.includes('finalizada')) {
            console.log('Session completed or no more cards');
            setCurrentCard(null);
            return null;
        }
        
        console.error('Error in getNextCard:', err);
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
        
        if (!nextCard || !nextCard.cardId) {
            console.log('No more cards available, finishing session');
            await finishSession(sessionId);
            return null;
        }

        return nextCard;
    } catch (err: any) {
        console.error('Error details:', err.response?.data);
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
            setError(err.response?.data?.message || 'Error al finalizar la sesión');
            throw error;
        } finally {
            setLoading(false);
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
        error
    };
};