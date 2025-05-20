// The select for the decks in the study session. Testing the daisyUI select component.
import { useDecks } from "@/hooks/useDeck";

interface SelectDecksStudySessionProps {
  onDeckSelect?: (deckId: number) => void;
}

const SelectDecksStudySession: React.FC<SelectDecksStudySessionProps> = ({ onDeckSelect }) => {
    const { decks, loading, error } = useDecks();

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

    return (
        <select 
            defaultValue="" 
            className="select select-lg select-primary bg-darkPSText font-primary font-bold text-lg text-darkComponent rounded-2xl"
            onChange={(e) => onDeckSelect && onDeckSelect(Number(e.target.value))}
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