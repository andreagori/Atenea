import { NavbarLoginIn } from "../../components/Navbar"
import { DecksTable } from "../../libs/daisyUI/DeckTables"
import Footer from "../../components/Footer";
import FormCreateDeck from "../../components/FormCreateDeck";

const MisMazos = () => {
    const exampleData = [
        { title: "Mazo 1", body: "Tema: Biología" },
        { title: "Mazo 2", body: "Tema: Historia Mundial" },
        { title: "Mazo 3", body: "Tema: Álgebra" },
    ];


    return (
        <>
            <NavbarLoginIn />
            <div className="w-full min-h-screen flex bg-darkBackground font-primary flex-col items-center overflow-y-auto scrollbar-hide scroll-smooth">
                <h1 className="mt-20 text-6xl font-bold text-lightComponent">
                    MIS MAZOS
                </h1>
                <p className="text-lightComponent mt-2 text-xl">
                    Selecciona el mazo para editarlo o acceder a las cartas
                </p>
                <div className="flex flex-col justify-center items-center mt-10 w-10/12 h-11/12">
                    <DecksTable data={exampleData} />
                </div>
                <h1 className="mt-20 text-6xl font-bold text-lightComponent">
                    CREAR MAZO
                </h1>
                <div className="flex flex-col justify-center items-center mt-2 w-12/12 h-11/12">
                    <FormCreateDeck />
                </div>
                <footer className="w-full mt-10">
                    <Footer />
                </footer>
            </div>
        </>
    )
}

export default MisMazos