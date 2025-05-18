import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

export interface Deck {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    updatedAt: string;
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
            const response = await axios.get<Deck[]>('http://localhost:3000/deck', {
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
                'http://localhost:3000/deck',
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
    const deleteDeck = async (id: number) => {
        const token = Cookies.get("auth_token");
        if (!token) {
            throw new Error("No authentication token found");
        }

        try {
            await axios.delete(`http://localhost:3000/deck/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDecks(prevDecks => prevDecks.filter(deck => deck.id !== id));
        } catch (err: any) {
            throw new Error(err.message || 'Error al eliminar el deck');
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
        deleteDeck
    };
};