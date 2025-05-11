import { Link } from "react-router-dom"
import SpotlightCard from "../libs/reactbits/SpotlightCard"
import { ButtonCustom } from "./Buttons"

function MazoSesionCardsHome() {
    return (
        <div className="w-full flex justify-center items-center font-primary">
            <div className="grid grid-cols-2 h-6/12 w-7/12 mt-5">
                {/* Primera carta, crear mazo */}

                <SpotlightCard className=""
                    enableSpotlight={false}
                    backgroundColor="var(--color-darkComponent2)"
                    withBorder={true}
                    borderColor="var(--color-lightComponent)">

                    <div className="flex flex-col h-full p-2 text-darkComponentText">
                        <img src="/src/assets/createDeckIcon.svg" alt="Mazo" className="w-10 h-10 justify-start mb-2" />
                        <h2 className="text-5xl font-bold">Crear un <br />Mazo.</h2>
                        <p className="mt-2 mb-2 text-xl">
                            Crea un nuevo mazo de cartas para estudiar.
                        </p>
                        <Link to="/mazos"
                            className="flex justify-center items-center mt-4 px-4 py-2">
                            <ButtonCustom
                                type="button"
                                text="Ir a crear mazo"
                                onClick={() => { }}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#95C4FF', '#205DAA']}
                                color="#fff"
                                hoverColor="#fff"
                                hoverBackground="#205DAA"
                                width="260px"
                                height="35px"
                            />
                        </Link>
                    </div>
                </SpotlightCard>


                {/* Segunda carta, Estudiar con sesión de estudio */}
                <SpotlightCard className=""
                    enableSpotlight={false}
                    backgroundColor="var(--color-darkComponent)"
                    withBorder={true}
                    borderColor="var(--color-white)">

                    <div className="flex flex-col h-full p-2 text-white">
                        <img src="/src/assets/studySessionIcon.svg" alt="Mazo" className="w-10 h-10 justify-start mb-2" />
                        <h2 className="text-5xl font-bold">Estudiar. </h2> <br />
                        <p className="mt-8 mb-2 text-xl">
                            Inicia una sesión de estudio con cualquier mazo.
                        </p>
                        <Link to="/sesionesEstudio"
                            className="flex justify-center items-center mt-4 px-4 py-2">
                            <ButtonCustom
                                type="button"
                                text="Ir a sesiones de estudio"
                                onClick={() => { }}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#6F8FFF', '#2E4080']}
                                color="#fff"
                                hoverColor="#fff"
                                hoverBackground="#2E4080"
                                width="260px"
                                height="35px"
                            />
                        </Link>
                    </div>
                </SpotlightCard>

            </div>
        </div>
    )
}

export default MazoSesionCardsHome