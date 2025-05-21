import { CreateCardPayload } from "@/types/card.types";
import { useState } from "react";


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
                placeholder="Escribe el título de la carta"
            />
            <label className="block text-sm mb-2">Nota principal:</label>
            <textarea
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.principalNote || ''}
                onChange={(e) => onChange({ principalNote: e.target.value })}
                placeholder="Escribe la nota principal aquí"
            />
            <label className="block text-sm mb-2">Preguntas de la nota:</label>
            <textarea
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.noteQuestions || ''}
                onChange={(e) => onChange({ noteQuestions: e.target.value })}
                placeholder="Escribe las preguntas de la nota aquí"
            />
            <label className="block text-sm mb-2">Nota corta:</label>
            <textarea
                className="w-full p-2 rounded text-darkPrimaryPurple2 bg-darkInfo mb-2"
                value={data.shortNote || ''}
                onChange={(e) => onChange({ shortNote: e.target.value })}
                placeholder="Escribe la nota corta aquí"
            />
        </div>
    );
}

export function VisualCard({ onChange, data, isEditing }: CardFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string>(data.urlImage || '');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo y tamaño de archivo
            if (!file.type.startsWith('image/')) {
                alert('El archivo debe ser una imagen');
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                alert('La imagen no puede superar los 10MB');
                return;
            }

            setPreviewUrl(URL.createObjectURL(file));
            onChange({
                file,
                learningMethod: 'visualCard',
                title: data.title || '',
                urlImage: data.urlImage // Mantener la URL existente
            });
        }
    };

    return (
        <div className="font-primary text-white">
            <label className="block text-m mb-1 font-semibold">
                Título:
            </label>
            <input
                className="w-full bg-darkInfo h-10 rounded p-2 text-darkPrimaryPurple2 mb-4"
                value={data.title || ''}
                onChange={(e) => onChange({
                    title: e.target.value,
                    learningMethod: 'visualCard'
                })}
                placeholder="Escribe el título de la carta"
            />

            <label className="block text-m mb-1 font-semibold">
                {isEditing ? 'Cambiar imagen (opcional)' : 'Imagen:'}
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full bg-darkInfo text-darkPrimaryPurple2"
            />
            
            {/* Mostrar preview de la imagen existente o nueva */}
            {(previewUrl || data.urlImage) && (
                <div className="mt-4">
                    <img
                        src={previewUrl || data.urlImage}
                        alt="Preview"
                        className="max-w-xs rounded-lg shadow-lg"
                    />
                </div>
            )}
        </div>
    );
}