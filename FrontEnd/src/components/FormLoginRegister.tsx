// Components for Login and Register forms.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function FormRegister() {
// Logic to handle form submission and state management can be added here.
const navigate = useNavigate();
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Logic to send data to the backend
    try {
        const response = await fetch("http://localhost:3000/auth/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en el registro");
        }

        setMessage("Registro exitoso. Puedes iniciar sesión ahora.");
        setUsername("");
        setPassword("");
        setTimeout(() => navigate("/login"), 1000); // redirige a login
    } catch (error: any) {
        console.error("Error:", error);
        setMessage("Error en el registro. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="bg-darkInfo rounded-lg shadow-lg w-96 font-primary">
        {/* Encabezado con fondo distinto */}
        <div className="bg-darkAccent rounded-t-lg p-4">
            <h2 className="text-2xl font-bold text-center text-darkInfoText">
                Registro
                </h2>
        </div>

        {/* Contenido del formulario */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-darkInfoText"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 h-8 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-darkInfoText"
              >
                Ingresa una contraseña:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-8 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            {message && (
              <div className="text-sm text-center text-darkAccentText">
                {message}
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 bg-gradient-to-b from-darkSecondary to-darkPrimary2 text-white px-6 py-2 rounded hover:from-darkPrimary2 hover:to-darkSecondary transition duration-300"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
    </div>
  )
}

export function FormLogin() {
// Logic to handle form submission and state management can be added here.
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to send data to the backend
    try {
        const response = await fetch("http://localhost:3000/auth/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error en el inicio de sesión");
        }

        setMessage("Inicio de sesión exitoso.");
        setUsername("");
        setPassword("");
        setTimeout(() => navigate("/HomeLoginIn"), 1000); // redirige a home
    } catch (error: any) {
        console.error("Error:", error);
        setMessage("Error en el inicio de sesión. Inténtalo de nuevo.");
    }
  }


    return (
    <div className="bg-darkInfo rounded-lg shadow-lg w-96">
        <div className="bg-darkAccent rounded-t-lg p-4">
            <h2 className="text-2xl font-bold font-primary text-center text-darkInfoText">
                Iniciar Sesión
                </h2>
        </div>

        {/* Contenido del formulario */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-darkInfoText"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 h-8 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            {message && (
              <div className="text-sm text-center text-darkAccentText">
                {message}
              </div>
            )}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-darkInfoText"
              >
                Ingresa una contraseña:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 h-8 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
            {message && (
              <div className="text-sm text-center text-darkAccentText">
                {message}
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 bg-gradient-to-b from-darkSecondary to-darkPrimary2 text-white px-6 py-2 rounded hover:from-darkPrimary2 hover:to-darkSecondary transition duration-300"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
    </div>
);
}