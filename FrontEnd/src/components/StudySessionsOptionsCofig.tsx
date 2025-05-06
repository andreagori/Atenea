interface ModalProps {
  onClose: () => void;
}

export function StudySessionsOptionsConfig_Regular({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkComponent p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center">
          {/* Settings Form */}

          Configura tu sesión regular de estudio:
        </h2>
        <p className="mt-4">Ingresa el número de cartas a revisar en la sesión: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 99"
          min="1"
          max="99"
        />

        <p className="mt-4">Selecciona el tipo de cartas que deseas estudiar:</p>
        <select
          defaultValue="Tipo de cartas"
          className="select select-m select-primary w-full bg-darkComponentElement mt-3">
          <option disabled={true}>Tipo de cartas</option>
          <option>Repaso Activo</option>
          <option>Método de cornell</option>
          <option>Cartas visuales</option>
          <option>Todas las anteriores</option>
        </select>

        {/* Buttons Form */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-darkPrimary2 text-white rounded hover:bg-darkAccent hover:text-darkAccentText transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudySessionsOptionsConfig_Pomodoro({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkComponent p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center">
          Configura tu sesión pomodoro de estudio:
        </h2>
        <p className="mt-4">Ingresa el número de cartas a revisar en la sesión: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 99"
          min="1"
          max="99"
        />
        <p className="mt-4">Ingresa el número de minutos de estudio en la sesión: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />
        <p className="mt-4">Ingresa el número de minutos de descanso en la sesión: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />

        {/* Settings Form */}
        <p className="mt-4">Selecciona el tipo de cartas que deseas estudiar:</p>
        <select
          defaultValue="Tipo de cartas"
          className="select select-m select-primary w-full bg-darkComponentElement mt-3">
          <option disabled={true}>Tipo de cartas</option>
          <option>Repaso Activo</option>
          <option>Método de cornell</option>
          <option>Cartas visuales</option>
          <option>Todas las anteriores</option>
        </select>

        {/* Buttons Form */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-darkPrimary2 text-white rounded hover:bg-darkAccent hover:text-darkAccentText transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudySessionsOptionsConfig_SimulatedTests({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-primary backdrop-blur-sm bg-black/30">
      <div className="bg-darkComponent p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center">
          Configura tu sesión regular de estudio:
        </h2>
        <p className="mt-4">Ingresa el número de preguntas a revisar en la sesión: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 40"
          min="1"
          max="40"
        />
        <p className="mt-4">Ingresa el tiempo de la prueba: </p>
        <input
          className="input-primary input validator mt-3 w-full bg-darkComponentElement"
          type="number"
          placeholder="Debe ser un número entre 1 y 60"
          min="1"
          max="60"
        />

        {/* Settings Form */}
        <p className="mt-4">Selecciona el tipo de cartas que deseas estudiar:</p>
        <select
          defaultValue="Tipo de cartas"
          className="select select-m select-primary w-full bg-darkComponentElement mt-3">
          <option disabled={true}>Tipo de cartas</option>
          <option>Repaso Activo</option>
          <option>Método de cornell</option>
          <option>Cartas visuales</option>
          <option>Todas las anteriores</option>
        </select>

        {/* Buttons Form */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-darkPrimary2 text-white rounded hover:bg-darkAccent hover:text-darkAccentText transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}