import { useState, useMemo } from "react";
import { NavbarLoginIn } from "../../components/Navbar"
import { DecksTable } from "../../libs/daisyUI/DeckTables"
import { useDecks } from "@/hooks/useDeck";
import { ButtonCustom } from '@/components/Buttons';
import { CreateDeckModal } from "@/components/CreateDeckModal";
import { Pagination } from "@/components/Pagination";
import { PageSizeSelector } from "@/components/PageSizeSelector";
import Footer from "../../components/Footer";

type PageSize = 5 | 10 | 25 | 50 | 'Todas';

const MisMazos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageSize, setPageSize] = useState<PageSize>(10);
    const [currentPage, setCurrentPage] = useState(1);
    const { decks, loading, error, deleteDeck, createDeck, updateDeck, refetch } = useDecks();

    const displayedDecks = useMemo(() => {
        if (!decks) return [];
        if (pageSize === 'Todas') return decks;

        const start = (currentPage - 1) * Number(pageSize);
        const end = start + Number(pageSize);
        return decks.slice(start, end);
    }, [decks, pageSize, currentPage]);

    const totalPages = useMemo(() => {
        if (!decks) return 0;
        if (pageSize === 'Todas') return 1;
        return Math.ceil(decks.length / Number(pageSize));
    }, [decks, pageSize]);

    const handlePageSizeChange = (newSize: PageSize) => {
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-lightComponent">
            <span className="loading loading-spinner loading-lg text-darkSecondaryPurple"></span>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen text-red-500">
            Error: {error}
        </div>
    );

    return (
        <>
            <NavbarLoginIn />
            <div className="w-full min-h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
                }}>
                <h1 className="mt-20 text-6xl font-bold text-lightComponent">
                    Mis mazos
                </h1>
                <p className="text-lightComponent mt-2 text-xl">
                    Selecciona el mazo para editarlo o acceder a las cartas
                </p>

                <div className="flex flex-col justify-center items-center mt-10 w-10/12 max-w-6xl">
                    {/* Selector de tamaño de página */}
                    <div className="flex justify-between items-center w-full mb-4">
                        <PageSizeSelector
                            pageSize={pageSize}
                            onPageSizeChange={handlePageSizeChange}
                            totalItems={decks?.length || 0}
                            variant="blue" // Azul para mazos
                        />
                        <div className="text-sm text-darkInfo">
                            Total: <span className="font-semibold text-darkPSText">{decks?.length || 0}</span> mazos
                        </div>
                    </div>

                    {/* Tabla de mazos */}
                    <DecksTable
                        data={displayedDecks.map(deck => ({
                            deckId: deck.deckId,
                            title: deck.title,
                            body: deck.body
                        }))}
                        onDelete={async (deckId: number) => {
                            try {
                                await deleteDeck(deckId);
                                await refetch();
                                const newTotal = (decks?.length || 1) - 1;
                                const newTotalPages = pageSize === 'Todas' ? 1 : Math.ceil(newTotal / Number(pageSize));
                                if (currentPage > newTotalPages && newTotalPages > 0) {
                                    setCurrentPage(newTotalPages);
                                }
                            } catch (error) {
                                console.error("Error deleting deck:", error);
                            }
                        }}
                        onUpdate={async (deckId: number, title: string, body: string) => {
                            try {
                                await updateDeck(deckId, { title, body });
                                await refetch();
                            } catch (error) {
                                console.error("Error updating deck:", error);
                            }
                        }}
                    />

                    {/* Paginación compacta azul */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        totalItems={decks?.length || 0}
                        variant="blue" // Azul para mazos
                    />

                    {/* Botón crear mazo */}
                    <div className="flex justify-end mt-6 w-full">
                        <ButtonCustom
                            type="button"
                            text="Crear nuevo mazo"
                            onClick={() => setIsModalOpen(true)}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#A683FF', '#5311F8']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#8C4FFF"
                            width="180px"
                            height="35px"
                        />
                    </div>
                </div>

                <footer className="w-full mt-10">
                    <Footer />
                </footer>
            </div>
            {isModalOpen && (
                <CreateDeckModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={async (title, body) => {
                        await createDeck(title, body);
                        await refetch();
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    )
}

export default MisMazos