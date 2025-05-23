import { NavbarStudySession } from "@/components/Navbar"
import StudySessionsRemember from "@/components/StudySessionsInStudy"
import StudySessionsUserLevelsMenu from "@/libs/daisyUI/StudySessionsUserLevelsMenu"

const RegularStudySession = () => {
    return (
        <div className="font-primary scroll-smooth scrollbar-hide bg-gradient-to-b from-darkBackground via-darkGradientBlueText to-darkPrimary text-white">
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                <h1 className="text-4xl font-semibold text-center mt-25 mb-20">
                    Titulo de la carta
                </h1>
                {/* Here put the component of remember the message and the if the state changes with a click, show the user's answer */}
                <StudySessionsRemember />
                <div className="flex flex-col items-center">
                    <button className="btn btn-primary mt-30">Mostrar respuesta</button>
                </div>
                <div className="flex flex-col items-center mt-10">
                    <StudySessionsUserLevelsMenu />
                </div>
                {/* The distance of the menu being mt-40 <StudySessionsUserLevelsMenu />*/}
                
            </div>
        </div>
    )
}

export default RegularStudySession


// import StudySessionsUserLevelsMenu from "@/libs/daisyUI/StudySessionsUserLevelsMenu"