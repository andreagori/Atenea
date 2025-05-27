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

// ✅ Crear interfaz para el estado de datos
interface AnalyticsData {
  dailyStudyTime: DailyStudyData[];
  testScores: TestScoreData[];
  methodsDistribution: MethodDistribution | null;
  activityCalendar: ActivityCalendarData[];
  methodEfficiency: MethodEfficiencyData[];
  deckProgress: DeckProgressData[];
  cardRetention: CardRetentionData[];
  productiveHours: ProductiveHoursData[];
}

export const useAnalytics = (timeRange: TimeRange = { days: 7 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Estado inicial con tipos correctos
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
        methodsDistribution,
        activityCalendar,
        methodEfficiency,
        deckProgress,
        cardRetention,
        productiveHours
      ] = await Promise.all([
        AnalyticsService.getDailyStudyTime(timeRange),
        AnalyticsService.getTestScores(timeRange),
        AnalyticsService.getMethodsDistribution(timeRange),
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