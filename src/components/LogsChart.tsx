import { useMemo } from 'react';
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
            'rgba(239, 68, 68, 0.5)', // red for ERROR
            'rgba(153, 27, 27, 0.5)', // dark red for FATAL
            'rgba(234, 179, 8, 0.5)',  // yellow for WARNING
            'rgba(59, 130, 246, 0.5)', // blue for INFO
            'rgba(107, 114, 128, 0.5)', // gray for DEBUG
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(153, 27, 27)',
            'rgb(234, 179, 8)',
            'rgb(59, 130, 246)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [logs]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LogsChart; 