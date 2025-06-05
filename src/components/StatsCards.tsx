import { LogStats } from '@/types/logs';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  BugAntIcon,
  DocumentTextIcon,
  CommandLineIcon,
} from '@heroicons/react/24/solid';

interface StatsCardsProps {
  stats: LogStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const _coloring = {
    fatal: {
      gradient: 'from-red-500/20 via-red-300/20 to-red-100/30',
      iconColor: 'text-red-600',
      borderGlow: 'shadow-red-500/50',
      hoverGlow: 'hover:shadow-red-500/40',
      progressColor: 'bg-red-500',
    },
    error: {
      gradient: 'from-orange-500/20 via-orange-300/20 to-orange-100/30',
      iconColor: 'text-orange-600',
      borderGlow: 'shadow-orange-500/50',
      hoverGlow: 'hover:shadow-orange-500/40',
      progressColor: 'bg-orange-500',
    },
    warning: {
      gradient: 'from-amber-500/20 via-amber-300/20 to-amber-100/30',
      iconColor: 'text-amber-600',
      borderGlow: 'shadow-amber-500/50',
      hoverGlow: 'hover:shadow-amber-500/40',
      progressColor: 'bg-amber-500',
    },
    info: {
      gradient: 'from-blue-500/20 via-blue-300/20 to-blue-100/30',
      iconColor: 'text-blue-600',
      borderGlow: 'shadow-blue-500/50',
      hoverGlow: 'hover:shadow-blue-500/40',
      progressColor: 'bg-blue-500',
    },
    debug: {
      gradient: 'from-emerald-500/20 via-emerald-300/20 to-emerald-100/30',
      iconColor: 'text-emerald-600',
      borderGlow: 'shadow-emerald-500/50',
      hoverGlow: 'hover:shadow-emerald-500/40',
      progressColor: 'bg-emerald-500',
    },
    total: {
      gradient: 'from-violet-500/20 via-violet-300/20 to-violet-100/30',
      iconColor: 'text-violet-600',
      borderGlow: 'shadow-violet-500/50',
      hoverGlow: 'hover:shadow-violet-500/40',
      progressColor: 'bg-violet-500',
    },
  };

  const cards = [
    {
      title: 'Fatal Errors',
      value: stats.fatalCount,
      icon: ExclamationCircleIcon,
      ..._coloring.fatal,
    },
    {
      title: 'Errors',
      value: stats.errorCount,
      icon: ExclamationTriangleIcon,
      ..._coloring.error,
    },
    {
      title: 'Warnings',
      value: stats.warningCount,
      icon: BugAntIcon,
      ..._coloring.warning,
    },
    {
      title: 'Info Logs',
      value: stats.infoCount,
      icon: InformationCircleIcon,
      ..._coloring.info,
    },
    {
      title: 'Debug Logs',
      value: stats.debugCount,
      icon: CommandLineIcon,
      ..._coloring.debug,
    },
    {
      title: 'Total Logs',
      value: stats.totalCount,
      icon: DocumentTextIcon,
      ..._coloring.total,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
            relative group 
            bg-gradient-to-br ${card.gradient}
            backdrop-blur-sm 
            rounded-xl
            border border-white/10
            shadow-md ${card.borderGlow}
            transition-all duration-300 
            hover:scale-102
            hover:shadow-lg ${card.hoverGlow}
            overflow-hidden
          `}
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
          
          <div className="relative p-4 h-full">
            <div className="flex items-center justify-between mb-2">
              <div className={`
                p-2 
                rounded-lg 
                bg-white/80 
                backdrop-blur-sm 
                shadow-inner 
                border border-white/50
              `}>
                <card.icon 
                  className={`h-6 w-6 ${card.iconColor}`} 
                  aria-hidden="true" 
                />
              </div>
              <span className={`text-2xl font-bold ${card.iconColor}`}>
                {card.value.toLocaleString()}
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
                      width: `${(card.value / stats.totalCount) * 100}%`,
                    }}
                  />
                </div>
                <p className={`text-xs font-medium ${card.iconColor}`}>
                  {((card.value / stats.totalCount) * 100).toFixed(1)}% of total
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