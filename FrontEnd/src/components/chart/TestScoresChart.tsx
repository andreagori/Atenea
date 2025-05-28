import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TestScoreData } from '../../types/analytics.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestScoresChartProps {
  data: TestScoreData[];
  loading?: boolean;
}

export const TestScoresChart: React.FC<TestScoresChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-darkPrimaryPurple rounded-xl p-6 border border-darkSecondaryPurple">
        <div className="animate-pulse">
          <div className="h-6 bg-darkSecondaryPurple rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-darkSecondaryPurple rounded"></div>
        </div>
      </div>
    );
  }

  // Crear gradiente morado vibrante para las barras
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#A683FF');  // darkSecondaryPurple - Morado claro
    gradient.addColorStop(0.5, '#8C4FFF'); // darkSecondaryPurple2 - Morado medio
    gradient.addColorStop(1, '#5311F8');   // darkPrimaryPurple - Morado profundo
    return gradient;
  };

  const chartData = {
    labels: data.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: 'Puntuación (%)',
        data: data.map(d => d.score),
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx} = chart;
          return createGradient(ctx);
        },
        borderColor: '#A683FF', // Borde morado claro
        borderWidth: 2,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        // Efecto de hover más dramático
        hoverBackgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx} = chart;
          const hoverGradient = ctx.createLinearGradient(0, 0, 0, 400);
          hoverGradient.addColorStop(0, '#C6B3F8');  // Morado más brillante
          hoverGradient.addColorStop(0.5, '#A683FF'); // Morado claro
          hoverGradient.addColorStop(1, '#8C4FFF');   // Morado medio
          return hoverGradient;
        },
        hoverBorderColor: '#C6B3F8',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10, // Reducir padding superior
        bottom: 5, // Reducir padding inferior
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 4, 22, 0.95)', // darkBackground
        borderColor: '#A683FF',
        borderWidth: 2,
        titleColor: '#A683FF',
        bodyColor: '#C6B3F8',
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const score = context.parsed.y;
            const deckTitle = data[dataIndex]?.deckTitle;
            return [`Puntuación: ${score}%`, `Deck: ${deckTitle}`];
          },
          title: function(context: any) {
            const dataIndex = context[0].dataIndex;
            const date = new Date(data[dataIndex]?.date);
            return `${date.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(166, 131, 255, 0.1)', // Grid con tinte morado
          drawBorder: false,
        },
        ticks: {
          color: '#C6B3F8', // darkInfo
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 5, // Reducir padding
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(166, 131, 255, 0.1)', // Grid con tinte morado
          drawBorder: false,
        },
        ticks: {
          color: '#C6B3F8', // darkInfo
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 5, // Reducir padding
          callback: function(value: any) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Puntuación (%)',
          color: '#A683FF', // Título en morado claro
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: 10, // Reducir padding del título
        },
      },
    },
  };

  const averageScore = data.length > 0 
    ? Math.round(data.reduce((acc, d) => acc + d.score, 0) / data.length)
    : 0;

  // Determinar color del promedio basado en el score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-darkPrimaryPurple rounded-xl p-4 border border-darkSecondaryPurple shadow-lg">
      {/* Header más compacto */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-lightNeutral">Puntuaciones en Tests</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-lightNeutral font-bold">Promedio:</span>
          <span className={`text-lg font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}%
          </span>
        </div>
      </div>
      
      {/* Gráfica con mayor altura */}
      <div className="h-80"> {/* Aumentado de h-64 a h-80 */}
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Estadísticas adicionales compactas */}
      {data.length > 0 && (
        <div className="mt-10 grid grid-cols-3 gap-2 text-xs font-bold">
          <div className="bg-gradient-to-br from-[#5311F8] to-[#2A0B7B] rounded-lg p-2 text-center">
            <div className="text-white font-bold">{Math.max(...data.map(d => d.score))}%</div>
            <div className="text-white opacity-80">Máximo</div>
          </div>
          <div className="bg-gradient-to-br from-[#5311F8] to-[#2A0B7B] rounded-lg p-2 text-center">
            <div className="text-white font-bold">{Math.min(...data.map(d => d.score))}%</div>
            <div className="text-white opacity-80">Mínimo</div>
          </div>
          <div className="bg-gradient-to-br from-[#5311F8] to-[#2A0B7B] rounded-lg p-2 text-center">
            <div className="text-white font-bold">{data.length}</div>
            <div className="text-white opacity-80">Tests</div>
          </div>
        </div>
      )}
    </div>
  );
};