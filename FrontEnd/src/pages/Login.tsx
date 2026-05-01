import {
  AuthShowcasePanel,
  AuthFormShell,
  LoginForm,
  MiniDashboardCard,
} from "@/components/auth";

const Login = () => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr] bg-v2-bg">
    <AuthShowcasePanel
      eyebrow="Tu progreso"
      title={
        <>
          Tus sesiones,
          <br />
          en <em>contexto</em>.
        </>
      }
      description="El sistema agrupa tus sesiones reales en gráficos honestos — sin algoritmos opacos. Tú decides qué cambiar."
    >
      <MiniDashboardCard />
    </AuthShowcasePanel>
    <AuthFormShell
      topPrompt={{ text: "¿No tienes cuenta?", cta: "Crea una", to: "/registro" }}
      eyebrow="Iniciar sesión"
      title={
        <>
          Bienvenido
          <br />
          de <em>vuelta</em>.
        </>
      }
      subtitle="Ingresa para continuar con tus mazos y sesiones."
    >
      <LoginForm />
    </AuthFormShell>
  </div>
);

export default Login;
