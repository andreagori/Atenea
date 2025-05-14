import { useState } from "react";
import { useParams } from "react-router-dom";
import { NavbarLoginIn } from "../../components/Navbar"
import { CardsTable } from "../../libs/daisyUI/DeckTables"
import { ButtonCustom } from '@/components/Buttons';
import { CreateCardModal } from "@/components/CreateDeckModal";
import { ChevronRight } from 'lucide-react';

import Footer from "../../components/Footer";

const OneDeck = () => {
    const { title } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const exampleData = [
        { title: "¿Cómo se llama el nombre de la libreria..?", body: "React", cardType: "flashcard" },
        { title: "Mazo 2", body: "Tema: Historia Mundial", cardType: "flashcard" },
        { title: "Mazo 3", body: "Tema: Álgebra", cardType: "flashcard" },
        { title: "Mazo 4", body: "Tema: Álgebra", cardType: "flashcard" },
        { title: "Mazo 5", body: "Tema: Álgebra", cardType: "flashcard" },
    ];

    return (
        <>
            <NavbarLoginIn />
            <div className="w-full h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth"
                style={{
                    backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
                }}>
                <h1 className="mt-20 text-6xl font-bold text-darkSecondaryPurple">
                    {title || "Nombre de mazo"}
                </h1>
                <div className="flex flex-col justify-center items-center mt-10 w-10/12 h-full">
                    <p className="text-darkSecondaryPurple mt-2 text-3xl font-semibold">
                        Cartas del mazo:
                    </p>
                    <CardsTable data={exampleData} />
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

                        <ButtonCustom
                            type="button"
                            text="Siguiente"
                            onClick={() => console.log("Siguiente")}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#8C4FFF', '#8C4FFF']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#9625FF"
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
                <CreateCardModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={async (title, body) => {
                        console.log("Card created with title:", title, "and body:", body);
                        // Add your logic to handle card creation here
                    }}
                />
            )}
        </>
    )
}

export default OneDeck