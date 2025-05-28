import { useState, useEffect } from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { 
  TimeRange, 
  DailyStudyData, 
  TestScoreData, 
  MethodDistribution,
  ActivityCalendarData,
  MethodEfficiencyData,
  DeckProgressData,
  CardRetentionData,
  ProductiveHoursData,
  SessionPerformanceData,
  SpacedRepetitionData
} from '../types/analytics.types';

interface AnalyticsData {
  dailyStudyTime: DailyStudyData[];
  testScores: TestScoreData[];
  methodsDistribution: MethodDistribution | null;
  activityCalendar: ActivityCalendarData[];
  methodEfficiency: MethodEfficiencyData[];
  deckProgress: DeckProgressData[];
  cardRetention: CardRetentionData[];
  productiveHours: ProductiveHoursData[];
  sessionsPerformance: SessionPerformanceData[];
  spacedRepetitionStats: SpacedRepetitionData[];
  studyMethods?: { method: string; count: number }[];
  learningMethods?: { method: string; count: number }[];
}

export const useAnalytics = (timeRange: TimeRange = { days: 7 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<AnalyticsData>({
    dailyStudyTime: [],
    testScores: [],
    methodsDistribution: null,
    activityCalendar: [],
    methodEfficiency: [],
    deckProgress: [],
    cardRetention: [],
    productiveHours: [],
    sessionsPerformance: [],
    spacedRepetitionStats: []
  });

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        dailyStudyTime,
        testScores,
        methodsDistribution,
        activityCalendar,
        methodEfficiency,
        deckProgress,
        cardRetention,
        productiveHours,
        sessionsPerformance,
        spacedRepetitionStats
      ] = await Promise.all([
        AnalyticsService.getDailyStudyTime(timeRange),
        AnalyticsService.getTestScores(timeRange),
        AnalyticsService.getMethodsDistribution({ days: 365 }),
        AnalyticsService.getActivityCalendar(),
        AnalyticsService.getMethodEfficiency(timeRange),
        AnalyticsService.getDeckProgress(timeRange),
        AnalyticsService.getCardRetention(),
        AnalyticsService.getProductiveHours(timeRange),
        AnalyticsService.getSessionsPerformance(timeRange),
        AnalyticsService.getSpacedRepetitionStats(timeRange)
      ]);

      setData({
        dailyStudyTime,
        testScores,
        methodsDistribution,
        activityCalendar,
        methodEfficiency,
        deckProgress,
        cardRetention,
        productiveHours,
        sessionsPerformance,
        spacedRepetitionStats
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [timeRange.days, timeRange.startDate, timeRange.endDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchAllData
  };
};