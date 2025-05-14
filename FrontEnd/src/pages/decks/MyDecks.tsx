import { useState } from "react";
import { NavbarLoginIn } from "../../components/Navbar"
import { DecksTable } from "../../libs/daisyUI/DeckTables"
import { useDecks } from "@/hooks/useDeck";
import { ButtonCustom } from '@/components/Buttons';
import { CreateDeckModal } from "@/components/CreateDeckModal";
import { ChevronRight } from 'lucide-react';
import Footer from "../../components/Footer";

const MisMazos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { decks, loading, error, deleteDeck, createDeck, refetch } = useDecks();

    if (loading) return <p className="text-white mt-20">Cargando mazos...</p>;
    if (error) return <p className="text-red-500 mt-20">Error: {error}</p>;

    return (
        <>
            <NavbarLoginIn />
            <div className="w-full h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
                }}>
                <h1 className="mt-20 text-6xl font-bold text-lightComponent">
                    Mis mazos
                </h1>
                <p className="text-lightComponent mt-2 text-xl">
                    Selecciona el mazo para editarlo o acceder a las cartas
                </p>
                <div className="flex flex-col justify-center items-center mt-10 w-10/12 h-full">
                    <DecksTable
                        data={decks}
                        onDelete={(index) => {
                            const deckId = decks[index].id;
                            deleteDeck(deckId);
                        }}
                        onEdit={(index) => console.log(`Edit deck at index: ${index}`)}
                        onStudy={(index) => console.log(`Study deck at title: ${decks[index].title}`)}
                    />
                    <div className="flex justify-end mt-4 gap-2 self-end">
                        <ButtonCustom
                            type="button"
                            text="Crear nuevo mazo"
                            onClick={() => setIsModalOpen(true)}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#0C3BEB', '#1A368B']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#0C3BEB"
                            width="180px"
                            height="35px"
                        />

                        <ButtonCustom
                            type="button"
                            text="Siguiente"
                            onClick={() => console.log("Siguiente")}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#0C3BEB', '#0C3BEB']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#0C3BEB"
                            width="150px"
                            height="35px"
                            icon={< ChevronRight />}
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
                        await createDeck(title, body); // crea el mazo
                        await refetch(); // refetch después de crear
                        setIsModalOpen(false); // cierra el modal
                    }}
                />
            )}
        </>
    )
}

export default MisMazos