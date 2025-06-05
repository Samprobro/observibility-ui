import { LogLevel } from '@/types/logs';

const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
const services = ['order-service', 'payment-service', 'inventory-service', 'shipping-service'];
const stages = [
  'order-received',
  'payment-processing',
  'inventory-check',
  'packaging',
  'shipping',
  'delivery'
];

export async function GET() {
  return Response.json({
    logs: Array.from({ length: 50 }, (_, i) => {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const orderId = `ORD-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(6, '0')}`;
      const orderStage = stages[Math.floor(Math.random() * stages.length)];
      const minutesAgo = Math.floor(Math.random() * 60);

      return {
        id: `log-${i}`,
        timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
        level,
        message: `${level.toUpperCase()}: Processing order ${orderId} in stage ${orderStage}`,
        orderId,
        orderStage,
        service,
        exception: level === 'error' ? 'Error processing order' : undefined,
        details: {
          customerEmail: 'customer@example.com',
          amount: Math.floor(Math.random() * 1000),
          items: Math.floor(Math.random() * 5) + 1,
          minutesAgo
        }
      };
    }),
    stats: {
      errorCount: Math.floor(Math.random() * 10),
      fatalCount: 0, // Removed since we don't have 'fatal' in LogLevel
      warningCount: Math.floor(Math.random() * 20),
      infoCount: Math.floor(Math.random() * 50),
      debugCount: Math.floor(Math.random() * 30),
      totalCount: 50
    }
  });
} 