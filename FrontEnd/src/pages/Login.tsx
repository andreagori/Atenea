import { NavbarForms } from "../components/Navbar";
import { FormLogin } from "../components/FormLoginRegister";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen overflow-hidden bg-darkBackground">
      {/* Encabezado con fondo distinto */}
      <NavbarForms />
      <h1 className="text-6xl mt-20 mb-8 text-darkBgText font-primary text-center">
        Comienza a estudiar
        <br />
        con nosotros
      </h1>
      <FormLogin />
      <div className="h-10"></div>
    </div>
  );
};

export default Login;