import { NavbarForms } from "../components/Navbar";
import { FormLogin } from "../components/FormLoginRegister";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-darkBackground">
      {/* Encabezado con fondo distinto */}
      <NavbarForms />
      <h1 className="text-6xl mt-3 mb-6 text-darkBgText font-primary text-center">
        Comienza a estudiar
        <br />
        con nosotros
      </h1>
      <FormLogin />
    </div>
  );
};

export default Login;