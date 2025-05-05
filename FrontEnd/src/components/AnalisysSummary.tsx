function ResumenAnalisis() {
    return (
        <>
            <div className="mt-5 w-10/12 h-full rounded-2xl bg-darkInfo font-primary">
                <h1 className="text-2xl text-darkInfoText font-bold mt-2 ml-4">
                    Último análisis de resultados
                </h1>
                <div className="h-11/12">
                    <p className="text-lg text-darkInfoText mt-4 ml-4">
                        Aquí puedes ver un resumen de tu progreso y rendimiento en el uso de la aplicación.
                        Analiza tus hábitos de estudio y mejora tu aprendizaje.
                    </p>
                    <div className="flex justify-end mt-4 mr-4">
                        <button className="px-4 py-2 mb-5 bg-gradient-to-b from-darkCustomEnd3 to-darkSecondary text-white rounded hover:from-darkAccent hover:to-darkSecondary transition duration-300">
                            Ver análisis completo
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResumenAnalisis