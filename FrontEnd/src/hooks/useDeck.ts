import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { API_CONFIG } from '@/config';

export interface Deck {
    deckId: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateDeckDto {
    title?: string;
    body?: string;
}

export const useDecks = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDecks = async () => {
        const token = Cookies.get("auth_token");
        if (!token) {
            setLoading(false);
            setError("No authentication token found");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<Deck[]>(`${API_CONFIG.BASE_URL}/deck`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDecks(response.data);
        } catch (err: any) {
            setError(err.message || 'Error al obtener los mazos');
            setDecks([]);
        } finally {
            setLoading(false);
        }
    };

    // Create a new deck
    const createDeck = async (title: string, body: string) => {
        const token = Cookies.get("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        try {
            const response = await axios.post<Deck>(
                `${API_CONFIG.BASE_URL}/deck`,
                { title, body },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDecks(prevDecks => [...prevDecks, response.data]);
            return response.data;
        } catch (err: any) {
            throw new Error(err.message || 'Error al crear el deck');
        }
    };

    // Delete a deck
    const deleteDeck = async (deckId: number) => {
        const token = Cookies.get("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        try {
            await axios.delete(`${API_CONFIG.BASE_URL}/deck/${deckId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDecks(prevDecks => prevDecks.filter(deck => deck.deckId !== deckId));
        } catch (err: any) {
            throw new Error(err.message || 'Error al eliminar el deck');
        }
    };

    // Update a deck
    const updateDeck = async (id: number, data: UpdateDeckDto) => {
        const token = Cookies.get("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        try {
            const response = await axios.patch<Deck>(
                `${API_CONFIG.BASE_URL}/deck/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Actualizar el estado local
            setDecks(prevDecks =>
                prevDecks.map(deck =>
                    deck.deckId === id ? { ...deck, ...response.data } : deck
                )
            );

            return response.data;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Error al actualizar el mazo');
        }
    };

    useEffect(() => {
        fetchDecks();
    }, []);

    return {
        decks,
        loading,
        error,
        refetch: fetchDecks,
        createDeck,
        deleteDeck,
        updateDeck
    };
};