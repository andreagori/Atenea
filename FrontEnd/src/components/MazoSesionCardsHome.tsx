import SpotlightCard from "../libs/reactbits/SpotlightCard"

function MazoSesionCardsHome() {
    return (
        <div className="w-full flex justify-center items-center font-primary">
            <div className="grid grid-cols-2 h-7/12 w-7/12 mt-5">
                {/* Primera carta, crear mazo */}

                <SpotlightCard className=""
                    enableSpotlight={false}
                    backgroundColor="var(--color-darkComponentElement)"
                    withBorder={true}
                    borderColor="var(--color-darkAccent)">

                    <div className="flex flex-col h-full p-2 text-darkNeutral">
                        <h2 className="text-5xl font-bold">Crear un <br />Mazo.</h2>
                        <p className="mt-2 mb-2 text-xl">
                            Crea un nuevo mazo de cartas para estudiar.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-gradient-to-b from-darkCustomEnd1 to-darkCustomStart1 text-darkPrimary rounded hover:from-darkNeutral hover:to-darkSecondary transition duration-300">
                            Ir
                        </button>
                    </div>
                </SpotlightCard>


                {/* Segunda carta, Estudiar con sesión de estudio */}
                <SpotlightCard className=""
                    enableSpotlight={false}
                    backgroundColor="var(--color-darkNeutralText)"
                    withBorder={true}
                    borderColor="var(--color-white)">

                    <div className="flex flex-col h-full p-2 text-white">
                        <h2 className="text-5xl font-bold">Estudiar. </h2> <br />
                        <p className="mt-8 mb-2 text-xl">
                            Inicia una sesión de estudio con cualquier mazo.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-gradient-to-b from-darkCustomEnd2 to-darkCustomStart2 text-darkPrimary rounded hover:from-darkAccent hover:to-darkSecondary transition duration-300">
                            Ir
                        </button>
                    </div>
                </SpotlightCard>

            </div>
        </div>
    )
}

export default MazoSesionCardsHome