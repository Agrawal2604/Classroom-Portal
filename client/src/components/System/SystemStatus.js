import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Server, Database, Wifi } from 'lucide-react';
import { healthAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const SystemStatus = () => {
  // Fetch health data
  const { data: health, isLoading: healthLoading, error } = useQuery(
    'system-health',
    healthAPI.check,
    {
      select: (response) => response.data,
      refetchInterval: 5000, // Refetch every 5 seconds
      retry: 1,
    }
  );

  if (healthLoading) {
    return <LoadingSpinner />;
  }

  const isHealthy = health?.status === 'healthy';
  const isDatabaseConnected = health?.database?.status === 'connected';

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
        <p className="mt-2 text-gray-600">
          Real-time system health monitoring and connectivity status
        </p>
      </div>

      {/* Overall Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Overall System Status</h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
              {isHealthy ? 'All Systems Operational' : 'System Issues Detected'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Backend Status */}
          <div className={`p-4 rounded-lg ${isHealthy ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              <Server className={`h-6 w-6 mr-3 ${isHealthy ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className={`text-sm font-medium ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
                  Backend API
                </p>
                <p className={`text-xs ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {isHealthy ? 'Running on port 3001' : 'Connection failed'}
                </p>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className={`p-4 rounded-lg ${isDatabaseConnected ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              <Database className={`h-6 w-6 mr-3 ${isDatabaseConnected ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className={`text-sm font-medium ${isDatabaseConnected ? 'text-green-800' : 'text-red-800'}`}>
                  Database
                </p>
                <p className={`text-xs ${isDatabaseConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isDatabaseConnected ? `MongoDB Connected` : 'Database offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Frontend Status */}
          <div className="p-4 rounded-lg bg-green-50">
            <div className="flex items-center">
              <Wifi className="h-6 w-6 mr-3 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-800">Frontend</p>
                <p className="text-xs text-green-600">React App Running</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Environment</span>
              <span className="text-sm font-medium text-gray-900">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Frontend Port</span>
              <span className="text-sm font-medium text-gray-900">3000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Backend Port</span>
              <span className="text-sm font-medium text-gray-900">3001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-gray-900">
                {health?.database?.database || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">API Base URL</span>
              <span className="text-sm font-medium text-gray-900">http://localhost:3001/api</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database Host</span>
              <span className="text-sm font-medium text-gray-900">
                {health?.database?.host || 'Unknown'}:{health?.database?.port || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Collections</span>
              <span className="text-sm font-medium text-gray-900">
                {health?.database?.collections?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-gray-900">
                {isHealthy ? '< 100ms' : 'Timeout'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Information */}
      {error && (
        <div className="card">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Connection Error</h3>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              {error.message || 'Unable to connect to the backend server. Please ensure the server is running on port 3001.'}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Activity className="h-6 w-6 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Refresh Status</h4>
            <p className="text-sm text-gray-500">Reload system status</p>
          </button>
          
          <a
            href="http://localhost:3001/health"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Server className="h-6 w-6 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">API Health</h4>
            <p className="text-sm text-gray-500">Check API endpoint directly</p>
          </a>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
            <Database className="h-6 w-6 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">Database Info</h4>
            <p className="text-sm text-gray-500">View database details</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;