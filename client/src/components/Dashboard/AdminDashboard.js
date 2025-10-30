import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  FileText, 
  Database,
  Settings,
  Activity,
  TrendingUp
} from 'lucide-react';
import { databaseAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const AdminDashboard = () => {
  // Fetch database stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    'database-stats',
    databaseAPI.getStats,
    {
      select: (response) => response.data,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (statsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.users?.students || 0} students, {stats?.users?.teachers || 0} teachers
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.classes?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.classes?.active || 0} with assignments
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.assignments?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.assignments?.upcoming || 0} upcoming
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.submissions?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.submissions?.graded || 0} graded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/database"
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Database className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Database Monitor</h3>
            <p className="text-sm text-gray-500">View database statistics and health</p>
          </Link>
          
          <Link
            to="/system"
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Settings className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">System Status</h3>
            <p className="text-sm text-gray-500">Check system health and connectivity</p>
          </Link>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
            <Activity className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Activity Logs</h3>
            <p className="text-sm text-gray-500">View system activity and user logs</p>
          </button>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Students</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.users?.students || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Teachers</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.users?.teachers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Admins</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.users?.admins || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.assignments?.upcoming || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.assignments?.overdue || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Late Submissions</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats?.submissions?.late || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;