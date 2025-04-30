// rafce to create page template
// Imports
import { NavbarLoginIn } from "../components/Navbar"

const HomeLoginIn = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBackground">
      <NavbarLoginIn />
      {/* Main Content */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-darkBgText">Bienvenido a Atenea</h1>
        <p className="text-lg text-darkBgText">Inicia sesión para continuar</p>
      </div>
      </div>
  )
}

export default HomeLoginIn