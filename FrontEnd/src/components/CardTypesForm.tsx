import { CreateCardPayload } from "@/types/card.types";
import { useState } from "react";


interface CardFormProps {
    onChange: (data: Partial<CreateCardPayload>) => void;
    data: CreateCardPayload;
    isEditing?: boolean;
}

export function ActiveRecall({ onChange, data }: CardFormProps) {
    return (
        <div className="font-primary text-black space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Título/Pregunta:
                </label>
                <input
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    value={data.title || data.questionTitle || ''}
                    onChange={(e) => onChange({
                        title: e.target.value,
                        questionTitle: e.target.value,
                        learningMethod: 'activeRecall'
                    })}
                    placeholder="¿Cuál es la pregunta que quieres recordar?"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Respuesta:
                </label>
                <textarea
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 resize-none"
                    rows={4}
                    value={data.answer || ''}
                    onChange={(e) => onChange({ answer: e.target.value })}
                    placeholder="Escribe aquí la respuesta completa y detallada..."
                />
            </div>
        </div>
    );
}

export function CornellMethod({ onChange, data }: CardFormProps) {
    return (
        <div className="font-primary text-black space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Título:
                </label>
                <input
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400"
                    value={data.title || ''}
                    onChange={(e) => onChange({
                        title: e.target.value,
                        learningMethod: 'cornell'
                    })}
                    placeholder="Tema principal o título de las notas"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Nota principal:
                </label>
                <textarea
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-gray-400 resize-none"
                    rows={4}
                    value={data.principalNote || ''}
                    onChange={(e) => onChange({ principalNote: e.target.value })}
                    placeholder="Desarrolla aquí el contenido principal de la lección o tema..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Preguntas de la nota:
                </label>
                <textarea
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-none"
                    rows={3}
                    value={data.noteQuestions || ''}
                    onChange={(e) => onChange({ noteQuestions: e.target.value })}
                    placeholder="¿Qué preguntas surgen de este contenido? ¿Qué puntos clave debo recordar?"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Resumen:
                </label>
                <textarea
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 resize-none"
                    rows={3}
                    value={data.shortNote || ''}
                    onChange={(e) => onChange({ shortNote: e.target.value })}
                    placeholder="Resume los puntos más importantes en pocas palabras..."
                />
            </div>
        </div>
    );
}

export function VisualCard({ onChange, data, isEditing }: CardFormProps) {
    const [previewUrl, setPreviewUrl] = useState<string>(data.urlImage || '');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('El archivo debe ser una imagen');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('La imagen no puede superar los 10MB');
                return;
            }

            setPreviewUrl(URL.createObjectURL(file));
            onChange({
                file,
                learningMethod: 'visualCard',
                title: data.title || '',
                urlImage: data.urlImage
            });
        }
    };

    return (
        <div className="font-primary text-black space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Título:
                </label>
                <input
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 placeholder-gray-400"
                    value={data.title || ''}
                    onChange={(e) => onChange({
                        title: e.target.value,
                        learningMethod: 'visualCard'
                    })}
                    placeholder="Describe brevemente el contenido visual"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-darkBgText flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {isEditing ? 'Cambiar imagen (opcional)' : 'Imagen:'}
                </label>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-darkAccentText file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                        Formatos soportados: JPG, PNG, GIF. Máximo 10MB.
                    </div>
                </div>
            </div>
            
            {(previewUrl || data.urlImage) && (
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-darkBgText">
                        Vista previa:
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                        <img
                            src={previewUrl || data.urlImage}
                            alt="Preview"
                            className="max-w-full h-auto max-h-64 rounded-lg shadow-lg mx-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}