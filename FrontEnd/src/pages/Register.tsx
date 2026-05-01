import {
  AuthShowcasePanel,
  AuthFormShell,
  RegisterForm,
  MiniDeckLibraryCard,
} from "@/components/auth";

const Register = () => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-v2-bg">
    <AuthShowcasePanel
      eyebrow="Primeros pasos"
      title={
        <>
          Tres tipos de carta.
          <br />
          Un <em>mazo</em>.
        </>
      }
      description="Repaso activo para preguntas, Cornell para temas complejos, visual para diagramas. Crea tu primer mazo en minutos."
    >
      <MiniDeckLibraryCard />
    </AuthShowcasePanel>
    <AuthFormShell
      topPrompt={{
        text: "¿Ya tienes cuenta?",
        cta: "Inicia sesión",
        to: "/inicioSesion",
      }}
      eyebrow="Crear cuenta"
      title={
        <>
          Empieza tu
          <br />
          primer <em>mazo</em>.
        </>
      }
      subtitle="Tres minutos para crear tu cuenta. Después, tus mazos te esperan."
    >
      <RegisterForm />
    </AuthFormShell>
  </div>
);

export default Register;
