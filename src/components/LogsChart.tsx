import { LogEntry, LogStats } from '@/types/logs';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
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
  // Convert logs to stats object to match StatsCards
  const stats: LogStats = logs.reduce((acc, log) => {
    switch (log.level) {
      case 'error':
        acc.errorCount++;
        break;
      case 'warn':
        acc.warningCount++;
        break;
      case 'info':
        acc.infoCount++;
        break;
      case 'debug':
        acc.debugCount++;
        break;
    }
    acc.totalCount++;
    return acc;
  }, {
    errorCount: 0,
    fatalCount: 0,
    warningCount: 0,
    infoCount: 0,
    debugCount: 0,
    totalCount: 0,
  } as LogStats);

  const calculatePercentage = (value: number) => {
    if (!stats.totalCount) return 0;
    return (value / stats.totalCount) * 100;
  };

  const chartData = {
    labels: ['Fatal', 'Error', 'Warning', 'Info', 'Debug'],
    datasets: [
      {
        label: 'Number of Logs',
        data: [
          stats.fatalCount,
          stats.errorCount,
          stats.warningCount,
          stats.infoCount,
          stats.debugCount,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.5)',   // red-500 with opacity (Fatal)
          'rgba(249, 115, 22, 0.5)',  // orange-500 with opacity (Error)
          'rgba(234, 179, 8, 0.5)',   // yellow-500 with opacity (Warning)
          'rgba(59, 130, 246, 0.5)',  // blue-500 with opacity (Info)
          'rgba(34, 197, 94, 0.5)',   // green-500 with opacity (Debug)
        ],
        borderColor: [
          'rgb(239, 68, 68)',    // red-500 (Fatal)
          'rgb(249, 115, 22)',   // orange-500 (Error)
          'rgb(234, 179, 8)',    // yellow-500 (Warning)
          'rgb(59, 130, 246)',   // blue-500 (Info)
          'rgb(34, 197, 94)',    // green-500 (Debug)
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
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
          label: (context: TooltipItem<'bar'>) => {
            const value = context.raw as number || 0;
            const percentage = calculatePercentage(value);
            return [
              `Count: ${value}`,
              `Percentage: ${percentage.toFixed(1)}%`
            ];
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          precision: 0,
          callback: (value) => {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Number of Logs',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'normal'
          }
        }
      },
      x: {
        type: 'category',
        grid: {
          display: false
        },
        ticks: {
          padding: 12
        }
      }
    },
    layout: {
      padding: {
        bottom: 50
      }
    }
  };

  return (
    <div className="relative h-[350px] w-full">
      <Bar data={chartData} options={options} />
      <br /> 
      <div className="absolute bottom-4 w-full flex justify-center gap-4 pb-2 mt-1 pt-15">
        {chartData.labels.map((label, index) => {
          const count = chartData.datasets[0].data[index];
          const percentage = calculatePercentage(count);
          return (
            <div key={label} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: chartData.datasets[0].borderColor[index] as string }}
              />
              <span className="text-sm text-gray-600 font-medium">
                {label} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 