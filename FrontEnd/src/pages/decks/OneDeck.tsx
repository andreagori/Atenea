import { useMemo, useState } from "react";
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

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 'Todas'] as const;
type PageSize = typeof PAGE_SIZE_OPTIONS[number];

const OneDeck = () => {
    const navigate = useNavigate();
    const { title } = useParams<{ title: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { deckId, loading: loadingDeckId, error: deckError } = useDeckIdByTitle(title);
    const { cards, loading, error, createCard, updateCard, deleteCard, refetchCards } = useCards(deckId ?? undefined);
    const [pageSize, setPageSize] = useState<PageSize>(10);
    const [currentPage, setCurrentPage] = useState(1);

    const displayedCards = useMemo(() => {
        if (!cards) return [];
        if (pageSize === 'Todas') return cards;

        const start = (currentPage - 1) * Number(pageSize);
        const end = start + Number(pageSize);
        return cards.slice(start, end);
    }, [cards, pageSize, currentPage]);

    const totalPages = useMemo(() => {
        if (!cards) return 0;
        if (pageSize === 'Todas') return 1;
        return Math.ceil(cards.length / Number(pageSize));
    }, [cards, pageSize]);

    if (loadingDeckId || loading) {
        return (
            <div className="w-full h-screen flex bg-darkBackground font-primary flex-col items-center justify-center">
                <span className="loading loading-spinner loading-lg text-darkSecondaryPurple"></span>
            </div>
        );
    }

    const handleCreateCard = async (cardData: CreateCardPayload) => {
        if (!deckId) return;
        try {
            await createCard(cardData);
            await refetchCards();
        } catch (error) {
            console.error('Error creating card:', error);
        }
    };

    const handleDeleteCard = async (cardId: number) => {
        try {
            await deleteCard(cardId);
            await refetchCards();
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    const handleUpdateCard = async (cardId: number, cardData: any) => {
        try {
            await updateCard(cardId, cardData);
            await refetchCards();
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    const handlePageSizeChange = (newSize: PageSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

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
            <div className="w-full min-h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
                }}>
                <h1 className="mt-20 text-6xl font-bold text-darkSecondaryPurple">
                    {decodeURIComponent(title || "Nombre de mazo")}
                </h1>

                <div className="flex flex-col justify-center items-center mt-10 w-10/12 flex-grow">
                    <p className="text-darkSecondaryPurple mt-2 text-3xl font-semibold">
                        Cartas del mazo:
                    </p>

                    {error ? (
                        <p className="text-red-500 mt-4">{error}</p>
                    ) : cards && cards.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center w-full mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-white">Mostrar:</span>
                                    <select
                                        className="select select-bordered select-sm bg-darkPrimaryPurple text-white"
                                        value={pageSize.toString()}
                                        onChange={(e) => {
                                            const value = e.target.value === 'Todas' ? 'Todas' : Number(e.target.value);
                                            setPageSize(value as PageSize);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {PAGE_SIZE_OPTIONS.map((size) => (
                                            <option key={size.toString()} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-white">cartas</span>
                                </div>
                                <div className="text-white">
                                    Mostrando {displayedCards.length} de {cards.length} cartas
                                </div>
                            </div>

                            <CardsTable
                                deckId={deckId}
                                displayedCards={displayedCards}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={handlePageSizeChange}
                                totalCards={cards?.length ?? 0}
                                onDeleteCard={handleDeleteCard}
                                onUpdateCard={handleUpdateCard}
                            />

                            {pageSize !== 'Todas' && totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <button
                                        className="btn btn-sm btn-circle"
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            className={`btn btn-sm btn-circle ${page === currentPage ? 'btn-primary' : ''
                                                }`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className="btn btn-sm btn-circle"
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </div>
                            )}
                        </>
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