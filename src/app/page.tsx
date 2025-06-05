'use client';

import { useState, useEffect } from 'react';
import { LogStats, LogEntry } from '@/types/logs';
import LogsTable from '@/components/LogsTable';
import LogsChart from '@/components/LogsChart';
import StatsCards from '@/components/StatsCards';
import {
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
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

  const handlePreferencesClick = () => {
    alert('Opening Preferences Panel\n\nCustomize your dashboard settings, filters, and view options.');
  };

  const handleSettingsClick = () => {
    alert('Opening Settings Menu\n\nConfigure application settings, API endpoints, and notification preferences.');
  };

  const handleLiveToggle = () => {
    setIsLive(!isLive);
    alert(`${!isLive ? 'Enabling' : 'Disabling'} Live Updates\n\nData refresh interval: ${!isLive ? '5 minutes' : 'paused'}`);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sales Order Digital Twin</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreferencesClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Open Preferences"
            >
              <AdjustmentsHorizontalIcon className="w-6 h-6" />
              <span className="sr-only">Preferences</span>
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Open Settings"
            >
              <Cog6ToothIcon className="w-6 h-6" />
              <span className="sr-only">Settings</span>
            </button>
            <button
              onClick={handleLiveToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200
                ${isLive 
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title={isLive ? 'Disable Live Updates' : 'Enable Live Updates'}
            >
              <SignalIcon className="w-5 h-5" />
              <span>Live</span>
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Log Analysis Dashboard</h2>
          <StatsCards stats={stats} />
        </div>        
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Log Level Distribution</h2>
          <LogsChart logs={logs} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Log Entries</h2>
          <LogsTable logs={logs} />
        </div>
      </div>
    </main>
  );
}
