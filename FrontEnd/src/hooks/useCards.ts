import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

interface ActiveRecall {
    cardId: number;
    questionTitle: string;
    answer: string;
}

interface Cornell {
    cardId: number;
    principalNote: string;
    noteQuestions: string;
    shortNote: string;
}

interface VisualCard {
    cardId: number;
    urlImage: string;
}

export interface Card {
    cardId: number;
    deckId: number;
    title: string;
    learningMethod: string;
    activeRecall?: ActiveRecall | null;
    cornell?: Cornell | null;
    visualCard?: VisualCard | null;
}

interface CreateCardPayload {
    title: string;
    learningMethod: 'activeRecall' | 'cornell' | 'visualCard';
    // Active Recall fields
    questionTitle?: string;
    answer?: string;
    // Cornell fields
    principalNote?: string;
    noteQuestions?: string;
    shortNote?: string;
    // Visual Card fields
    urlImage?: string;
}

export const useCards = (deckId: number | undefined) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = async () => {
        if (!deckId) {
            setLoading(false);
            return;
        }

        const token = Cookies.get("auth_token");
        if (!token) {
            setError("No auth token found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get<Card[]>(`http://localhost:3000/card/deck/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCards(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error fetching cards');
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Create a new card
    const createCard = async (cardData: CreateCardPayload) => {
        const token = Cookies.get("auth_token");
        if (!token || !deckId) {
            throw new Error("No auth token found or invalid deck ID");
        }

        // Transformar los datos según el tipo de carta
        const payload = {
            title: cardData.title,
            learningMethod: cardData.learningMethod,
            ...getMethodSpecificFields(cardData)
        };

        try {
            const response = await axios.post(
                `http://localhost:3000/card/deck/${deckId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchCards(); // Refresh cards after creation
            return response.data;
        } catch (err: any) {
            console.error('Error creating card:', err.response?.data);
            throw new Error(err.response?.data?.message || 'Error creating card');
        }
    };

    // Función auxiliar para obtener los campos específicos según el método
    const getMethodSpecificFields = (cardData: CreateCardPayload) => {
        switch (cardData.learningMethod) {
            case 'activeRecall':
                return {
                    questionTitle: cardData.questionTitle,
                    answer: cardData.answer
                };
            case 'cornell':
                return {
                    principalNote: cardData.principalNote,
                    noteQuestions: cardData.noteQuestions,
                    shortNote: cardData.shortNote
                };
            case 'visualCard':
                return {
                    urlImage: cardData.urlImage
                };
            default:
                return {};
        }
    };

    // Delete a card
    const deleteCard = async (cardId: number) => {
        const token = Cookies.get("auth_token");
        if (!token || !deckId) {
            throw new Error("No auth token found or invalid deck ID");
        }

        try {
            await axios.delete(
                `http://localhost:3000/card/${cardId}/deck/${deckId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchCards(); // Refresh cards after deletion
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error deleting card');
        }
    };

    useEffect(() => {
        fetchCards();
    }, [deckId]);

    return {
        cards,
        loading,
        error,
        createCard,
        deleteCard,
        refetchCards: fetchCards,
    };
};