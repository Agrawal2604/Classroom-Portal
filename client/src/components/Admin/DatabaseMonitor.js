import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Activity, Server } from 'lucide-react';
import { healthAPI, databaseAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const DatabaseMonitor = () => {
  // Fetch health data
  const { data: health, isLoading: healthLoading } = useQuery(
    'health',
    healthAPI.check,
    {
      select: (response) => response.data,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  // Fetch database stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    'database-stats',
    databaseAPI.getStats,
    {
      select: (response) => response.data,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (healthLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Database Monitor</h1>
        <p className="mt-2 text-gray-600">
          Real-time database health and statistics monitoring
        </p>
      </div>

      {/* Connection Status */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Connection Status</h2>
        </div>
        
        {health?.status === 'healthy' ? (
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Database Connected</p>
              <p className="text-sm text-green-600">
                {health.database?.database} on {health.database?.host}:{health.database?.port}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Database Disconnected</p>
              <p className="text-sm text-red-600">Unable to connect to database</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Server className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Collections</p>
              <p className="text-2xl font-bold text-gray-900">
                {health?.database?.collections?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats?.users?.total || 0) + 
                 (stats?.classes?.total || 0) + 
                 (stats?.assignments?.total || 0) + 
                 (stats?.submissions?.total || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Database className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Database Size</p>
              <p className="text-2xl font-bold text-gray-900">~1MB</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {health?.status === 'healthy' ? '✅' : '❌'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Collections Overview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  users
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.users?.total || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  classes
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.classes?.total || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  assignments
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.assignments?.total || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  submissions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.submissions?.total || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="badge badge-success">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DatabaseMonitor;