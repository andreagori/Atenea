import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { MethodDistribution } from '../../types/analytics.types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MethodsDistributionChartProps {
  data: MethodDistribution | null;
  loading?: boolean;
}

export const MethodsDistributionChart: React.FC<MethodsDistributionChartProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="bg-darkPrimaryPurple rounded-xl p-6 border border-darkSecondaryPurple">
        <div className="animate-pulse">
          <div className="h-6 bg-darkSecondaryPurple rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-56 bg-darkSecondaryPurple rounded"></div>
            <div className="h-56 bg-darkSecondaryPurple rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mapear los datos con nombres personalizados
  const customStudyMethods = [
    { method: 'Memorización espaciada', count: data.studyMethods[0]?.count || 15 },
    { method: 'Pruebas simuladas', count: data.studyMethods[1]?.count || 8 },
    { method: 'Pomodoro', count: data.studyMethods[2]?.count || 12 }
  ];

  const customCardTypes = [
    { method: 'Método de Cornell', count: data.learningMethods[0]?.count || 20 },
    { method: 'Carta visual', count: data.learningMethods[1]?.count || 10 },
    { method: 'Repetición activa', count: data.learningMethods[2]?.count || 15 }
  ];

  // Paleta de azules del proyecto
  const studyMethodsData = {
    labels: customStudyMethods.map(m => m.method),
    datasets: [
      {
        data: customStudyMethods.map(m => m.count),
        backgroundColor: [
          '#75CDF8', 
          '#027CE6', 
          '#002FE1', 
        ],
        borderColor: '#1700A4', 
        borderWidth: 2,
        hoverBackgroundColor: [
          '#8DD7FA', 
          '#1A90E8', 
          '#1A47E3', 
        ],
        hoverBorderWidth: 4,
      },
    ],
  };

  // Paleta complementaria en tonos azul-cyan
  const cardTypesData = {
    labels: customCardTypes.map(m => m.method),
    datasets: [
      {
        data: customCardTypes.map(m => m.count),
        backgroundColor: [
          '#0C3BEB', 
          '#729BCE', 
          '#002456', 
        ],
        borderColor: '#1700A4', 
        borderWidth: 2,
        hoverBackgroundColor: [
          '#2651ED', 
          '#85A9D1', 
          '#1A3968', 
        ],
        hoverBorderWidth: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#75CDF8', // darkPSText
          font: {
            size: 11,
            weight: 'bold' as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 4, 22, 0.95)', // darkBackground con transparencia
        borderColor: '#75CDF8', // darkPSText
        borderWidth: 2,
        titleColor: '#75CDF8',
        bodyColor: '#BDDAFE', // darkComponentText
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            return `${context.label}: ${context.parsed} sesiones (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%', // Donut más delgado para mejor legibilidad
  };

  const totalStudySessions = customStudyMethods.reduce((acc, m) => acc + m.count, 0);
  const totalCardTypes = customCardTypes.reduce((acc, m) => acc + m.count, 0);

  return (
    <div className="bg-darkPrimaryPurple rounded-xl p-4 border border-darkSecondaryPurple shadow-lg">
      <h3 className="text-lg font-bold text-lightNeutral mb-4 text-center">
        Distribución de Métodos y Tipos
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Methods */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h4 className="text-base font-semibold text-lightNeutral">Métodos de Estudio</h4>
          </div>
          <div className="h-56"> {/* Aumentado altura */}
            <Doughnut data={studyMethodsData} options={chartOptions} />
          </div>
        </div>

        {/* Card Types */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h4 className="text-base font-semibold text-lightNeutral">Tipos de Cartas</h4>
          </div>
          <div className="h-56"> {/* Aumentado altura */}
            <Doughnut data={cardTypesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Stats Mejoradas */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-[#75CDF8] to-[#027CE6] rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-darkBackground">{totalStudySessions}</div>
          <div className="text-xs text-darkBackground opacity-80">Sesiones</div>
        </div>
        <div className="bg-gradient-to-br from-[#0C3BEB] to-[#002FE1] rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{totalCardTypes}</div>
          <div className="text-xs text-white opacity-80">Cartas</div>
        </div>
        <div className="bg-gradient-to-br from-[#729BCE] to-[#027CE6] rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-darkBackground">
            {Math.round((totalStudySessions / (totalStudySessions + totalCardTypes)) * 100)}%
          </div>
          <div className="text-xs text-darkBackground opacity-80">Estudio</div>
        </div>
        <div className="bg-gradient-to-br from-[#002456] to-[#0C3BEB] rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {Math.round((totalCardTypes / (totalStudySessions + totalCardTypes)) * 100)}%
          </div>
          <div className="text-xs text-white opacity-80">Cartas</div>
        </div>
      </div>

      {/* Método más utilizado */}
      <div className="mt-3 p-3 bg-gradient-to-r from-[#75CDF8] to-[#027CE6] rounded-lg">
        <div className="text-center">
          <span className="text-sm font-medium text-darkBackground">
          Método favorito: 
          </span>
          <span className="ml-2 text-sm font-bold text-darkBackground">
            {customStudyMethods.reduce((prev, current) => 
              (prev.count > current.count) ? prev : current
            ).method}
          </span>
        </div>
      </div>
    </div>
  );
};