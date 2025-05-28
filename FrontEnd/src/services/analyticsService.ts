import axios from 'axios';
import Cookies from 'js-cookie';
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
import { API_CONFIG } from '../config';


const API_BASE_URL = import.meta.env.VITE_API_URL;

export class AnalyticsService {
  private static getAuthHeaders() {
    const token = Cookies.get("auth_token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private static buildTimeRangeParams(timeRange: TimeRange): URLSearchParams {
    const params = new URLSearchParams();
    if (timeRange.days) params.append('days', timeRange.days.toString());
    if (timeRange.startDate) params.append('startDate', timeRange.startDate);
    if (timeRange.endDate) params.append('endDate', timeRange.endDate);
    return params;
  }

  static async getDailyStudyTime(timeRange: TimeRange): Promise<DailyStudyData[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<DailyStudyData[]>(
        `${API_BASE_URL}/analytics/daily-study-time?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener tiempo de estudio diario');
    }
  }

  static async getTestScores(timeRange: TimeRange): Promise<TestScoreData[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<TestScoreData[]>(
        `${API_BASE_URL}/analytics/test-scores?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener puntuaciones de tests');
    }
  }

  static async getMethodsDistribution(timeRange: TimeRange): Promise<MethodDistribution> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<MethodDistribution>(
        `${API_BASE_URL}/analytics/methods-distribution?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener distribución de métodos');
    }
  }

  static async getActivityCalendar(year?: number): Promise<ActivityCalendarData[]> {
    try {
      const params = year ? `?year=${year}` : '';
      const response = await axios.get<ActivityCalendarData[]>(
        `${API_CONFIG.BASE_URL}/analytics/activity-calendar${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener calendario de actividad');
    }
  }

  static async getMethodEfficiency(timeRange: TimeRange): Promise<MethodEfficiencyData[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<MethodEfficiencyData[]>(
        `${API_BASE_URL}/analytics/method-efficiency?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener eficiencia por método');
    }
  }

  static async getDeckProgress(timeRange: TimeRange): Promise<DeckProgressData[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<DeckProgressData[]>(
        `${API_BASE_URL}/analytics/deck-progress?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener progreso por deck');
    }
  }

  static async getCardRetention(deckId?: number): Promise<CardRetentionData[]> {
    try {
      const params = deckId ? `?deckId=${deckId}` : '';
      const response = await axios.get<CardRetentionData[]>(
        `${API_BASE_URL}/analytics/card-retention${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener retención de cartas');
    }
  }

  static async getProductiveHours(timeRange: TimeRange): Promise<ProductiveHoursData[]> {
    try {
      const params = new URLSearchParams();
      if (timeRange.days) params.append('days', timeRange.days.toString());
      if (timeRange.startDate) params.append('startDate', timeRange.startDate);
      if (timeRange.endDate) params.append('endDate', timeRange.endDate);

      const response = await axios.get<ProductiveHoursData[]>(
        `${API_BASE_URL}/analytics/productive-hours?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener horas productivas');
    }
  }

  static async getSessionsPerformance(timeRange: TimeRange): Promise<SessionPerformanceData[]> {
    try {
      const params = this.buildTimeRangeParams(timeRange);
      const response = await axios.get<SessionPerformanceData[]>(
        `${API_BASE_URL}/analytics/sessions-performance?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener rendimiento de sesiones');
    }
  }

  static async getSpacedRepetitionStats(timeRange: TimeRange): Promise<SpacedRepetitionData[]> {
    try {
      const params = this.buildTimeRangeParams(timeRange);
      const response = await axios.get<SpacedRepetitionData[]>(
        `${API_BASE_URL}/analytics/spaced-repetition-stats?${params}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al obtener estadísticas de memorización espaciada');
    }
  }
  
}