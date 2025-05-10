import { Link } from "react-router-dom";
import GridMotionBanner from "./GridMotionBanner";
import { ButtonCustom } from "./Buttons";

export default function Banner() {
    return (
        <section id="banner" className="h-screen w-full flex flex-col items-center font-primary">
            <div className="">
                <div className="relative flex flex-col items-center justify-center rounded-2xl bg-darkAccent overflow-hidden">
                    <GridMotionBanner />
                    <div className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#010515] to-[#061D7B] opacity-40 z-10"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <h1 className="text-7xl font-bold text-darkBgText mb-1 text-shadow-strong">Bienvenido a Atenea</h1>
                        <p className="text-3xl text-darkBgText mb-4 text-shadow-strong">Tu plataforma de aprendizaje personalizada.</p>
                        <div className="flex space-x-4">
                            <Link to="/inicioSesion">
                                <ButtonCustom
                                    text="Iniciar Sesión"
                                    onClick={() => { }}
                                    isGradient={true}
                                    gradientDirection="to bottom"
                                    gradientColors={['#9625FF', '#1700A4']}
                                    color="#fff"
                                    hoverColor="#fff"
                                    hoverBackground="#9625FF"
                                    width="150px"
                                    height="35px"
                                />
                            </Link>
                            <Link to="/registro">
                                <ButtonCustom
                                    text="Registro"
                                    onClick={() => { }}
                                    isGradient={true}
                                    gradientDirection="to bottom"
                                    gradientColors={['#0C3BEB', '#1A368B']}
                                    color="#fff"
                                    hoverColor="#fff"
                                    hoverBackground="#00f"
                                    width="150px"
                                    height="35px"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}