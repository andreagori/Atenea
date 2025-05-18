import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeckIdByTitle } from "../../hooks/useDeckIdByTitle";
import { useCards } from "../../hooks/useCards";
import { NavbarLoginIn } from "../../components/Navbar"
import { CardsTable } from "../../libs/daisyUI/DeckTables"
import { ButtonCustom } from '@/components/Buttons';
import { CreateCardModal } from "@/components/CreateDeckModal";
import { ChevronRight } from 'lucide-react';
import { CreateCardPayload } from "@/types/card.types";
import Footer from "../../components/Footer";

const OneDeck = () => {
    const navigate = useNavigate();
    const { title } = useParams<{ title: string }>();
    const { deckId, loading: loadingDeckId, error: deckError } = useDeckIdByTitle(title);
    const { cards, loading: loadingCards, error: cardsError, createCard, refetchCards } = useCards(deckId ?? undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Loading state
    if (loadingDeckId || (deckId && loadingCards)) {
        return (
            <div className="w-full h-screen flex bg-darkBackground font-primary flex-col items-center justify-center">
                <span className="loading loading-spinner loading-lg text-darkSecondaryPurple"></span>
            </div>
        );
    }

    const handleCreateCard = async (cardData: CreateCardPayload) => {
        try {
            await createCard(cardData);
            // Refresh cards or handle success
        } catch (error) {
            console.error('Error creating card:', error);
        }
    };

    // Error states
    if (deckError || !deckId) {
        return (
            <div className="w-full h-screen flex bg-darkBackground font-primary flex-col items-center justify-center">
                <p className="text-red-500 text-xl">
                    {deckError || "No se pudo encontrar el mazo"}
                </p>
                <button
                    className="mt-4 text-darkSecondaryPurple hover:text-white"
                    onClick={() => navigate('/mazos')}
                >
                    Volver a mazos
                </button>
            </div>
        );
    }

    return (
        <>
            <NavbarLoginIn />
            <div
                className="w-full min-h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
                }}
            >
                <h1 className="mt-20 text-6xl font-bold text-darkSecondaryPurple">
                    {decodeURIComponent(title || "Nombre de mazo")}
                </h1>

                <div className="flex flex-col justify-center items-center mt-10 w-10/12 flex-grow">
                    <p className="text-darkSecondaryPurple mt-2 text-3xl font-semibold">
                        Cartas del mazo:
                    </p>

                    {cardsError ? (
                        <p className="text-red-500 mt-4">{cardsError}</p>
                    ) : cards && cards.length > 0 ? (
                        <CardsTable deckId={deckId} />
                    ) : (
                        <p className="text-white mt-4">No hay cartas en este mazo</p>
                    )}

                    <div className="flex justify-end mt-4 gap-2 self-end">
                        <ButtonCustom
                            type="button"
                            text="Agregar nueva carta"
                            onClick={() => setIsModalOpen(true)}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#9625FF', '#1700A4']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#9625FF"
                            width="180px"
                            height="35px"
                        />

                        {cards && cards.length > 0 && (
                            <ButtonCustom
                                type="button"
                                text="Comenzar estudio"
                                onClick={() => navigate(`/sesionesEstudio/${deckId}`)}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#8C4FFF', '#8C4FFF']}
                                color="#fff"
                                hoverColor="#fff"
                                hoverBackground="#9625FF"
                                width="150px"
                                height="35px"
                                icon={<ChevronRight />}
                            />
                        )}
                    </div>
                </div>

                <footer className="w-full mt-10">
                    <Footer />
                </footer>
            </div>

            {isModalOpen && (
                <CreateCardModal
                    onClose={() => setIsModalOpen(false)}
                    onCreateCard={handleCreateCard}
                />
            )}
        </>
    );
};

export default OneDeck;