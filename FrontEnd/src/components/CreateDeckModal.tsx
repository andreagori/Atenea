import { useState } from "react";
import { ButtonCustom } from "./Buttons";
import { X } from 'lucide-react';
import { Plus } from 'lucide-react';
import { ActiveRecall, CornellMethod, VisualCard } from "./CardTypesForm";

interface ModalProps {
    onClose: () => void;
    onCreate: (title: string, body: string) => Promise<void>;
    isVisible?: boolean;
}

export function CreateDeckModal({ onClose, onCreate }: ModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) return;

        try {
            setIsSubmitting(true);
            await onCreate(title, description);
            onClose(); // Cierra el modal tras éxito
        } catch (error) {
            console.error("Error al crear el mazo:", error);
            // Aquí podrías mostrar un mensaje de error si deseas
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/30 ">
            <div className="bg-darkComponent2 rounded-lg shadow-lg w-4/12 h-7/13 border-2 border-darkComponentText">
                <h1 className="text-3xl font-bold mt-4 text-center text-darkComponentText">
                    Crear un mazo
                </h1>
                <form className="m-4" onSubmit={handleSubmit}>
                    <div className="flex items-start w-full">
                        <div className="flex-1">
                            <label
                                className="block text-m font-bold text-darkBgText mb-1"
                            >
                                Ingresa el nombre del mazo:
                            </label>
                            <input
                                className="h-8 block w-full bg-white text-darkAccentText rounded-md shadow-sm px-2"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-2 w-full mt-4">
                        <div className="flex-1">
                            <label
                                className="block text-m font-bold text-darkBgText mb-1"
                            >
                                Descripción:
                            </label>
                            <input
                                className="mt-1 text-sm h-8 block w-full bg-white text-darkAccentText rounded-md shadow-sm px-2"
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-13">
                        <ButtonCustom
                            type="button"
                            text="Cerrar"
                            fontSize="18px"
                            icon={<X />}
                            onClick={onClose}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#FF2F2F', '#FF2F2F']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#650707"
                            width="120px"
                            height="35px"
                        />
                        <ButtonCustom
                            type="submit"
                            text={isSubmitting ? "Creando..." : "Crear nuevo mazo"}
                            icon={<Plus />}
                            onClick={() => { }}
                            isGradient={true}
                            gradientDirection="to bottom"
                            gradientColors={['#0C3BEB', '#1A368B']}
                            color="#fff"
                            hoverColor="#fff"
                            hoverBackground="#0C3BEB"
                            width="201px"
                            height="35px"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}


export function CreateCardModal({ onClose }: ModalProps) {
    const [cardType, setCardType] = useState('');

    return (
        <div className="fixed inset-0 flex items-center justify-center font-primary backdrop-blur-sm bg-black/30">

            <div className="mt-15 bg-darkPrimaryPurple2 rounded-lg shadow-lg w-5/12 border-2 border-darkSecondaryPurple text-darkSecondaryPurple flex flex-col max-h-[90vh] overflow-y-auto">
                <h1 className="text-3xl font-bold mt-4 text-center">Agregar una carta</h1>

                <form className="m-4 flex-grow">
                    <div className="flex items-start w-full">
                        <div className="flex-1">
                            <label className="block text-m font-bold text-darkBgText mb-1">
                                Selecciona el tipo de carta:
                            </label>
                            <select
                                className="h-8 block w-4/12 bg-darkSecondaryPurple2 text-white rounded-md shadow-sm px-2"
                                required
                                value={cardType}
                                onChange={(e) => setCardType(e.target.value)}
                            >
                                <option value="" disabled>Selecciona el tipo de carta</option>
                                <option value="activeRecall">Repaso activo</option>
                                <option value="cornellMethod">Método Cornell</option>
                                <option value="visualCard">Carta visual</option>
                            </select>
                            <div className="mt-2">
                                {cardType === "activeRecall" && <ActiveRecall />}
                                {cardType === "cornellMethod" && <CornellMethod />}
                                {cardType === "visualCard" && <VisualCard />}
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-between m-4">
                    <ButtonCustom
                        type="button"
                        text="Cerrar"
                        fontSize="18px"
                        icon={<X />}
                        onClick={onClose}
                        isGradient={true}
                        gradientDirection="to bottom"
                        gradientColors={['#FF2F2F', '#FF2F2F']}
                        color="#fff"
                        hoverColor="#fff"
                        hoverBackground="#650707"
                        width="120px"
                        height="35px"
                    />
                    <ButtonCustom
                        type="submit"
                        text="Crear nuevo mazo"
                        icon={<Plus />}
                        onClick={() => console.log("Crear nuevo mazo")}
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
            </div>
        </div>
    );
}