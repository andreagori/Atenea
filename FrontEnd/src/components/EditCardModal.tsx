import { useState } from "react";
import { ButtonCustom } from "./Buttons";
import { X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ActiveRecall, CornellMethod, VisualCard } from "./CardTypesForm";
import { Card } from "@/hooks/useCards";

interface FormData {
    title: string;
    learningMethod: 'activeRecall' | 'cornell' | 'visualCard';
    questionTitle?: string;
    answer?: string;
    principalNote?: string;
    noteQuestions?: string;
    shortNote?: string;
    urlImage?: string;
    file?: File;
}

interface EditCardModalProps {
    card: Card;
    onClose: () => void;
    onUpdate: (cardId: number, cardData: any) => Promise<void>;
}

export function EditCardModal({ card, onClose, onUpdate }: EditCardModalProps) {
    const getLearningMethod = () => {
        if (card.activeRecall) return 'activeRecall';
        if (card.cornell) return 'cornell';
        if (card.visualCard) return 'visualCard';
        return 'activeRecall'; // default value
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: card.title,
        learningMethod: getLearningMethod(),
        ...(card.activeRecall && {
            questionTitle: card.activeRecall.questionTitle,
            answer: card.activeRecall.answer,
        }),
        ...(card.cornell && {
            principalNote: card.cornell.principalNote,
            noteQuestions: card.cornell.noteQuestions,
            shortNote: card.cornell.shortNote,
        }),
        ...(card.visualCard && {
            urlImage: card.visualCard.urlImage,
        }),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);

            // Crear FormData si es una visual card con nueva imagen
            if (card.visualCard && formData.file) {
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('urlImage', formData.urlImage || '');
                formDataToSend.append('file', formData.file);

                await onUpdate(card.cardId, formDataToSend);
            } else {
                // Para otros casos normal
                await onUpdate(card.cardId, {
                    title: formData.title,
                    ...(card.activeRecall && {
                        questionTitle: formData.questionTitle,
                        answer: formData.answer,
                    }),
                    ...(card.cornell && {
                        principalNote: formData.principalNote,
                        noteQuestions: formData.noteQuestions,
                        shortNote: formData.shortNote,
                    }),
                });
            }
            onClose();
        } catch (error) {
            console.error("Error updating card:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => {
            const newData = { ...prev, ...data };
            if (card.activeRecall && data.title) {
                newData.questionTitle = data.title;
            }
            return newData;
        });
    };

    const getCardTypeIcon = () => {
        const learningMethod = getLearningMethod();
        switch (learningMethod) {
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
        }
    };

    const getCardTypeName = () => {
        const learningMethod = getLearningMethod();
        switch (learningMethod) {
            case 'activeRecall': return 'Repaso Activo';
            case 'cornell': return 'Método Cornell';
            case 'visualCard': return 'Carta Visual';
            default: return 'Editar Carta';
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/40 z-[9999] p-4">
            <div className="bg-gradient-to-br from-darkPrimaryPurple2 to-darkPrimaryPurple rounded-2xl shadow-2xl w-full max-w-4xl border border-darkSecondaryPurple/30 transform transition-all duration-300 ease-out max-h-[95vh] overflow-hidden flex flex-col">

                {/* Header decorativo */}
                <div className="bg-gradient-to-r from-[#8C4FFF] to-[#1700A4] rounded-t-2xl p-3 text-center relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            {getCardTypeIcon()}
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-white">
                                Editar {getCardTypeName()}
                            </h1>
                            <p className="text-purple-100 text-xs">
                                Modifica los detalles de tu carta
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">

                        {/* Contenido dinámico según el tipo de carta */}
                        <div className="bg-white/5 rounded-xl p-3 border border-darkSecondaryPurple/20">
                            <div className="space-y-3">
                                {card.activeRecall && (
                                    <ActiveRecall
                                        onChange={updateFormData}
                                        data={formData}
                                        isEditing={true}
                                    />
                                )}

                                {card.cornell && (
                                    <CornellMethod
                                        onChange={updateFormData}
                                        data={formData}
                                        isEditing={true}
                                    />
                                )}

                                {card.visualCard && (
                                    <VisualCard
                                        onChange={updateFormData}
                                        data={formData}
                                        isEditing={true}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Botones */}
                        <div className="bg-gradient-to-r from-darkPrimaryPurple2/50 to-darkPrimaryPurple/50 p-4 border-t border-darkSecondaryPurple/20 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <ButtonCustom
                                    type="button"
                                    text="Cerrar"
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
                                    text={isSubmitting ? "Guardando..." : "Guardar cambios"}
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