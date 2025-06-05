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
import ArchivedLogsTable from '@/components/ArchivedLogsTable';

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
  const [activeTab, setActiveTab] = useState('current');

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
        <div className="bg-[#eceaea] rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200/30">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Sales Order Digital Twin
              </h1>
              <div className="h-8 w-px bg-gray-300/50"></div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/80 text-gray-600 shadow-sm">
                Production
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreferencesClick}
                className="p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                title="Open Preferences"
              >
                <AdjustmentsHorizontalIcon className="w-6 h-6" />
                <span className="sr-only">Preferences</span>
              </button>
              <button
                onClick={handleSettingsClick}
                className="p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white rounded-lg transition-all duration-200 shadow-sm"
                title="Open Settings"
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span className="sr-only">Settings</span>
              </button>
              <button
                onClick={handleLiveToggle}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm
                  ${isLive 
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'}`}
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
          <div className="px-8 py-3 bg-white/40 backdrop-blur-sm">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Environment:</span>
                <span>Production</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Region:</span>
                <span>US-West</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Last Updated:</span>
                <span>Just now</span>
              </div>
            </div>
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
        
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('current')}
                className={`${
                  activeTab === 'current'
                    ? 'border-indigo-500 text-indigo-600 relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-indigo-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 font-medium text-sm border-b-2 transition-all duration-200 ease-in-out flex items-center space-x-2`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${activeTab === 'current' ? 'text-indigo-600' : 'text-gray-400'}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>Current Logs</span>
                {activeTab === 'current' && (
                  <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('archived')}
                className={`${
                  activeTab === 'archived'
                    ? 'border-indigo-500 text-indigo-600 relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-indigo-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 font-medium text-sm border-b-2 transition-all duration-200 ease-in-out flex items-center space-x-2`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${activeTab === 'archived' ? 'text-indigo-600' : 'text-gray-400'}`}
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Archived Records</span>
                {activeTab === 'archived' && (
                  <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'current' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <span>Log Entries</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Live</span>
                </h3>
                <LogsTable logs={logs} />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                  <span>Archived Records</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Historical</span>
                </h3>
                <ArchivedLogsTable logs={logs} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
