// Component to display the user levels in the study sessions menu

function StudySessionsUserLevelsMenu() {
    return (

        <ul className="menu menu-horizontal bg-darkComponentElement text-white rounded-sm">
            <li className="hover:bg-red-600 hover:text-black rounded-sm"><a>Dificil</a></li>
            <li className="hover:bg-orange-400 hover:text-black rounded-sm"><a>Más o menos</a></li>
            <li className="hover:bg-green-300 hover:text-black rounded-sm"><a>Bien</a></li>
            <li className="hover:bg-blue-600 hover:text-black rounded-sm"><a>Fácil</a></li>
        </ul>
    )
}

export default StudySessionsUserLevelsMenu