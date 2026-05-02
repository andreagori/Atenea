import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { API_CONFIG } from "../config";

export type AuthMessage = { kind: "success" | "error"; text: string } | null;

const extractServerMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  if (Array.isArray(msg)) return msg.filter(Boolean).join(" · ");
  if (typeof msg === "string") return msg;
  return null;
};

const networkErrorMessage =
  "No se pudo conectar al servidor. Verifica que el backend esté en línea.";

export function useLogin() {
  const [message, setMessage] = useState<AuthMessage>(null);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    setMessage(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          extractServerMessage(data) ?? "No se pudo iniciar sesión."
        );
      }

      const token = (data as { access_token?: string })?.access_token;
      if (!token) {
        throw new Error("Respuesta inválida del servidor.");
      }

      Cookies.set("auth_token", token, { expires: 1 });
      navigate("/inicio");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const text =
        error instanceof TypeError
          ? networkErrorMessage
          : error instanceof Error && error.message
            ? error.message
            : "Ocurrió un error inesperado.";
      setMessage({ kind: "error", text });
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
