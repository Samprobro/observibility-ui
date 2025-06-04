import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { LogEntry } from '@/types/logs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LogsChartProps {
  logs: LogEntry[];
}

const LogsChart = ({ logs }: LogsChartProps) => {
  const chartData = useMemo(() => {
    const logLevels = ['ERROR', 'FATAL', 'WARNING', 'INFO', 'DEBUG'];
    const counts = logLevels.map(
      (level) => logs.filter((log) => log.level === level).length
    );

    return {
      labels: logLevels,
      datasets: [
        {
          label: 'Number of Logs',
          data: counts,
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',  // ERROR - Red
            'rgba(153, 27, 27, 0.7)',  // FATAL - Dark Red
            'rgba(234, 179, 8, 0.7)',  // WARNING - Yellow
            'rgba(59, 130, 246, 0.7)', // INFO - Blue
            'rgba(16, 185, 129, 0.7)', // DEBUG - Emerald
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(153, 27, 27)',
            'rgb(234, 179, 8)',
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
          ],
          borderWidth: 2,
          borderRadius: 8,
          hoverBorderWidth: 3,
          hoverBorderColor: [
            'rgb(239, 68, 68)',
            'rgb(153, 27, 27)',
            'rgb(234, 179, 8)',
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
          ],
          hoverBackgroundColor: [
            'rgba(239, 68, 68, 0.9)',
            'rgba(153, 27, 27, 0.9)',
            'rgba(234, 179, 8, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(16, 185, 129, 0.9)',
          ],
        },
      ],
    };
  }, [logs]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13,
        },
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 600,
        },
        padding: 12,
        boxPadding: 6,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          title: (items) => `${items[0].label} Logs`,
          label: (item) => `Count: ${item.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 8,
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 500,
          },
          padding: 8,
          color: '#4b5563',
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <div className="relative w-full h-[400px] p-4 bg-white rounded-2xl border border-white/10 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/0 rounded-2xl" />
      <div className="relative h-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LogsChart; 