import { useState } from 'react';
import { LogEntry, LogLevel } from '@/types/logs';

interface ArchivedLogsTableProps {
  logs: LogEntry[];
}

interface Filters {
  orderId: string;
  level: LogLevel | '';
  startDate: string;
  endDate: string;
}

export default function ArchivedLogsTable({ logs }: ArchivedLogsTableProps) {
  const [filters, setFilters] = useState<Filters>({
    orderId: '',
    level: '',
    startDate: '',
    endDate: '',
  });

  const filteredLogs = logs.filter(log => {
    const matchesOrderId = !filters.orderId || log.orderId?.toLowerCase().includes(filters.orderId.toLowerCase());
    const matchesLevel = !filters.level || log.level === filters.level;
    const matchesDateRange = (!filters.startDate || new Date(log.timestamp) >= new Date(filters.startDate)) &&
                           (!filters.endDate || new Date(log.timestamp) <= new Date(filters.endDate));
    
    return matchesOrderId && matchesLevel && matchesDateRange;
  });

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        {/* <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={filters.orderId}
              onChange={(e) => setFilters(prev => ({ ...prev, orderId: e.target.value }))}
              placeholder="Enter Order ID"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-black placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Log Level
            </label>
            <select
              id="level"
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value as LogLevel | '' }))}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-black placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
              <option value="DEBUG">Debug</option>
              <option value="FATAL">Fatal</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-black placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2.5 text-black placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={() => setFilters({ orderId: '', level: '', startDate: '', endDate: '' })}
            className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-md shadow-sm hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Find Trace
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredLogs.length} of {logs.length} records
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trace ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                      log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                      log.level === 'INFO' ? 'bg-blue-100 text-blue-800' :
                      log.level === 'FATAL' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'}`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.orderId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.traceId || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xl truncate">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 