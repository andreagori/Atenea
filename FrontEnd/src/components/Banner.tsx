/*
Objective: Create a component to render the banner.Include on the bottom of the banner a button to 
redirect to the login and register page.
*/
import { Link } from "react-router-dom";
import GridMotionBanner from "./GridMotionBanner";

export default function Banner() {
    return (
        <div className="h-screen w-full flex flex-col items-center pt-22 font-primary">
            <div className="">
                <div className="relative flex flex-col items-center justify-center w-[95vw] h-[30vw] rounded-2xl bg-darkAccent overflow-hidden">
                    <GridMotionBanner />
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <h1 className="text-4xl font-bold text-darkBgText mb-1 text-shadow-strong">Bienvenido a Atenea</h1>
                        <p className="text-lg text-darkBgText mb-4 text-shadow-strong">Tu plataforma de aprendizaje personalizada.</p>
                        <div className="flex space-x-4">
                            <Link to="/inicioSesion">
                                <button className="bg-gradient-to-b from-darkPrimary to-darkPrimary2 text-white px-6 py-2 rounded hover:from-darkPrimary2 hover:to-darkPrimary transition duration-300">
                                    Iniciar Sesión
                                </button>
                            </Link>
                            <Link to="/registro">
                                <button className="bg-gradient-to-b from-darkSecondary to-darkPrimary2 text-white px-6 py-2 rounded hover:from-darkPrimary2 hover:to-darkSecondary transition duration-300">
                                    Registro
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}