import GradientText from "@/libs/reactbits/GradientText"
import SpotlightCard from "@/libs/reactbits/SpotlightCard"

function CardsTypesStart() {
    return (
        <section
            id="tiposCartas"
            className="w-full h-screen px-6 flex flex-col items-center font-primary"
            style={{
                backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
            }}
        >
            <GradientText
                colors={["#75CDF8", "#027CE6", "#002FE1", "#75CDF8", "#027CE6", "#002FE1", "#75CDF8"]}
                animationSpeed={6}
                showBorder={false}
                className="text-7xl font-bold text-center mb-5 mt-15"
            >
                Tipos de cartas
            </GradientText>
            <p className='text-white text-2xl font-bold mb-5 text-center'>
                Estos son los tipos de carta que puedes crear para cada mazo
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {[
                    {
                        title: "Repaso activo",
                        text: "Se compone por un titulo  y una descripción.",
                        backgroundColor: "#027CE6",
                    },
                    {
                        title: "Método de cornell",
                        text: "Se compone por un titulo, una nota principal, una nota corta y preguntas sobre el tema.",
                        backgroundColor: "#5311F8",
                    },
                    {
                        title: "Cartas visuales",
                        text: "Se compone por un titulo, y esta, a diferencias de las demás, le permite al usuario agregar una imagen.",
                        backgroundColor: "#002FE1",
                    },
                ].map(({ title, text, backgroundColor }, index) => (
                    <SpotlightCard
                        key={index}
                        className="aspect-[11/12] max-w-[300px] justify-between overflow-hidden"
                        withBorder={true}
                        spotlightColor="var(--color-white)"
                        backgroundColor={backgroundColor}
                        borderColor="var(--color-white)"
                    >
                        <h3 className="text-white text-2xl font-bold mb-3">
                            {title}
                        </h3>
                        <p className="text-white text-xl line-clamp-5">
                            {text}
                        </p>
                    </SpotlightCard>
                ))}
            </div>
        </section>
    )
}

export default CardsTypesStart