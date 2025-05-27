import React from 'react';
import { ActivityCalendarData, DeckProgressData } from '../../types/analytics.types';

interface ActivityCalendarChartProps {
  data: ActivityCalendarData[];
  deckProgress: DeckProgressData[];
  loading?: boolean;
}

export const ActivityCalendarChart: React.FC<ActivityCalendarChartProps> = ({ data, deckProgress, loading }) => {
  if (loading) {
    return (
      <div className="bg-darkPrimaryPurple rounded-xl p-4 border border-darkSecondaryPurple">
        <div className="animate-pulse">
          <div className="h-4 bg-darkSecondaryPurple rounded w-1/3 mb-3"></div>
          <div className="h-20 bg-darkSecondaryPurple rounded"></div>
        </div>
      </div>
    );
  }

  // Nueva función que usa rangos de sesiones
  const getIntensityColorBySessions = (sessions: number) => {
    if (sessions === 0) return '#002456';      // Sin actividad - darkComponent2
    if (sessions <= 2) return '#75CDF820';     // 1-2 sesiones - Muy baja
    if (sessions <= 10) return '#75CDF840';     // 3-5 sesiones - Baja  
    if (sessions <= 20) return '#75CDF880';    // 6-10 sesiones - Media
    return '#75CDF8';                          // 11+ sesiones - Alta
  };

  // Función para obtener la intensidad visual basada en sesiones
  const getIntensityLevel = (sessions: number) => {
    if (sessions === 0) return 0;
    if (sessions <= 2) return 1;
    if (sessions <= 10) return 2;
    if (sessions <= 20) return 3;
    return 4;
  };

  const getTooltipText = (day: ActivityCalendarData) => {
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (day.sessions === 0) {
      return `${formattedDate}: Sin actividad`;
    }
    
    // 🏷️ Agregar nivel de actividad al tooltip
    let activityLevel = '';
    if (day.sessions <= 2) activityLevel = ' (Baja)';
    else if (day.sessions <= 5) activityLevel = ' (Media)';
    else if (day.sessions <= 10) activityLevel = ' (Alta)';
    else activityLevel = ' (Muy Alta)';
    
    return `${formattedDate}: ${day.sessions} sesión(es), ${day.minutes} min${activityLevel}`;
  };

  // Generar últimos 30 días desde hoy
  const generateLast30Days = (): ActivityCalendarData[] => {
    const today = new Date();
    const days: ActivityCalendarData[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Buscar datos existentes para esta fecha o crear datos de ejemplo
      const existingData = data.find(d => {
        const existingDate = new Date(d.date);
        return existingDate.toDateString() === date.toDateString();
      });
      
      if (existingData) {
        days.push(existingData);
      } else {
        // 🎲 Generar datos de ejemplo más realistas
        const randomSessions = Math.floor(Math.random() * 15); // 0-14 sesiones
        days.push({
          date: date.toISOString().split('T')[0],
          sessions: randomSessions,
          minutes: randomSessions > 0 ? randomSessions * 25 : 0,
          intensity: getIntensityLevel(randomSessions), // Calcular intensidad basada en sesiones
          dayOfWeek: 0,
          week: 0
        });
      }
    }
    
    return days;
  };

  const last30Days = generateLast30Days();
  
  // Agrupar por semanas (máximo 5 semanas para un mes)
  const weeks: ActivityCalendarData[][] = [];
  let currentWeek: ActivityCalendarData[] = [];
  
  last30Days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === last30Days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const totalMinutes = last30Days.reduce((acc, day) => acc + day.minutes, 0);
  const totalSessions = last30Days.reduce((acc, day) => acc + day.sessions, 0);
  const activeDays = last30Days.filter(day => day.sessions > 0).length;

  // Top 5 mazos más estudiados
  const topDecks = deckProgress
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .slice(0, 5);

  return (
    <div className="bg-darkPrimary rounded-xl p-4 border border-darkSecondaryPurple shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Calendario de Actividad */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-lightNeutral">Actividad (30 días)</h3>
            </div>
            <div className="text-sm text-lightNeutral opacity-70">
              {activeDays} días activos
            </div>
          </div>

          {/* Calendar Grid - Ocupando toda la mitad */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-center">
              <div className="inline-block">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-15 h-10 m-0.5 rounded-sm cursor-pointer hover:ring-1 hover:ring-[#75CDF8] transition-all duration-200 group relative"
                        style={{ backgroundColor: getIntensityColorBySessions(day.sessions) }}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2  bg-[#000416] text-lightNeutral text-xs rounded border border-[#75CDF8] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                          {getTooltipText(day)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Legend con rangos de sesiones */}
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center gap-4 text-xs text-lightNeutral">
                <span className="opacity-70">Menos</span>
                <div className="flex items-center gap-1">
                  {[
                    { sessions: 0, label: '0' },
                    { sessions: 1, label: '1-2' },
                    { sessions: 3, label: '3-5' },
                    { sessions: 6, label: '6-10' },
                    { sessions: 11, label: '11+' }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-sm mb-1"
                        style={{ backgroundColor: getIntensityColorBySessions(item.sessions) }}
                        title={`${item.label} sesiones`}
                      />
                      <span className="text-xs opacity-60">{item.label}</span>
                    </div>
                  ))}
                </div>
                <span className="opacity-70">Más</span>
              </div>
            </div>
          </div>

          {/* Stats del calendario - En la parte inferior */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="bg-gradient-to-br from-[#75CDF8] to-[#027CE6] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-darkBackground">{totalSessions}</div>
              <div className="text-sm text-darkBackground opacity-80">Sesiones</div>
            </div>
            <div className="bg-gradient-to-br from-[#027CE6] to-[#002FE1] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-white">{Math.round(totalMinutes / 60)}</div>
              <div className="text-sm text-white opacity-80">Horas</div>
            </div>
          </div>
        </div>

        {/* Mazos Más Estudiados */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base font-bold text-lightNeutral">Mazos Más Estudiados</h3>
          </div>

          <div className="space-y-2">
            {topDecks.map((deck, index) => (
              <div key={deck.deckTitle} className="bg-gradient-to-r from-[#002456] to-[#0C3BEB] rounded-lg p-3 border border-[#75CDF8] border-opacity-20">
                {/* Ranking y título */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-[#75CDF8] text-darkBackground'
                    }`}>
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-medium text-lightNeutral truncate">
                      {deck.deckTitle}
                    </h4>
                  </div>
                  <div className="text-xs text-lightNeutral opacity-70">
                    {deck.totalSessions} sesiones
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-[#002456] rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#75CDF8] to-[#027CE6] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((deck.totalSessions / (topDecks[0]?.totalSessions || 1)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>

                {/* Stats del mazo */}
                <div className="grid grid-cols-3 gap-2 text-xs mt-6">
                  <div className="text-center">
                    <div className="text-[#75CDF8] font-bold">{Math.round(deck.totalMinutes / 60)}</div>
                    <div className="text-lightNeutral opacity-70">Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#75CDF8] font-bold">{deck.averageScore.toFixed(0)}%</div>
                    <div className="text-lightNeutral opacity-70">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#75CDF8] font-bold">{deck.testCount}</div>
                    <div className="text-lightNeutral opacity-70">Tests</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen total */}
          <div className="mt-3 p-3 bg-gradient-to-r from-[#75CDF8] to-[#027CE6] rounded-lg">
            <div className="text-center">
              <div className="text-sm font-bold text-darkBackground">
                {deckProgress.reduce((acc, deck) => acc + deck.totalSessions, 0)} sesiones totales
              </div>
              <div className="text-xs text-darkBackground opacity-80">
                en {deckProgress.length} mazos diferentes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};