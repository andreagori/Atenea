import { API_CONFIG } from "@/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type AuthMessage = { kind: "success" | "error"; text: string } | null;

/**
 * Normalize NestJS error payloads. ValidationPipe returns
 *   { statusCode, message: string[] | string, error }
 * — class-validator emits arrays when several rules fail. Joining with " · "
 * keeps multiple errors readable on a single banner.
 */
const extractServerMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  if (Array.isArray(msg)) return msg.filter(Boolean).join(" · ");
  if (typeof msg === "string") return msg;
  return null;
};

const networkErrorMessage =
  "No se pudo conectar al servidor. Verifica que el backend esté en línea.";

export function useRegister() {
  const [message, setMessage] = useState<AuthMessage>(null);
  const navigate = useNavigate();

  const register = async (username: string, password: string) => {
    setMessage(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          extractServerMessage(data) ?? "No se pudo crear la cuenta."
        );
      }

      setMessage({
        kind: "success",
        text: "Registro exitoso. Redirigiendo al inicio de sesión…",
      });
      setTimeout(() => navigate("/inicioSesion"), 1000);
    } catch (error: unknown) {
      console.error("Register error:", error);
      const text =
        error instanceof TypeError
          ? networkErrorMessage
          : error instanceof Error && error.message
            ? error.message
            : "Ocurrió un error inesperado.";
      setMessage({ kind: "error", text });
    }
  };

  return { register, message };
}
