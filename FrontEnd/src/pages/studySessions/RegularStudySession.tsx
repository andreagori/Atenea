import { NavbarStudySession } from "@/components/Navbar"

const RegularStudySession = () => {
    return (
        <div className="font-primary scroll-smooth scrollbar-hide bg-lightNeutral text-lightNeutralText">
            <NavbarStudySession />
            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                <h1 className="text-4xl font-bold text-center mt-25 mb-10">
                    Titulo de la carta
                </h1>

                {/* Here put the component of remember the message and the if the state changes with a click, show the user's answer */}
                
                <div className="flex flex-col items-center">
                    <button className="btn btn-primary mt-40">Mostrar respuesta</button>
                </div>
                {/* The distance of the menu being mt-40 <StudySessionsUserLevelsMenu />*/}
                
            </div>
        </div>
    )
}

export default RegularStudySession


// import StudySessionsUserLevelsMenu from "@/libs/daisyUI/StudySessionsUserLevelsMenu"