import { NavbarLoginIn } from "../../components/Navbar"
import SelectDecksStudySession from "../../libs/daisyUI/SelectDecksStudySession"
import StudySessionsOptions from "../../components/StudySessionsOptions"

const sesionEstudio = () => {
  return (
    <div>
      <NavbarLoginIn />
      <div className="w-full min-h-screen bg-darkBackground flex flex-col items-center mt-25 font-primary overflow-x-hidden">
        <h1 className="text-5xl font-bold text-lightComponent mb-8 flex items-center justify-center text-center">
          SESIÓN DE
          <br />
          ESTUDIO
        </h1>
        <SelectDecksStudySession />
        <StudySessionsOptions />
      </div>
    </div>
  )
}

export default sesionEstudio