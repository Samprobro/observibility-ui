import { LogStats } from '@/types/logs';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  BugAntIcon,
  DocumentTextIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

interface StatsCardsProps {
  stats: LogStats;
}

const _coloring = {
  fatal: {
    iconColor: 'text-red-600',
    progressColor: 'bg-red-500',
    bgGradient: 'bg-gradient-to-br from-red-50 to-white',
  },
  error: {
    iconColor: 'text-orange-600',
    progressColor: 'bg-orange-500',
    bgGradient: 'bg-gradient-to-br from-orange-50 to-white',
  },
  warning: {
    iconColor: 'text-yellow-600',
    progressColor: 'bg-yellow-500',
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-white',
  },
  info: {
    iconColor: 'text-blue-600',
    progressColor: 'bg-blue-500',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-white',
  },
  debug: {
    iconColor: 'text-green-600',
    progressColor: 'bg-green-500',
    bgGradient: 'bg-gradient-to-br from-green-50 to-white',
  },
  total: {
    iconColor: 'text-purple-600',
    progressColor: 'bg-purple-500',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-white',
  },
};

const StatsCards = ({ stats }: StatsCardsProps) => {
  // Calculate total if not provided
  const total = stats.totalCount || Object.values(stats).reduce((sum, count) => sum + (count || 0), 0);

  const calculatePercentage = (value: number) => {
    if (!total) return 0;
    return (value / total) * 100;
  };

  const cards = [
    {
      title: 'Fatal Errors',
      value: stats.fatalCount,
      icon: ExclamationCircleIcon,
      ..._coloring.fatal,
      percentage: calculatePercentage(stats.fatalCount),
    },
    {
      title: 'Errors',
      value: stats.errorCount,
      icon: ExclamationTriangleIcon,
      ..._coloring.error,
      percentage: calculatePercentage(stats.errorCount),
    },
    {
      title: 'Warnings',
      value: stats.warningCount,
      icon: BugAntIcon,
      ..._coloring.warning,
      percentage: calculatePercentage(stats.warningCount),
    },
    {
      title: 'Info Logs',
      value: stats.infoCount,
      icon: InformationCircleIcon,
      ..._coloring.info,
      percentage: calculatePercentage(stats.infoCount),
    },
    {
      title: 'Debug Logs',
      value: stats.debugCount,
      icon: CommandLineIcon,
      ..._coloring.debug,
      percentage: calculatePercentage(stats.debugCount),
    },
    {
      title: 'Total Logs',
      value: total,
      icon: DocumentTextIcon,
      ..._coloring.total,
      percentage: 100,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative p-4 rounded-xl border border-black/5 shadow-sm overflow-hidden ${card.bgGradient}`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              <span className={`text-2xl font-semibold ${card.iconColor}`}>
                {card.value}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className={`text-sm font-medium ${card.iconColor}`}>
                {card.title}
              </h3>

              <div className="space-y-1">
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${card.progressColor} transition-all duration-500 ease-out`}
                    style={{
                      width: `${card.percentage}%`,
                    }}
                  />
                </div>
                <p className={`text-xs font-medium ${card.iconColor}`}>
                  {card.percentage.toFixed(1)}% of total
                </p>
              </div>
            </div>
          </div>

          <div className={`
            absolute -top-8 -right-8 w-16 h-16 
            bg-gradient-radial from-white/30 to-transparent 
            rounded-full blur-xl
          `}></div>
          <div className={`
            absolute -bottom-8 -left-8 w-16 h-16 
            bg-gradient-radial from-white/30 to-transparent 
            rounded-full blur-xl
          `}></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 