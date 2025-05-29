import { Link } from "react-router-dom"
import SpotlightCard from "../libs/reactbits/SpotlightCard"
import { ButtonCustom } from "./Buttons"

function MazoSesionCardsHome() {
    return (
        <div className="w-full flex justify-center items-center font-primary">
            <div className="grid grid-cols-2 mt-2">
                {/* Primera carta, crear mazo */}
                <SpotlightCard className=""
                    enableSpotlight={false}
                    backgroundColor="var(--color-darkComponent2)"
                    withBorder={true}
                    borderColor="var(--color-lightComponent)">

                    <div className="flex flex-col text-darkComponentText">
                        <img src="../../createDeckIcon.svg" alt="Mazo" className="w-10 h-10 justify-start" />
                        <h2 className="text-5xl font-bold">Crear un mazo.</h2>
                        <p className="mt-2 mb-2 text-xl">
                            Crea un nuevo mazo de cartas para estudiar.
                        </p>
                        <Link to="/mazos"
                            className="flex justify-center items-center mt-9">
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
                                width="430px"
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

                    <div className="flex flex-col h-full text-white">
                        <img src="/../../studySessionIcon.svg" alt="Mazo" className="w-10 h-10 justify-start" />
                        <h2 className="text-5xl font-bold">Estudiar. </h2> <br />
                        <p className="mb-2 text-xl">
                            Inicia una sesión de estudio con cualquier mazo.
                        </p>
                        <Link to="/sesionesEstudio"
                            className="flex justify-center items-center mt-4">
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
                                width="430px"
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