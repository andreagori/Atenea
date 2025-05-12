import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export function useLogin() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
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
            // save the token in cookies
            Cookies.set("auth_token", data.access_token, { expires: 1 }); // expires in 1 day

            setMessage("Inicio de sesión exitoso.");
            navigate("/inicio");
        } catch (error: any) {
            console.error("Error:", error);
            setMessage("Error en el inicio de sesión. Inténtalo de nuevo.");
        }
    };

    return { login, message };
}

export function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("auth_token");
    navigate("/");
  };

  return { logout };
}
