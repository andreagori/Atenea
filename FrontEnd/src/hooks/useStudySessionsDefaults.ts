import { useMemo } from 'react';
import { CreateStudySessionDto, LearningMethod, StudyMethod } from '../types/studySessions.types';

export const useStudySessionDefaults = (selectedOption: string | null): CreateStudySessionDto | null => {
  return useMemo(() => {
    const baseConfig = {
      learningMethod: [
        LearningMethod.ACTIVE_RECALL,
        LearningMethod.CORNELL,
        LearningMethod.VISUAL_CARD
      ]
    };

    switch (selectedOption) {
      case 'regular':
        return {
          ...baseConfig,
          studyMethod: StudyMethod.SPACED_REPETITION,
          numCardsSpaced: 10
        };
      case 'pomodoro':
        return {
          ...baseConfig,
          studyMethod: StudyMethod.POMODORO,
          numCards: 10,
          studyMinutes: 25,
          restMinutes: 5
        };
      case 'simuladas':
        return {
          ...baseConfig,
          studyMethod: StudyMethod.SIMULATED_TEST,
          numQuestions: 10,
          testDurationMinutes: 15
        };
      default:
        return null;
    }
  }, [selectedOption]);
};