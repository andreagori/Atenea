import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui";
import { useRegister } from "@/hooks/useRegister";
import { PasswordInput } from "./PasswordInput";

interface FieldErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const FieldLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label
    htmlFor={htmlFor}
    className="block font-v2-mono text-xs tracking-[1.2px] uppercase text-v2-ink-3 mb-2 font-medium"
  >
    {children}
  </label>
);

const FieldError = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-v2-coral mt-1.5 m-0">{children}</p>
);

const validate = (
  username: string,
  password: string,
  confirmPassword: string
): FieldErrors => {
  const errs: FieldErrors = {};
  if (username.length < 3)
    errs.username = "El usuario debe tener al menos 3 caracteres";
  if (username.length > 20)
    errs.username = "El usuario no puede tener más de 20 caracteres";
  if (password.length < 6)
    errs.password = "La contraseña debe tener al menos 6 caracteres";
  if (password !== confirmPassword)
    errs.confirmPassword = "Las contraseñas no coinciden";
  return errs;
};

export const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { register, message } = useRegister();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(username, password, confirmPassword);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await register(username, password);
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = (key: keyof FieldErrors) => {
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <FieldLabel htmlFor="reg-username">Usuario</FieldLabel>
        <Input
          id="reg-username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            clearError("username");
          }}
          placeholder="3 a 20 caracteres"
          autoComplete="username"
          maxLength={20}
          className="py-[14px] text-[15px] border-[1.5px]"
          required
        />
        {errors.username && <FieldError>{errors.username}</FieldError>}
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="reg-password">Contraseña</FieldLabel>
        <PasswordInput
          id="reg-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
            if (confirmPassword) clearError("confirmPassword");
          }}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          required
        />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </div>

      <div className="mb-4">
        <FieldLabel htmlFor="reg-confirm">Confirmar contraseña</FieldLabel>
        <PasswordInput
          id="reg-confirm"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearError("confirmPassword");
          }}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          required
        />
        {errors.confirmPassword && (
          <FieldError>{errors.confirmPassword}</FieldError>
        )}
      </div>

      {message && (
        <div className="mb-4 text-[13px] text-v2-ink-2 px-4 py-2.5 rounded-v2-sm bg-v2-primary-pale">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 text-[15px] font-medium rounded-v2-sm bg-v2-primary text-white border-none transition-all duration-150 hover:bg-v2-primary-deep hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {submitting ? "Creando cuenta…" : "Crear mi cuenta →"}
      </button>
    </form>
  );
};
