import { NavbarForms } from "../components/Navbar";
import { FormLogin } from "../components/FormLoginRegister";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-hidden bg-darkBackground relative"
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>
z
      <NavbarForms />
      <h1 className="text-5xl mt-20 mb-8 text-darkSecondaryPurple font-primary text-center">
        Sigue estudiando
        <br />
        con nosotros
      </h1>
      <FormLogin />
      <div className="h-10 mt-25"></div>
      <img
        src="./AteneaFullPurple.svg"
        alt="Atenea Logo"
        className="absolute bottom-0 left-0 w-1/4 h-1/4 mb-10 ml-10"
      />
    </div>
  );
};

export default Login;