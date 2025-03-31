import { useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre login y registro

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegister ? "Registro" : "Iniciar Sesión"}
        </h2>

        <form className="mt-4">
          {/* Nombre de Usuario */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre de Usuario
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usuario123"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        {/* Alternar entre Login y Registro */}
        <p className="mt-4 text-sm text-center">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Iniciar sesión" : "Registrarse"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;