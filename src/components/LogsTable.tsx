import { useState, useEffect } from 'react';
import { LogEntry, LogLevel } from '@/types/logs';
import { format } from 'date-fns';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

interface LogsTableProps {
  logs: LogEntry[];
}

const LogsTable = ({ logs }: LogsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof LogEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<{ [key: string]: number }>({});
  const itemsPerPage = 10;

  // Update time elapsed for each log entry
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeElapsed = logs.reduce((acc, log) => {
        const logTime = new Date(log.timestamp);
        const elapsedSeconds = Math.floor((now.getTime() - logTime.getTime()) / 1000);
        acc[log.id] = elapsedSeconds;
        return acc;
      }, {} as { [key: string]: number });
      setTimeElapsed(newTimeElapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [logs]);

  // Get color based on minutes elapsed
  const getTimeColor = (seconds: number) => {
    const minutes = seconds / 60;
    if (minutes < 5) return 'text-blue-600';
    if (minutes < 7) return 'text-orange-600';
    return 'text-red-600';
  };

  // Format time elapsed with color
  const formatElapsedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return {
      text: `${minutes}m ${remainingSeconds}s`,
      color: getTimeColor(seconds)
    };
  };

  // Check if log is older than 5 minutes
  const isLogOld = (logId: string) => {
    return timeElapsed[logId] >= 300; // 300 seconds = 5 minutes
  };

  // Handle alert for old logs
  const handleOldLogAlert = (log: LogEntry) => {
    if (isLogOld(log.id)) {
      // alert(`Alert: Log entry is ${elapsedTime.text} old!\nLog Message: ${log.message}`);
    }
    setSelectedLog(log);
  };

  // Filter logs
  const filteredLogs = logs.filter((log) =>
    filterLevel === 'ALL' ? true : log.level === filterLevel
  );

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortDirection === 'asc'
        ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
        : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
    }
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  // Paginate logs
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof LogEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getLogLevelColor = (level: LogLevel) => {
    const colors: Record<LogLevel, string> = {
      error: 'text-red-800 bg-red-50',
      warn: 'text-yellow-800 bg-yellow-50',
      info: 'text-blue-800 bg-blue-50',
      debug: 'text-gray-600 bg-gray-50',
    };
    return colors[level];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'ALL')}
            className="block w-32 rounded-md border-gray-300 bg-gray-50 px-4 py-2.5 text-black appearance-none pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="ALL" className="text-gray-400">All Levels</option>
            <option value="error" className="text-black font-medium">Error</option>
            <option value="warn" className="text-black font-medium">Warning</option>
            <option value="info" className="text-black font-medium">Info</option>
            <option value="debug" className="text-black font-medium">Debug</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Timestamp', 'Time Elapsed', 'Level', 'Message', 'Order ID'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    handleSort(
                      header.toLowerCase().replace(' ', '') as keyof LogEntry
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    {header}
                    <span className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortField === header.toLowerCase().replace(' ', '') &&
                          sortDirection === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortField === header.toLowerCase().replace(' ', '') &&
                          sortDirection === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLogs.map((log) => {
              const elapsedTime = formatElapsedTime(timeElapsed[log.id]);
              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ClockIcon className={`h-4 w-4 ${elapsedTime.color}`} />
                      <span className={`font-medium ${elapsedTime.color}`}>
                        {elapsedTime.text}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 text-sm font-medium rounded-full inline-block min-w-[90px] text-center ${getLogLevelColor(
                        log.level
                      )}`}
                    >
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xl break-words">
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {log.orderId || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleOldLogAlert(log)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        timeElapsed[log.id] / 60 >= 5
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      } transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        timeElapsed[log.id] / 60 >= 5 ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
                      }`}
                      title={`Time elapsed: ${elapsedTime.text}`}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination section with improved styling */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium text-gray-900">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-gray-900">
                {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-gray-900">{filteredLogs.length}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Modal with improved styling */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Timestamp</h4>
                <p className="mt-2 text-base font-medium text-gray-900">
                  {format(new Date(selectedLog.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Level</h4>
                <p
                  className={`mt-2 inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${getLogLevelColor(
                    selectedLog.level
                  )}`}
                >
                  {selectedLog.level}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="mt-2 text-base text-gray-900">{selectedLog.message}</p>
              </div>
              {selectedLog.orderId && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order ID</h4>
                  <p className="mt-2 text-base font-medium text-gray-900">{selectedLog.orderId}</p>
                </div>
              )}
              {selectedLog.orderStage && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Stage</h4>
                  <p className="mt-2 text-base text-gray-900">{selectedLog.orderStage}</p>
                </div>
              )}
              {selectedLog.exception && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Exception</h4>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto text-sm text-gray-900 font-mono">
                    {selectedLog.exception}
                  </pre>
                </div>
              )}
              {selectedLog.details && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Additional Details</h4>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto text-sm text-gray-900 font-mono">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent 
                             text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                             transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const jsonData = {
                        id: selectedLog.id,
                        timestamp: selectedLog.timestamp,
                        level: selectedLog.level,
                        message: selectedLog.message,
                        orderId: selectedLog.orderId,
                        orderStage: selectedLog.orderStage,
                        exception: selectedLog.exception,
                        details: selectedLog.details,
                      };
                      alert(JSON.stringify(jsonData, null, 2));
                    }}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent 
                             text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                             transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    View JSON
                  </button>
                  <button
                    onClick={() => {
                      alert(`Pushing this order to Dynatrace\n\nOrder ID: ${selectedLog.orderId}\nStatus: ${selectedLog.orderStage}`);
                    }}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent 
                             text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                             transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v4.586l-2.293-2.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L11 8.586V4a1 1 0 00-1-1z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M4 12a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Push
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsTable; 