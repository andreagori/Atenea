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
  ProductiveHoursData
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
    productiveHours: []
  });

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        dailyStudyTime,
        testScores,
        methodsDistribution, // Para métodos, obtener datos históricos completos
        activityCalendar,
        methodEfficiency,
        deckProgress,
        cardRetention,
        productiveHours
      ] = await Promise.all([
        AnalyticsService.getDailyStudyTime(timeRange),
        AnalyticsService.getTestScores(timeRange),
        // ✅ Para métodos de distribución, usar un rango histórico completo
        AnalyticsService.getMethodsDistribution({ days: 365 }), // Último año completo
        AnalyticsService.getActivityCalendar(),
        AnalyticsService.getMethodEfficiency(timeRange),
        AnalyticsService.getDeckProgress(timeRange),
        AnalyticsService.getCardRetention(),
        AnalyticsService.getProductiveHours(timeRange)
      ]);

      setData({
        dailyStudyTime,
        testScores,
        methodsDistribution,
        activityCalendar,
        methodEfficiency,
        deckProgress,
        cardRetention,
        productiveHours
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