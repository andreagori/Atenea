// Components for Login and Register forms.
import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { useLogin } from "../hooks/useLogin";
import { ButtonCustom } from "./Buttons";

export function FormRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });
  const { register, message } = useRegister();

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
      confirmPassword: ""
    };

    if (username.length < 3) {
      newErrors.username = "El usuario debe tener al menos 3 caracteres";
    }

    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    register(username, password);
    if (!message) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ username: "", password: "", confirmPassword: "" });
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  return (
    <div className="bg-darkSecondary2 rounded-2xl shadow-2xl w-full h-10/12 max-w-md mx-auto font-primary flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C3BEB] to-[#1A368B] rounded-t-2xl p-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-center text-white">
          Crear Cuenta
        </h2>
        <p className="text-blue-100 text-center mt-1 text-xs">
          Únete a nuestra plataforma de aprendizaje
        </p>
      </div>

      {/* Form Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        <form className="space-y-3 h-full flex flex-col" onSubmit={handleSubmit}>

          {/* Campo de usuario */}
          <div className="space-y-1">
            <label htmlFor="username" className="block text-xs font-semibold text-darkComponent">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className={`block w-full pl-8 pr-3 py-2 text-sm border rounded-lg bg-white text-darkAccentText shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.username 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold text-darkComponent">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`block w-full pl-8 pr-10 py-2 text-sm border rounded-lg bg-white text-darkAccentText shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Campo de confirmar contraseña */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-darkComponent">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`block w-full pl-8 pr-10 py-2 text-sm border rounded-lg bg-white text-darkAccentText shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Confirma tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Mensaje del sistema */}
          {message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <p className="text-blue-800 text-xs text-center">{message}</p>
            </div>
          )}

          {/* Spacer para empujar el botón hacia abajo */}
          <div className="flex-1"></div>

          {/* Botón */}
          <div className="pt-2 flex-shrink-0">
            <ButtonCustom
              type="submit"
              text="Crear cuenta"
              onClick={() => { }}
              isGradient={true}
              gradientDirection="to bottom"
              gradientColors={['#0C3BEB', '#1A368B']}
              color="#fff"
              hoverColor="#fff"
              hoverBackground="#0C3BEB"
              width="100%"
              height="40px"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });
  const { login, message } = useLogin();

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: ""
    };

    if (username.length < 3) {
      newErrors.username = "El usuario debe tener al menos 3 caracteres";
    }

    if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    login(username, password);
    if (!message) {
      setUsername("");
      setPassword("");
      setErrors({ username: "", password: "" });
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: "" }));
    }
  };

  return (
    <div className="bg-darkSecondaryPurple rounded-2xl shadow-2xl w-full h-10/12 max-w-md mx-auto font-primary flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8C4FFF] to-[#1700A4] rounded-t-2xl p-4 flex-shrink-0">
        <h2 className="text-2xl font-bold text-center text-white">
          Iniciar Sesión
        </h2>
        <p className="text-purple-100 text-center mt-1 text-xs">
          Accede a tu cuenta de aprendizaje
        </p>
      </div>

      {/* Form Content */}
      <div className="p-4 flex-1 overflow-y-auto">
        <form className="space-y-3 h-full flex flex-col" onSubmit={handleSubmit}>

          {/* Campo de usuario */}
          <div className="space-y-1">
            <label htmlFor="username" className="block text-xs font-semibold text-darkPrimaryPurple2">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleUsernameChange}
                className={`block w-full pl-8 pr-3 py-2 text-sm border rounded-lg bg-white text-darkAccentText shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.username 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold text-darkPrimaryPurple2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`block w-full pl-8 pr-10 py-2 text-sm border rounded-lg bg-white text-darkAccentText shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Mensaje del sistema */}
          {message && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <p className="text-purple-800 text-xs text-center">{message}</p>
            </div>
          )}

          {/* Spacer para empujar el botón hacia abajo */}
          <div className="flex-1"></div>

          {/* Botón */}
          <div className="pt-2 flex-shrink-0">
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
              width="100%"
              height="40px"
            />
          </div>
        </form>
      </div>
    </div>
  );
}