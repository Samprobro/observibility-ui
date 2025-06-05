import { LogEntry, OrderFlow } from '@/types/logs';
import WorkflowDiagram from './WorkflowDiagram';

interface WorkflowTableProps {
  logs: LogEntry[];
}

export default function WorkflowTable({ logs }: WorkflowTableProps) {
  // Extract orderId from the first log entry
  const orderId = logs[0]?.orderId || '';

  // Group logs by orderId to create workflows and track current stage
  const workflows = logs.reduce((acc, log) => {
    if (log.orderId) {
      if (!acc[log.orderId]) {
        acc[log.orderId] = {
          orderId: log.orderId,
          stages: []
        };
      }
      if (log.orderStage) {
        acc[log.orderId].stages.push({
          stage: log.orderStage,
          timestamp: log.timestamp,
          status: log.level === 'error' ? 'error' : 
                 log.level === 'warn' ? 'pending' : 'success'
        });
      }
    }
    return acc;
  }, {} as Record<string, OrderFlow>);

  // Get current stage for the order
  const currentStage = workflows[orderId]?.stages.slice(-1)[0]?.stage || 'Unknown';

  // Transform workflow stages for diagram
  const workflowStages = [
    {
      id: 'order-received',
      name: 'Order Received',
      status: 'completed' as const,
      timestamp: '2024-03-05T15:30:00',
      details: {
        customer: 'John Doe',
        total: '$599.99',
        items: 3
      }
    },
    {
      id: 'payment-processing',
      name: 'Payment Processing',
      status: 'completed' as const,
      timestamp: '2024-03-05T15:31:00',
      details: {
        method: 'Credit Card',
        transaction: 'TXN-789012'
      }
    },
    {
      id: 'inventory-check',
      name: 'Inventory Check',
      status: 'completed' as const,
      timestamp: '2024-03-05T15:32:00',
      details: {
        warehouse: 'NYC-01',
        availability: 'In Stock'
      }
    },
    {
      id: 'packaging',
      name: 'Packaging',
      status: 'completed' as const,
      timestamp: '2024-03-05T15:45:00',
      details: {
        package: 'Standard Box',
        weight: '2.5 kg'
      }
    },
    {
      id: 'shipping',
      name: 'Shipping',
      status: 'in-progress' as const,
      timestamp: '2024-03-05T16:00:00',
      details: {
        carrier: 'FedEx',
        tracking: 'FDX123456789'
      }
    },
    {
      id: 'delivery',
      name: 'Delivery',
      status: 'pending' as const,
      details: {
        eta: '2024-03-07',
        address: '123 Main St'
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">Order Flow:</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {currentStage}
              </span>
            </div>
          </div>
        </div>
        <WorkflowDiagram stages={workflowStages} />
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Detailed Log History</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${log.level === 'error' ? 'bg-red-100 text-red-800' :
                          log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                          log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.orderStage || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.service}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 