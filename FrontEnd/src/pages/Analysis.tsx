import { useState } from 'react';
import { NavbarLoginIn } from "../components/Navbar";
import { AnalyticsFilters } from "../components/AnaliticsFilter";
import { DailyStudyTimeChart } from "../components/chart/DailyStudyTimeChart";
import { TestScoresChart } from "../components/chart/TestScoresChart";
import { MethodsDistributionChart } from "../components/chart/MethodsDistributionChart";
import { ActivityCalendarChart } from "../components/chart/ActivityCalendarChart";
import { SessionsPerformanceChart } from "../components/chart/SessionsPerformanceChart";
import { SpacedRepetitionChart } from "../components/chart/SpacedRepetitionChart";
import { useAnalytics } from "../hooks/useAnalytics";
import { TimeRange } from "../types/analytics.types";

const Analisis = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>({ days: 30 });
  const { data, loading, error } = useAnalytics(timeRange);

  if (error) {
    return (
      <div className="flex flex-col w-full min-h-screen items-center font-primary"
        style={{
          backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
        }}>
        <NavbarLoginIn />
        <div className="flex flex-col items-center mt-20 w-full h-full p-6">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Error cargando datos: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen items-center font-primary"
      style={{
        backgroundImage: "radial-gradient(circle at center, #0D1529, #000416)"
      }}>
      <NavbarLoginIn />
      <div className="flex flex-col items-center mt-20 w-full h-full px-6 max-w-7xl">
        <h1 className="text-6xl text-lightComponent font-bold text-center mb-2">
          Análisis
        </h1>
        <p className='text-lg text-lightComponent text-center mb-8'>
          Revisa tu progreso y rendimiento de estudio con gráficos interactivos y filtros personalizados.
        </p>
        {/* Filtros */}
        <div className="w-5/6">
          <AnalyticsFilters
            onTimeRangeChange={setTimeRange}
            currentTimeRange={timeRange}
          />


          {/* Grid de Gráficas */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Tiempo de Estudio Diario - Ancho completo */}

            {/* Puntuaciones en Tests */}
            <TestScoresChart data={data.testScores} loading={loading} />

            {/* Distribución de Métodos */}
            <MethodsDistributionChart data={data.methodsDistribution} loading={loading} />

            <div className="lg:col-span-2">
              <DailyStudyTimeChart data={data.dailyStudyTime} loading={loading} />
            </div>

            {/* Rendimiento por Sesión */}
            <SessionsPerformanceChart data={data.sessionsPerformance} loading={loading} />
            {/* Memorización Espaciada */}
            <SpacedRepetitionChart data={data.spacedRepetitionStats} loading={loading} />
            {/* Calendario de Actividad - Ancho completo */}
            <div className="lg:col-span-2">
              <ActivityCalendarChart data={data.activityCalendar} deckProgress={data.deckProgress} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analisis;