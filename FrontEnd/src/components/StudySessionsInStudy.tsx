interface StudySessionsRememberProps {
    currentCard?: {
        cardId: number;
        title: string;
        learningMethod: string;
        answer?: string;
        principalNote?: string;
        urlImage?: string;
        activeRecall?: {
            answer: string;
            questionTitle: string;
        };
        cornell?: {
            principalNote: string;
            noteQuestions: string;
            shortNote: string;
        };
        visualCard?: {
            urlImage: string;
        };
    };
    showAnswer: boolean;
}

export default function StudySessionsRemember({ currentCard, showAnswer }: StudySessionsRememberProps) {
    const renderAnswer = () => {
    if (!currentCard || !currentCard.learningMethod) {
        console.log('Invalid card data:', currentCard);
        return <p>No hay más cartas disponibles</p>;
    }

    console.log('Rendering answer for card:', currentCard);

    switch (currentCard.learningMethod.toLowerCase()) {
        case 'activerecall':
            return currentCard.activeRecall?.answer ? (
                <p className="text-lg text-white whitespace-pre-wrap">{currentCard.activeRecall.answer}</p>
            ) : <p>No hay respuesta disponible para Active Recall</p>;
        
        case 'cornell':
            return currentCard.cornell?.principalNote ? (
                <p className="text-lg text-white whitespace-pre-wrap">{currentCard.cornell.principalNote}</p>
            ) : <p>No hay nota principal disponible para Cornell</p>;
        
        case 'visualcard':
            return currentCard.visualCard?.urlImage ? (
                <img src={currentCard.visualCard.urlImage} alt="Visual card content" className="max-w-full h-auto" />
            ) : <p>No hay imagen disponible para Visual Card</p>;
        
        default:
            console.error('Método de aprendizaje no reconocido:', currentCard.learningMethod);
            return <p>Tipo de carta no soportado: {currentCard.learningMethod}</p>;
    }
};

    return (
        <div className="w-6/12 bg-darkComponentElement rounded-lg shadow-lg">
            {!showAnswer ? (
                <div className="flex flex-col items-center p-5">
                    <h2 className="text-xl font-bold text-center mt-5 mb-2 text-white">
                        Intenta recordar antes de mostrar la respuesta.
                    </h2>
                </div>
            ) : (
                <div className="p-5">
                    {renderAnswer()}
                </div>
            )}
        </div>
    );
}