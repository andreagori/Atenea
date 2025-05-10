import { NavbarForms } from "../components/Navbar";
import { FormRegister } from "../components/FormLoginRegister";

const Register = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-darkBackground overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>
      {/* Encabezado con fondo distinto */}
      <NavbarForms />
      <h1 className="text-5xl mt-20 mb-8 text-darkPSText font-primary text-center">
        Comienza a estudiar
        <br />
        con nosotros
      </h1>
      <FormRegister />
      <div className="h-10 mt-25"></div>
      <img
        src="./public/AteneaFullBlue.svg"
        alt="Atenea Logo"
        className="absolute bottom-0 left-0 w-1/4 h-1/4 mb-10 ml-10"
      />

    </div>
  );
}

export default Register;