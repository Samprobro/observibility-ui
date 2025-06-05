import { LogEntry, LogLevel } from '@/types/logs';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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

export default function LogsChart({ logs }: LogsChartProps) {
  // Count logs by level
  const logCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<LogLevel, number>);

  const chartData = {
    labels: ['Error', 'Warning', 'Info', 'Debug'],
    datasets: [
      {
        label: 'Number of Logs',
        data: [
          logCounts['error'] || 0,
          logCounts['warn'] || 0,
          logCounts['info'] || 0,
          logCounts['debug'] || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',  // red-500 with opacity
          'rgba(234, 179, 8, 0.5)',   // yellow-500 with opacity
          'rgba(59, 130, 246, 0.5)',  // blue-500 with opacity
          'rgba(107, 114, 128, 0.5)', // gray-500 with opacity
        ],
        borderColor: [
          'rgb(239, 68, 68)',   // red-500
          'rgb(234, 179, 8)',   // yellow-500
          'rgb(59, 130, 246)',  // blue-500
          'rgb(107, 114, 128)', // gray-500
        ],
        borderWidth: 1,
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
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0;
            const total = logs.length;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `Count: ${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="relative h-[300px] w-full">
      <Bar data={chartData} options={options} />
      <div className="absolute bottom-0 w-full flex justify-center gap-4 pb-2">
        {chartData.labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: chartData.datasets[0].borderColor[index] as string }}
            />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 