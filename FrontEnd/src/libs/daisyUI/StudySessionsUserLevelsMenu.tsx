interface StudySessionsUserLevelsMenuProps {
  onEvaluate: (evaluation: string) => Promise<void>;
}

const StudySessionsUserLevelsMenu: React.FC<StudySessionsUserLevelsMenuProps> = ({ onEvaluate }) => {
    return (
        <ul className="menu menu-horizontal bg-darkComponentElement text-white rounded-sm">
            <li className="hover:bg-red-600 hover:text-black rounded-sm">
                <a onClick={() => onEvaluate('dificil')}>Difícil</a>
            </li>
            <li className="hover:bg-orange-400 hover:text-black rounded-sm">
                <a onClick={() => onEvaluate('masomenos')}>Más o menos</a>
            </li>
            <li className="hover:bg-green-300 hover:text-black rounded-sm">
                <a onClick={() => onEvaluate('bien')}>Bien</a>
            </li>
            <li className="hover:bg-blue-600 hover:text-black rounded-sm">
                <a onClick={() => onEvaluate('facil')}>Fácil</a>
            </li>
        </ul>
    );
}

export default StudySessionsUserLevelsMenu