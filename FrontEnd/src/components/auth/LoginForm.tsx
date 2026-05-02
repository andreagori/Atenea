import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui";
import { useLogin } from "@/hooks/useLogin";
import { cn } from "@/lib/utils";
import { PasswordInput } from "./PasswordInput";

interface FieldErrors {
  username?: string;
  password?: string;
}

const FieldLabel = ({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="block font-v2-mono text-xs tracking-[1.2px] uppercase text-v2-ink-3 mb-2 font-medium"
  >
    {children}
  </label>
);

const FieldError = ({ children }: { children: ReactNode }) => (
  <p className="text-xs text-v2-coral mt-1.5 m-0">{children}</p>
);

// Mirrors BackEnd/src/auth/dto/sign-up.dto.ts limits so any account that
// could exist on the server passes these checks.
const validate = (username: string, password: string): FieldErrors => {
  const errs: FieldErrors = {};
  if (username.length === 0) errs.username = "Ingresa tu usuario.";
  if (password.length === 0) errs.password = "Ingresa tu contraseña.";
  return errs;
};

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { login, message } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(username, password);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await login(username, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <FieldLabel htmlFor="login-username">Usuario</FieldLabel>
        <Input
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((p) => ({ ...p, username: undefined }));
          }}
          placeholder="tu usuario"
          autoComplete="username"
          className="py-[14px] text-[15px] border-[1.5px]"
          required
        />
        {errors.username && <FieldError>{errors.username}</FieldError>}
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
          }}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      {message && (
        <div
          role={message.kind === "error" ? "alert" : "status"}
          className={cn(
            "mb-4 text-[13px] px-4 py-2.5 rounded-v2-sm border",
            message.kind === "error"
              ? "text-v2-coral bg-v2-coral/[0.08] border-v2-coral/20"
              : "text-v2-primary-deep bg-v2-primary-pale border-v2-primary-tint/40"
          )}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 text-[15px] font-medium rounded-v2-sm bg-v2-primary text-white border-none transition-all duration-150 hover:bg-v2-primary-deep hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {submitting ? "Entrando…" : "Entrar a Atenea →"}
      </button>
    </form>
  );
};
