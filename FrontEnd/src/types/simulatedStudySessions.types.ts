export interface TestQuestion {
    questionId: number;
    title: string;
    options: TestOption[];
    progress: {
        current: number;
        total: number;
    };
}

export interface TestResultDto {
    sessionId: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
    timeSpent: number;
}

export interface TestOption {
    cardId: number;
    content: string;
    type: string;
}

export interface TestProgress {
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    remainingTime: number;
    isComplete: boolean;
}