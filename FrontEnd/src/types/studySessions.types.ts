export enum StudyMethod {
  SPACED_REPETITION = 'spacedRepetition',
  POMODORO = 'pomodoro',
  SIMULATED_TEST = 'simulatedTest'
}

export enum LearningMethod {
  ACTIVE_RECALL = 'activeRecall',
  CORNELL = 'cornell',
  VISUAL_CARD = 'visualCard'
}

export interface CreateStudySessionDto {
  studyMethod: StudyMethod;
  learningMethod: LearningMethod[];
  numCardsSpaced?: number;
  numCards?: number;
  studyMinutes?: number;
  restMinutes?: number;
  numQuestions?: number;
  testDurationMinutes?: number;
}