// Types para las métricas de análisis
export interface TimeRange {
  days?: number;
  startDate?: string;
  endDate?: string;
}

export interface DailyStudyData {
  date: string;
  minutes: number;
  hours: number;
}

export interface TestScoreData {
  date: string;
  score: number;
  deckTitle: string;
  sessionId: number;
}

export interface MethodDistribution {
  studyMethods: {
    method: string;
    count: number;
    percentage: number;
  }[];
  learningMethods: {
    method: string;
    count: number;
    percentage: number;
  }[];
}

export interface ActivityCalendarData {
  date: string;
  dayOfWeek: number;
  week: number;
  minutes: number;
  sessions: number;
  intensity: number;
}

export interface MethodEfficiencyData {
  studyMethod: string;
  minutes: number;
  score: number;
  efficiency: number;
  sessionId: number;
  date: string;
}

export interface DeckProgressData {
  deckTitle: string;
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  averageMinutesPerSession: number;
  testCount: number;
}

export interface CardRetentionData {
  evaluation: string;
  intervals: number[];
  averageInterval: number;
  medianInterval: number;
  count: number;
}

export interface ProductiveHoursData {
  hour: number;
  sessions: number;
  totalMinutes: number;
  averageScore: number;
  averageMinutes: number;
  productivity: number;
}

export interface SessionPerformanceData {
  sessionId: number;
  sessionType: string;
  sessionDate: string;
  deckName: string;
  correctCards: CardDetail[];
  incorrectCards: CardDetail[];
  totalCards: number;
  scorePercentage: number;
}

export interface CardDetail {
  cardId: number;
  title: string;
  learningMethod: string;
  difficulty?: 'correct' | 'incorrect' | 'facil' | 'bien' | 'masomenos' | 'dificil';
  responseTime?: number;
}

export interface SpacedRepetitionData {
  sessionId: number;
  sessionDate: string;
  deckName: string;
  cardsByDifficulty: {
    facil: CardDetail[];
    bien: CardDetail[];
    masomenos: CardDetail[];
    dificil: CardDetail[];
  };
  totalCards: number;
}