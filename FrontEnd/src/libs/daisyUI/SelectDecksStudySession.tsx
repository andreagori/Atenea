import { useDecks } from "@/hooks/useDeck";
import { useEffect, useState } from "react";

interface SelectDecksStudySessionProps {
    onDeckSelect?: (deckId: number) => void;
    preselectedDeckId?: number | null;
}

const SelectDecksStudySession: React.FC<SelectDecksStudySessionProps> = ({ onDeckSelect, preselectedDeckId }) => {
    const { decks, loading, error } = useDecks();
    const [selectedDeck, setSelectedDeck] = useState<number | null>(preselectedDeckId || null);

    // ✅ useEffect DEBE estar antes de cualquier return condicional
    useEffect(() => {
        if (preselectedDeckId && preselectedDeckId !== selectedDeck) {
            setSelectedDeck(preselectedDeckId);
            if (onDeckSelect) {
                onDeckSelect(preselectedDeckId);
            }
        }
    }, [preselectedDeckId, onDeckSelect, selectedDeck]);

    // Ahora sí podemos tener los returns condicionales
    if (loading) {
        return (
            <select disabled className="select select-lg select-primary bg-darkPSText font-primary font-bold text-lg text-darkComponent rounded-2xl">
                <option>Cargando mazos...</option>
            </select>
        );
    }

    if (error) {
        return (
            <select disabled className="select select-lg select-primary bg-darkPSText font-primary font-bold text-lg text-darkComponent rounded-2xl">
                <option>Error al cargar mazos</option>
            </select>
        );
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deckId = Number(e.target.value);
        setSelectedDeck(deckId);
        if (onDeckSelect) {
            onDeckSelect(deckId);
        }
    };

    return (
        <select
            value={selectedDeck || ""}
            className="select select-lg select-primary bg-darkPSText font-primary font-bold text-lg text-darkComponent rounded-2xl"
            onChange={handleSelectChange}
        >
            <option disabled value="">
                Nombre del mazo:
            </option>
            {decks.map((deck) => (
                <option key={deck.deckId} value={deck.deckId}>
                    {deck.title}
                </option>
            ))}
        </select>
    );
};

export default SelectDecksStudySession;