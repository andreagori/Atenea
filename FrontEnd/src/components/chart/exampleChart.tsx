import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const ExampleChart = () => {
  // Datos de ejemplo simplificados
  const exampleData = {
    labels: ['S1', 'S2', 'S3', 'S4', 'S5'],
    datasets: [
      {
        label: 'Correctas',
        data: [12, 15, 18, 16, 20],
        backgroundColor: '#027CE6',
        borderRadius: 4,
      },
      {
        label: 'Incorrectas',
        data: [3, 2, 1, 3, 1],
        backgroundColor: '#FF6266',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFF',
          font: {
            size: 10,
            weight: 'bold' as const,
          },
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 4, 22, 0.95)',
        borderColor: '#A683FF',
        borderWidth: 1,
        titleColor: '#A683FF',
        bodyColor: '#C6B3F8',
        cornerRadius: 6,
        titleFont: { size: 11 },
        bodyFont: { size: 10 },
        padding: 8,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#C6B3F8',
          font: {
            size: 9,
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(166, 131, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#C6B3F8',
          font: {
            size: 9,
          },
          stepSize: 5,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="w-full h-full p-3">
        <Bar data={exampleData} options={options} />

    </div>
  );
};

export default ExampleChart;