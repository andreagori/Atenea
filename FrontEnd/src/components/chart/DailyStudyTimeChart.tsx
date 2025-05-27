import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyStudyData } from '../../types/analytics.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DailyStudyTimeChartProps {
  data: DailyStudyData[];
  loading?: boolean;
}

export const DailyStudyTimeChart: React.FC<DailyStudyTimeChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-darkSecondary rounded-xl p-6 border border-darkPrimary">
        <div className="animate-pulse">
          <div className="h-6 bg-darkdarkPrimary rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-darkPrimary rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Tiempo de Estudio (minutos)',
        data: data.map(d => d.minutes),
        borderColor: '#BDDAFE',
        backgroundColor: 'rgba(119, 76, 251, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#E9D7F9',
        pointBorderColor: '#0C3BEB',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#002456',
        borderColor: '#75CDF8',
        borderWidth: 1,
        titleColor: '#E9D7F9',
        bodyColor: '#E9D7F9',
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const minutes = context.parsed.y;
            const hours = (minutes / 60).toFixed(1);
            return `${minutes} min (${hours}h)`;
          },
          title: function(context: TooltipItem<'line'>[]) {
            const date = new Date(context[0].label);
            return `Fecha: ${date.toLocaleDateString('es-ES', { 
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
          color: '#0C3BEB',
          drawBorder: false,
        },
        ticks: {
          color: '#E9D7F9',
          font: {
            size: 12,
          },
          callback: function(_: any, index: number) {
            const date = new Date(data[index]?.date);
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          }
        },
      },
      y: {
        grid: {
          color: '#0C3BEB',
          drawBorder: false,
        },
        ticks: {
          color: '#E9D7F9',
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Minutos',
          color: '#E9D7F9',
          font: {
            size: 14,
            weight: 'bold' as const, 
          },
        },
      },
    },
  } as const; 

  return (
    <div className="bg-darkSecondary rounded-xl p-6 border border-darkPrimary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-darkPSText">Tiempo de estudio diario</h3>
        <div className="text-sm text-darkPSText font-bold">
          Total: {data.reduce((acc, d) => acc + d.minutes, 0)} min
        </div>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};