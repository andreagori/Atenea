/*
Objective: Create a component to render the banner.Include on the bottom of the banner a button to 
redirect to the login and register page.
*/
import { Link } from "react-router-dom";

export default function Banner() {
    return (
        <div className="min-h-screen pt-22">
            <div className="flex flex-col items-center justify-center w-[95vw] h-[30vw] rounded-2xl bg-darkNeutral">
                <h1 className="text-4xl font-bold text-black mb-4">Bienvenido a Atenea</h1>
                <p className="text-lg text-black-300 mb-8">Tu plataforma de aprendizaje personalizada.</p>
                <div className="flex space-x-4">
                    <Link to="/login">
                        <button className="bg-darkPrimary text-white px-6 py-2 rounded hover:bg-darkAccent transition duration-300">
                            Iniciar Sesión
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="bg-darkSecondary text-white px-6 py-2 rounded hover:bg-darkAccent transition duration-300">
                            Registrarse
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}