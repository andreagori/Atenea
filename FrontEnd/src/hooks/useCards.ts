import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { API_CONFIG } from '../config';

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
    file?: File;
}

interface UpdateCardPayload {
    title: string;
    // Active Recall fields
    questionTitle?: string;
    answer?: string;
    // Cornell fields
    principalNote?: string;
    noteQuestions?: string;
    shortNote?: string;
    // Visual Card fields
    urlImage?: string;
    file?: File;
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
            const response = await axios.get<Card[]>(`${API_CONFIG.BASE_URL}/card/deck/${deckId}`, {
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

        try {
            let formData = new FormData();
            let payload: any = {
                title: cardData.title,
                learningMethod: cardData.learningMethod
            };

            // Agregar campos específicos según el método
            switch (cardData.learningMethod) {
                case 'activeRecall':
                    payload.questionTitle = cardData.questionTitle;
                    payload.answer = cardData.answer;
                    break;
                case 'cornell':
                    payload.principalNote = cardData.principalNote;
                    payload.noteQuestions = cardData.noteQuestions;
                    payload.shortNote = cardData.shortNote;
                    break;
                case 'visualCard':
                    if (cardData.file) {
                        formData.append('file', cardData.file);
                    }
                    break;
            }

            // Para visual cards con archivo, usar FormData
            if (cardData.learningMethod === 'visualCard' && cardData.file) {
                formData.append('title', cardData.title);
                formData.append('learningMethod', cardData.learningMethod);

                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}/card/deck/${deckId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                await fetchCards();
                return response.data;
            } else {
                // Para otros tipos, enviar como JSON normal
                const response = await axios.post(
                    `${API_CONFIG.BASE_URL}/card/deck/${deckId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                await fetchCards();
                return response.data;
            }
        } catch (err: any) {
            console.error('Error creating card:', err.response?.data);
            throw new Error(err.response?.data?.message || 'Error creating card');
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
                `${API_CONFIG.BASE_URL}/card/${cardId}/deck/${deckId}`,
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

    // Update a card
    const updateCard = async (cardId: number, cardData: UpdateCardPayload | FormData) => {
        const token = Cookies.get("auth_token");
        if (!token || !deckId) {
            throw new Error("No auth token found or invalid deck ID");
        }

        try {
            if (cardData instanceof FormData) {
                const response = await axios.patch(
                    `${API_CONFIG.BASE_URL}/card/${cardId}/deck/${deckId}`,
                    cardData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                await fetchCards();
                return response.data;
            } else {
                const response = await axios.patch(
                    `${API_CONFIG.BASE_URL}/card/${cardId}/deck/${deckId}`,
                    cardData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                await fetchCards();
                return response.data;
            }
        } catch (err: any) {
            console.error('Error updating card:', err.response?.data);
            throw new Error(err.response?.data?.message || 'Error updating card');
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
        updateCard,
        refetchCards: fetchCards,
    };
};