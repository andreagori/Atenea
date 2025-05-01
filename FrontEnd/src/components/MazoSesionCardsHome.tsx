import SpotlightCard from "../libs/reactbits/SpotlightCard"

function MazoSesionCardsHome() {
  return (
    <div>
        <div className="grid grid-cols-2 mt-8">
            {/* Primera carta, crear mazo */}
            <SpotlightCard className=""
                enableSpotlight={false}
                backgroundColor="var(--color-darkComponent)"
                withBorder={true}
                borderColor="var(--color-darkAccent)">
                <div className="flex flex-col h-full p-4 text-darkNeutral">
                    <h2 className="text-4xl font-bold">Crear un <br />Mazo.</h2>
                    <p className="mt-2">Crea un nuevo mazo de tarjetas para estudiar.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Ir</button>
                </div>
            </SpotlightCard>
            {/* Segunda carta, Estudiar con sesión de estudio */}
            <SpotlightCard className=""
                enableSpotlight={false}
                backgroundColor="var(--color-darkNeutralText)"
                withBorder={true}
                borderColor="var(--color-white)">
                    
                <div className="flex flex-col justify-center h-full p-4 text-white">
                    <h2 className="text-4xl font-bold">Estudiar.</h2>
                    <p className="mt-2">Inicia una sesión de estudio con tus tarjetas.</p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Iniciar</button>
                </div>
            </SpotlightCard>
        </div>
    </div>
  )
}

export default MazoSesionCardsHome