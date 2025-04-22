// Components for Login and Register forms.

export function FormRegister() {
  return (
    <div className="bg-darkComponent rounded-lg shadow-lg w-96 font-primary">
        {/* Encabezado con fondo distinto */}
        <div className="bg-darkComponent2 rounded-t-lg p-4">
            <h2 className="text-2xl font-bold text-center text-darkBgText">
                Registro
                </h2>
        </div>

        {/* Contenido del formulario */}
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="username"
                id="username"
                className="mt-1 h-8 block w-full border border-darkAccentText bg-darkInfo text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Ingresa una contraseña:
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 h-8 block w-full border border-darkAccentText bg-darkInfo text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkPrimary2 text-white py-2 rounded-md hover:bg-darkSecondary/80 transition duration-200"
            >
              Registrarse
            </button>
          </form>
        </div>
    </div>
  )
}

export function FormLogin() {
    return (
    <div className="bg-darkComponent rounded-lg shadow-lg w-96">
        <div className="bg-darkComponent2 rounded-t-lg p-4">
            <h2 className="text-2xl font-bold font-primary text-center text-darkBgText">
                Iniciar Sesión
                </h2>
        </div>

        {/* Contenido del formulario */}
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="username"
                id="username"
                className="mt-1 h-8 block w-full border border-darkAccentText bg-darkInfo text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Ingresa una contraseña:
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 h-8 block w-full border border-darkAccentText bg-darkInfo text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkPrimary2 text-white py-2 rounded-md hover:bg-darkSecondary/80 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
    </div>
);
}