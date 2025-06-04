import { NextResponse } from 'next/server';
import { LogEntry } from '@/types/logs';

// This is a mock implementation. Replace with your actual log data source
const generateMockLogs = (): LogEntry[] => {
  const levels = ['ERROR', 'FATAL', 'WARNING', 'INFO', 'DEBUG'] as const;
  const orderStages = [
    'ORDER_RECEIVED',
    'PAYMENT_PROCESSING',
    'PAYMENT_CONFIRMED',
    'ORDER_PROCESSING',
    'ORDER_SHIPPED',
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const orderId = `ORD-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`;
    const orderStage =
      orderStages[Math.floor(Math.random() * orderStages.length)];

    // Generate timestamp between 0 and 10 minutes ago
    const minutesAgo = Math.random() * 100;
    const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

    return {
      id: `log-${i + 1}`,
      timestamp,
      level,
      message: `${level}: ${orderStage} for order ${orderId}`,
      orderId,
      orderStage,
      exception:
        level === 'ERROR' || level === 'FATAL'
          ? 'java.lang.Exception: Something went wrong'
          : undefined,
      details: {
        customerEmail: 'customer@example.com',
        amount: Math.floor(Math.random() * 1000),
        items: Math.floor(Math.random() * 5) + 1,
        minutesAgo: Math.round(minutesAgo * 10) / 10, // Round to 1 decimal place
      },
    };
  });
};

export async function GET() {
  const logs = generateMockLogs();

  const stats = {
    errorCount: logs.filter((log) => log.level === 'ERROR').length,
    fatalCount: logs.filter((log) => log.level === 'FATAL').length,
    warningCount: logs.filter((log) => log.level === 'WARNING').length,
    infoCount: logs.filter((log) => log.level === 'INFO').length,
    debugCount: logs.filter((log) => log.level === 'DEBUG').length,
    totalCount: logs.length,
  };

  return NextResponse.json({ logs, stats });
} 