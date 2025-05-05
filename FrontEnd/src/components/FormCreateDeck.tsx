
function FormCreateDeck() {
  return (
    <div className="bg-darkInfo rounded-lg shadow-lg w-7/12 font-primary mt-10">
      <>
      </>

      {/* Contenido del formulario */}
      <div className="p-8">
        <form className="space-y-6">
          <div className="flex items-start gap-2 w-full">

            <div className="flex-1">
              <label
                className="block text-xl font-bold text-darkPrimary mb-1"
              >
                Ingresa el nombre del mazo:
              </label>
              <input
                className="h-9 block w-full border border-darkPrimary bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent px-2"
                required
              />
            </div>
          </div>

          <div className="flex items-start gap-2 w-full mt-4">
            <div className="flex-1">
              <label
                className="block text-xl font-bold text-darkPrimary mb-1"
              >
                Descripción:
              </label>
              <input
                className="mt-1 h-9 block w-full border border-darkPrimary bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent px-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-40 bg-gradient-to-b from-darkSecondary to-darkPrimary2 text-white px-6 py-2 rounded hover:from-darkPrimary2 hover:to-darkSecondary transition duration-300"
            >
              Crear
            </button>
          </div>
        </form>
      </div >
    </div >
  )
}

export default FormCreateDeck