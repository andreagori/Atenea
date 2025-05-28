import { useDecks } from "@/hooks/useDeck";
import { useEffect, useState } from "react";
import { ChevronDown, BookOpen, Loader2, AlertCircle } from "lucide-react";

interface SelectDecksStudySessionProps {
    onDeckSelect?: (deckId: number) => void;
    preselectedDeckId?: number | null;
}

const SelectDecksStudySession: React.FC<SelectDecksStudySessionProps> = ({ onDeckSelect, preselectedDeckId }) => {
    const { decks, loading, error } = useDecks();
    const [selectedDeck, setSelectedDeck] = useState<number | null>(preselectedDeckId || null);

    useEffect(() => {
        if (preselectedDeckId && preselectedDeckId !== selectedDeck) {
            setSelectedDeck(preselectedDeckId);
            if (onDeckSelect) {
                onDeckSelect(preselectedDeckId);
            }
        }
    }, [preselectedDeckId, onDeckSelect, selectedDeck]);

    if (loading) {
        return (
            <div className="relative">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                    <div>
                        <p className="text-gray-900 font-medium">Cargando mazos...</p>
                        <p className="text-gray-500 text-sm">Por favor espera un momento</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-red-900 font-medium">Error al cargar mazos</p>
                        <p className="text-red-600 text-sm">Intenta recargar la página</p>
                    </div>
                </div>
            </div>
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
        <div className="relative font-primary">
            {/* Select minimalista */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>

                <select
                    value={selectedDeck || ""}
                    className="w-full pl-10 pr-10 py-3 bg-darkComponentElement border border-gray-300 rounded-lg text-white font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-darkComponent cursor-pointer"
                    onChange={handleSelectChange}
                >
                    <option disabled value="" className="text-white">
                        Selecciona un mazo de estudio
                    </option>
                    {decks.map((deck) => (
                        <option 
                            key={deck.deckId} 
                            value={deck.deckId}
                            className="text-white py-2"
                        >
                            {deck.title}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Contador simple */}
            <div className="mt-2 text-right">
                <span className="text-gray-500 text-xs">
                    {decks.length} {decks.length === 1 ? 'mazo disponible' : 'mazos disponibles'}
                </span>
            </div>
        </div>
    );
};

export default SelectDecksStudySession;