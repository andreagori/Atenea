export interface CreateCardPayload {
    title: string;
    learningMethod: 'activeRecall' | 'cornell' | 'visualCard';
    // Active Recall fields
    questionTitle?: string;
    answer?: string;
    // Cornell fields
    principalNote?: string;
    noteQuestions?: string;
    shortNote?: string;
    // Visual Card fields
    file?: File;
    urlImage?: string;
}

export interface ModalProps {
    onClose: () => void;
    onCreate?: (title: string, body: string) => Promise<void>;
    onCreateCard?: (cardData: CreateCardPayload) => Promise<void>;
    isVisible?: boolean;
}