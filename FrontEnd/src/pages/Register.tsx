import { NavbarForms } from "../components/Navbar";
import { FormRegister } from "../components/FormLoginRegister";

const Register = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-darkBackground overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>
      <NavbarForms />
      <div className="h-12/12 w-10/12 mt-25">
      <FormRegister />
      </div>
      <img
        src="./AteneaFullBlue.svg"
        alt="Atenea Logo"
        className="absolute bottom-0 left-0 w-1/4 h-1/4 mb-10 ml-10"
      />

    </div>
  );
}

export default Register;