import { NavbarForms } from "../components/Navbar";
import { FormRegister } from "../components/FormLoginRegister";

const  Register  = () => {
    return (
    <div className="flex flex-col justify-center items-center h-screen bg-darkBackground">
        {/* Encabezado con fondo distinto */}
        <NavbarForms />
          <h1 className="text-6xl mt-3 mb-6 text-darkBgText font-primary text-center">
            Comienza a estudiar
            <br />
            con nosotros
          </h1>
          <FormRegister />
        </div>
    );
} 

export default Register;