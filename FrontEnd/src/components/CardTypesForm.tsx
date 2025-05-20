import { CreateCardPayload } from "@/types/card.types";


interface CardFormProps {
    onChange: (data: Partial<CreateCardPayload>) => void;
    data: CreateCardPayload;
    isEditing?: boolean;
}

export function ActiveRecall({ onChange, data }: CardFormProps) {
    return (
        <div className="font-primary text-white">
            <label className="block text-m mb-1 font-semibold">
                Título/Pregunta:
            </label>
            <input 
                className="w-full bg-darkInfo h-10 rounded p-2 text-darkPrimaryPurple2"
                value={data.title || data.questionTitle || ''}
                onChange={(e) => onChange({ 
                    title: e.target.value,
                    questionTitle: e.target.value, // Mantener sincronizados
                    learningMethod: 'activeRecall'
                })}
                placeholder="Escribe tu pregunta aquí"
            />

            <label className="block text-m mb-1 mt-2 font-semibold">
                Respuesta:
            </label>
            <textarea 
                className="w-full bg-darkInfo h-24 rounded p-2 text-darkPrimaryPurple2"
                value={data.answer || ''}
                onChange={(e) => onChange({ answer: e.target.value })}
                placeholder="Escribe la respuesta aquí"
            />
        </div>
    );
}


export function CornellMethod({ onChange, data }: CardFormProps) {
    return (
        <div className="font-primary font-semibold text-white">
            <label className="block text-sm mb-2">Titulo:</label>
            <input 
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.title || ''}
                onChange={(e) => onChange({ 
                    title: e.target.value,
                    learningMethod: 'cornell'
                })}
            />
            <label className="block text-sm mb-2">Nota principal:</label>
            <textarea 
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.principalNote || ''}
                onChange={(e) => onChange({ principalNote: e.target.value })}
            />
            <label className="block text-sm mb-2">Preguntas de la nota:</label>
            <textarea 
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.noteQuestions || ''}
                onChange={(e) => onChange({ noteQuestions: e.target.value })}
            />
            <label className="block text-sm mb-2">Nota corta:</label>
            <textarea 
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.shortNote || ''}
                onChange={(e) => onChange({ shortNote: e.target.value })}
            />
        </div>
    );
}

export function VisualCard({ onChange, data }: CardFormProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Handle file upload logic here
            onChange({ 
                urlImage: URL.createObjectURL(file),
                learningMethod: 'visualCard'
            });
        }
    };

    return (
        <div className="font-primary text-white">
            <label className="block text-m mb-1 font-semibold">
                Titulo:
            </label>
            <textarea 
                className="w-full text-darkPrimaryPurple2 bg-darkInfo h-24 rounded p-2"
                value={data.title || ''}
                onChange={(e) => onChange({ title: e.target.value })}
            />
            <label className="block text-m mb-1 font-semibold">
                Seleccionar imagen:
            </label>
            <input 
                className="w-full p-2 rounded text-darkPrimaryPurple2 font-semibold bg-darkInfo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
}