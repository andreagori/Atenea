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

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/30">
            <div className="mt-15 bg-darkPrimaryPurple2 rounded-lg shadow-lg w-5/12 border-2 border-darkSecondaryPurple text-darkSecondaryPurple flex flex-col max-h-[90vh] overflow-y-auto">
                <h1 className="text-3xl font-bold mt-4 text-center">Editar carta</h1>

                <form className="m-4 flex-grow" onSubmit={handleSubmit}>
                    <div className="mb-4">
                    </div>

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

                    <div className="flex justify-between mt-4">
                        <ButtonCustom
                            type="button"
                            text="Cerrar"
                            onClick={onClose}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#FF2F2F', '#650707']}
                            hoverBackground="#FF2F2F"
                            color="#fff"
                            hoverColor="#fff"
                            icon={<X />}
                            width="120px"
                            height="35px"
                        />
                        <ButtonCustom
                            type="submit"
                            text={isSubmitting ? "Guardando..." : "Guardar cambios"}
                            onClick={() => { }}
                            icon={<Plus />}
                            disabled={isSubmitting}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#0C3BEB', '#1A368B']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#0C3BEB"
                            width="201px"
                            height="35px"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}