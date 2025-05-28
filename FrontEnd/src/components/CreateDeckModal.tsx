import { useEffect, useState } from "react";
import { ButtonCustom } from "./Buttons";
import { X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ActiveRecall, CornellMethod, VisualCard } from "./CardTypesForm";
import { CreateCardPayload } from "@/types/card.types";

interface ModalProps {
    onClose: () => void;
    onCreate: (title: string, body: string) => Promise<void>;
    onUpdate?: (title: string, body: string) => Promise<void>;
    isVisible?: boolean;
    initialTitle?: string;
    initialDescription?: string;
    editMode?: boolean;
}

export interface CreateCardModalProps {
    onClose: () => void;
    onCreateCard: (cardData: CreateCardPayload) => Promise<void>;
    isVisible?: boolean;
}

export function CreateDeckModal({
    onClose,
    onCreate,
    onUpdate,
    initialTitle = '',
    initialDescription = '',
    editMode = false
}: ModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) return;

        try {
            setIsSubmitting(true);
            if (editMode && onUpdate) {
                await onUpdate(title, description);
            } else {
                if (onCreate) {
                    await onCreate(title, description);
                }
            }
            onClose();
        } catch (error) {
            console.error(editMode ? "Error al actualizar el mazo:" : "Error al crear el mazo:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/40 z-[9999] p-4">
            <div className="bg-gradient-to-br from-darkComponent2 to-darkComponent rounded-2xl shadow-2xl w-full max-w-md border border-darkComponentText/20 transform transition-all duration-300 ease-out">

                {/* Header decorativo */}
                <div className="bg-gradient-to-r from-[#0C3BEB] to-[#1A368B] rounded-t-2xl p-3 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            {editMode ? (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            {editMode ? 'Editar mazo' : 'Crear un mazo'}
                        </h1>
                        <p className="text-blue-100 text-sm mt-2">
                            {editMode ? 'Modifica los detalles de tu mazo' : 'Crea tu mazo de estudio'}
                        </p>
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Campo de título */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-darkBgText">
                                Nombre del mazo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Ej: Matemáticas - Álgebra"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Campo de descripción */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-darkBgText">
                                Descripción
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                </div>
                                <textarea
                                    className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-darkAccentText shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Describe brevemente el contenido de este mazo..."
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <ButtonCustom
                                type="button"
                                text="Cerrar"
                                fontSize="16px"
                                icon={<X className="w-4 h-4" />}
                                onClick={onClose}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#FF2F2F', '#650707']}
                                color="#fff"
                                hoverColor="#fff"
                                hoverBackground="#FF2F2F"
                                width="120px"
                                height="44px"
                            />
                            <ButtonCustom
                                type="submit"
                                text={isSubmitting
                                    ? (editMode ? "Guardando..." : "Creando...")
                                    : (editMode ? "Guardar cambios" : "Crear mazo")
                                }
                                icon={isSubmitting ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                onClick={() => { }}
                                isGradient={true}
                                gradientDirection="to bottom"
                                gradientColors={['#0C3BEB', '#1700A4']}
                                color="#fff"
                                hoverColor="#fff"
                                hoverBackground="#0C3BEB"
                                width="180px"
                                height="44px"
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export function CreateCardModal({ onClose, onCreateCard }: CreateCardModalProps) {
    const [cardType, setCardType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CreateCardPayload>({
        title: '',
        learningMethod: 'activeRecall'
    });

    const resetForm = () => {
        setCardType('');
        setFormData({
            title: '',
            learningMethod: 'activeRecall'
        });
    };

    const handleCardTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setCardType(selectedType);

        // Map the selected value to the correct learningMethod
        const learningMethodMap: { [key: string]: 'activeRecall' | 'cornell' | 'visualCard' } = {
            'activeRecall': 'activeRecall',
            'cornell': 'cornell',
            'visualCard': 'visualCard'
        };

        setFormData(prev => ({
            ...prev,
            learningMethod: learningMethodMap[selectedType]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onCreateCard) return;

        if (!validateFormData(formData)) {
            console.error("Faltan campos requeridos");
            return;
        }

        try {
            setIsSubmitting(true);

            // Crear el payload adecuado según el tipo de carta
            const payload: CreateCardPayload = {
                title: formData.title,
                learningMethod: formData.learningMethod,
                ...(formData.learningMethod === 'activeRecall' && {
                    questionTitle: formData.questionTitle,
                    answer: formData.answer
                }),
                ...(formData.learningMethod === 'cornell' && {
                    principalNote: formData.principalNote,
                    noteQuestions: formData.noteQuestions,
                    shortNote: formData.shortNote
                }),
                ...(formData.learningMethod === 'visualCard' && {
                    file: formData.file
                })
            };

            await onCreateCard(payload);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating card:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (data: Partial<CreateCardPayload>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateFormData = (data: CreateCardPayload): boolean => {
        if (!data.title || data.title.length < 3 || data.title.length > 100) {
            console.error("El título debe tener entre 3 y 100 caracteres");
            return false;
        }

        switch (data.learningMethod) {
            case 'activeRecall':
                return !!(data.questionTitle && data.answer);
            case 'cornell':
                return !!(data.principalNote && data.noteQuestions && data.shortNote);
            case 'visualCard':
                return !!(data.title && data.file);
            default:
                return false;
        }
    };

    const getCardTypeIcon = () => {
        switch (cardType) {
            case 'activeRecall':
                return (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'cornell':
                return (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'visualCard':
                return (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
        }
    };

    const getCardTypeName = () => {
        switch (cardType) {
            case 'activeRecall': return 'Repaso Activo';
            case 'cornell': return 'Método Cornell';
            case 'visualCard': return 'Carta Visual';
            default: return 'Nueva Carta';
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/40 z-[9999] p-4">
            <div className="bg-gradient-to-br from-darkPrimaryPurple2 to-darkPrimaryPurple rounded-2xl shadow-2xl w-full max-w-4xl border border-darkSecondaryPurple/30 transform transition-all duration-300 ease-out max-h-[95vh] overflow-hidden flex flex-col">

                {/* Header decorativo - Más compacto */}
                <div className="bg-gradient-to-r from-[#8C4FFF] to-[#1700A4] rounded-t-2xl p-3 text-center relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            {getCardTypeIcon()}
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-white">
                                {getCardTypeName()}
                            </h1>
                            <p className="text-purple-100 text-xs">
                                Crea una nueva carta de estudio
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">

                        {/* Selector de tipo de carta */}
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-darkBgText">
                                Tipo de carta de estudio
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a4 4 0 01-4 4z" />
                                    </svg>
                                </div>
                                <select
                                    className="pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg text-darkAccentText text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors appearance-none"
                                    required
                                    value={cardType}
                                    onChange={handleCardTypeChange}
                                >
                                    <option value="" disabled>Selecciona el tipo de carta</option>
                                    <option value="activeRecall">Repaso activo</option>
                                    <option value="cornell">Método Cornell</option>
                                    <option value="visualCard">Carta visual</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Contenido dinámico según el tipo de carta */}
                        {cardType && (
                            <div className="bg-white/5 rounded-xl p-3 border border-darkSecondaryPurple/20">
                                <div className="space-y-3">
                                    {cardType === "activeRecall" && (
                                        <ActiveRecall
                                            onChange={updateFormData}
                                            data={formData}
                                        />
                                    )}
                                    {cardType === "cornell" && (
                                        <CornellMethod
                                            onChange={updateFormData}
                                            data={formData}
                                        />
                                    )}
                                    {cardType === "visualCard" && (
                                        <VisualCard
                                            onChange={updateFormData}
                                            data={formData}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                {/* Botones - Más compacto */}
                <div className="bg-gradient-to-r from-darkPrimaryPurple2/50 to-darkPrimaryPurple/50 p-4 border-t border-darkSecondaryPurple/20 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <ButtonCustom
                            type="button"
                            text="Cancelar"
                            fontSize="14px"
                            icon={<X className="w-4 h-4" />}
                            onClick={onClose}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#FF6B6B', '#EE5A24']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#FF6B6B"
                            width="120px"
                            height="40px"
                        />

                        <ButtonCustom
                            type="submit"
                            text={isSubmitting ? "Creando..." : "Crear carta"}
                            fontSize="14px"
                            icon={isSubmitting ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            onClick={() => { }}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#8C4FFF', '#1700A4']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#8C4FFF"
                            width="150px"
                            height="40px"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                    </form>
                </div>

            </div>
        </div>
    );
}