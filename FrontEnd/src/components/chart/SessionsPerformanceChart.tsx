import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SessionPerformanceData } from '../../types/analytics.types';

interface SessionsPerformanceChartProps {
  data: SessionPerformanceData[];
  loading: boolean;
}

interface ChartData {
  sessionId: number;
  sessionName: string;
  correct: number;
  incorrect: number;
  correctCards: any[];
  incorrectCards: any[];
  scorePercentage: number;
}

const PERFORMANCE_COLORS = {
  correct: '#10B981',    // Verde
  incorrect: '#EF4444'   // Rojo
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-darkPrimaryPurple2 border border-darkPrimaryPurple rounded-lg p-4 shadow-lg max-w-sm">
        <p className="text-white font-semibold mb-2">{label}</p>
        <p className="text-green-400">{`Correctas: ${data.correct}`}</p>
        <p className="text-red-400">{`Incorrectas: ${data.incorrect}`}</p>
        <p className="text-blue-400">{`Puntuación: ${data.scorePercentage}%`}</p>
        
        {data.correctCards && data.correctCards.length > 0 && (
          <div className="mt-2">
            <p className="text-green-400 text-sm font-medium">Preguntas Correctas:</p>
            <div className="ml-2 max-h-20 overflow-y-auto">
              {data.correctCards.slice(0, 2).map((card: any, index: number) => (
                <p key={index} className="text-xs text-gray-300 truncate">
                  • {card.title}
                </p>
              ))}
              {data.correctCards.length > 2 && (
                <p className="text-xs text-gray-400">... y {data.correctCards.length - 2} más</p>
              )}
            </div>
          </div>
        )}
        
        {data.incorrectCards && data.incorrectCards.length > 0 && (
          <div className="mt-2">
            <p className="text-red-400 text-sm font-medium">Preguntas Incorrectas:</p>
            <div className="ml-2 max-h-20 overflow-y-auto">
              {data.incorrectCards.slice(0, 2).map((card: any, index: number) => (
                <p key={index} className="text-xs text-gray-300 truncate">
                  • {card.title}
                </p>
              ))}
              {data.incorrectCards.length > 2 && (
                <p className="text-xs text-gray-400">... y {data.incorrectCards.length - 2} más</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const SessionsPerformanceChart: React.FC<SessionsPerformanceChartProps> = ({ 
  data, 
  loading 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'best' | 'worst'>('recent');
  const [maxSessions, setMaxSessions] = useState(5);

  // Procesar y filtrar datos
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let sortedData = [...data];
    
    switch (selectedFilter) {
      case 'recent':
        sortedData = sortedData
          .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
          .slice(0, maxSessions);
        break;
      case 'best':
        // Mejores = mayor porcentaje de acierto
        sortedData = sortedData
          .sort((a, b) => b.scorePercentage - a.scorePercentage)
          .slice(0, maxSessions);
        break;
      case 'worst':
        // Peores = menor porcentaje de acierto
        sortedData = sortedData
          .sort((a, b) => a.scorePercentage - b.scorePercentage)
          .slice(0, maxSessions);
        break;
      case 'all':
      default:
        sortedData = sortedData
          .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
          .slice(0, maxSessions);
        break;
    }
    
    return sortedData;
  }, [data, selectedFilter, maxSessions]);

  const chartData: ChartData[] = filteredData.map(session => ({
    sessionId: session.sessionId,
    sessionName: `${session.sessionType} - ${new Date(session.sessionDate).toLocaleDateString()} - ${session.deckName.substring(0, 15)}${session.deckName.length > 15 ? '...' : ''}`,
    correct: session.correctCards.length,
    incorrect: session.incorrectCards.length,
    correctCards: session.correctCards,
    incorrectCards: session.incorrectCards,
    scorePercentage: session.scorePercentage
  }));

  // Datos para estadísticas rápidas
  const totalData = filteredData.reduce((acc, session) => {
    acc.correct += session.correctCards.length;
    acc.incorrect += session.incorrectCards.length;
    return acc;
  }, { correct: 0, incorrect: 0 });

  const totalQuestions = totalData.correct + totalData.incorrect;
  const averageScore = totalQuestions > 0 ? Math.round((totalData.correct / totalQuestions) * 100) : 0;

  if (loading) {
    return (
      <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Rendimiento en Tests Simulados
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No hay datos de tests simulados disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkPrimaryPurple backdrop-blur-sm border border-white rounded-xl p-6">
      {/* Header con filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-white">
          Rendimiento en Tests Simulados
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Filtro de tipo */}
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="bg-darkPrimaryPurple2 text-white text-sm rounded-lg px-3 py-2 border border-white focus:border-purple-500 focus:outline-none"
          >
            <option value="recent">Más Recientes</option>
            <option value="best">Mejores Resultados</option>
            <option value="worst">Peores Resultados</option>
            <option value="all">Todas</option>
          </select>

          {/* Filtro de cantidad */}
          <select
            value={maxSessions}
            onChange={(e) => setMaxSessions(Number(e.target.value))}
            className="bg-darkPrimaryPurple2 text-white text-sm rounded-lg px-3 py-2 border border-white focus:border-purple-500 focus:outline-none"
          >
            <option value={3}>3 tests</option>
            <option value={5}>5 tests</option>
            <option value={10}>10 tests</option>
            <option value={20}>20 tests</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/70 rounded-lg p-3 text-center">
          <div className="text-green-400 text-2xl font-bold">{totalData.correct}</div>
          <div className="text-gray-300 text-sm">Correctas</div>
        </div>
        <div className="bg-red-500/70 rounded-lg p-3 text-center">
          <div className="text-red-400 text-2xl font-bold">{totalData.incorrect}</div>
          <div className="text-gray-300 text-sm">Incorrectas</div>
        </div>
        <div className="bg-blue-500/70 rounded-lg p-3 text-center">
          <div className="text-blue-400 text-2xl font-bold">{averageScore}%</div>
          <div className="text-gray-300 text-sm">Promedio</div>
        </div>
      </div>

      <div className="w-full">
        <h4 className="text-lg font-medium text-white mb-4">Por Test</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A0B7B" />
            <XAxis 
              dataKey="sessionName" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="correct" 
              name="Correctas"
              fill={PERFORMANCE_COLORS.correct} 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="incorrect" 
              name="Incorrectas"
              fill={PERFORMANCE_COLORS.incorrect} 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};