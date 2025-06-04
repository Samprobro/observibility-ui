'use client';

import { useState, useEffect } from 'react';
import { LogStats, LogEntry } from '@/types/logs';
import LogsTable from '@/components/LogsTable';
import LogsChart from '@/components/LogsChart';
import StatsCards from '@/components/StatsCards';

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    errorCount: 0,
    fatalCount: 0,
    warningCount: 0,
    infoCount: 0,
    debugCount: 0,
    totalCount: 0,
  });

  // Simulated data fetching - replace with your actual API endpoint
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/logs');
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Log Analysis Dashboard</h1>
        
        <StatsCards stats={stats} />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Log Level Distribution</h2>
          <LogsChart logs={logs} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Log Entries</h2>
          <LogsTable logs={logs} />
        </div>
      </div>
    </main>
  );
}
