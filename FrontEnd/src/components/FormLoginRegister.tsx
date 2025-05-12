// Components for Login and Register forms.
import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useLogin } from "../hooks/useLogin";
import { ButtonCustom } from "./Buttons";

export function FormRegister() {
  // Logic to handle form submission and state management can be added here.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {register, message} = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    register(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="bg-darkSecondary2 rounded-lg shadow-lg w-4/12 font-primary mt-10">
      <div className="bg-darkPrimary2 rounded-t-lg p-4">
        <h2 className="text-2xl font-bold font-primary text-center text-white">
          Registro
        </h2>
      </div>

      {/* Contenido del formulario */}
      <div className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Campo de usuario */}
          <div className="flex items-start gap-2 w-full">
            <img
              src="/src/assets/userIconForms.svg"
              alt="User Icon"
              className="w-7 h-7 mt-7"
            />
            <div className="flex-1">
              <label
                htmlFor="username"
                className="block text-base font-bold text-darkComponent"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 h-8 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent"
                required
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="flex items-start gap-2 w-full">
            <img
              src="/src/assets/passwordIconForms.svg"
              alt="Password Icon"
              className="w-7 h-7 mt-7"
            />
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-base font-bold text-darkComponent"
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
          </div>

          {/* Mensaje */}
          {message && (
            <div className="text-sm text-center text-darkAccentText">
              {message}
            </div>
          )}

          {/* Botón */}
          <div className="flex justify-center">
            <ButtonCustom
              type="submit"
              text="Registro"
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="150px"
              height="35px"
            />
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
  const {login, message} = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    login(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="bg-darkSecondaryPurple rounded-lg shadow-lg w-4/12 font-primary mt-10">
      <div className="bg-darkPrimaryPurple rounded-t-lg p-4">
        <h2 className="text-2xl font-bold font-primary text-center text-white">
          Iniciar Sesión
        </h2>
      </div>

      {/* Contenido del formulario */}
      <div className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-start gap-2 w-full">
            <img
              src="/src/assets/userIconForms.svg"
              alt="User Icon"
              className="w-7 h-7 mt-7"
            />

            <div className="flex-1">
              <label
                htmlFor="username"
                className="block text-2m font-bold text-darkPrimaryPurple2 mb-1"
              >
                Ingresa un nombre de usuario:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 block w-full border border-darkAccentText bg-white text-darkAccentText rounded-md shadow-sm focus:ring-darkAccent focus:border-darkAccent px-2"
                required
              />
            </div>
          </div>

          {message && (
            <div className="text-sm text-center text-darkAccentText">
              {message}
            </div>
          )}
          <div className="flex items-start gap-2 w-full mt-4">
            <img
              src="/src/assets/passwordIconForms.svg"
              alt="Password Icon"
              className="w-7 h-7 mt-7"
            />
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-2m font-bold text-darkPrimaryPurple2 mb-1"
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
          </div>

          {/* Mensaje y botón separados del input */}
          {message && (
            <div className="text-sm text-center text-darkAccentText mt-2">
              {message}
            </div>
          )}

          <div className="flex justify-center">
            <ButtonCustom
              type="submit"
              text="Iniciar sesión"
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#8C4FFF', '#1700A4']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#8C4FFF"
              width="150px"
              height="35px"
            />
          </div>
        </form>
      </div >
    </div >
  );
}