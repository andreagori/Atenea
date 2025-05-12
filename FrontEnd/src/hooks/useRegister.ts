import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useRegister() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = async (username: string, password: string) => {
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
      setTimeout(() => navigate("/inicioSesion"), 1000);
    } catch (error: any) {
      console.error("Error:", error);
      setMessage("Error en el registro. Inténtalo de nuevo.");
    }
  };

  return { register, message };
}
