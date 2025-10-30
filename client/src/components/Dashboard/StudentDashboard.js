import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Users
} from 'lucide-react';
import { classesAPI, submissionsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery(
    'classes',
    classesAPI.getAll,
    {
      select: (response) => response.data
    }
  );

  // Join class mutation
  const joinClassMutation = useMutation(
    classesAPI.join,
    {
      onSuccess: () => {
        toast.success('Successfully joined class!');
        queryClient.invalidateQueries('classes');
        setJoinCode('');
        setShowJoinForm(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to join class');
      }
    }
  );

  const handleJoinClass = (e) => {
    e.preventDefault();
    if (joinCode.trim()) {
      joinClassMutation.mutate(joinCode.trim());
    }
  };

  if (classesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Enrolled Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {classes.reduce((total, cls) => total + (cls.assignments?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
          <button
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Join Class
          </button>
        </div>

        {/* Join Class Form */}
        {showJoinForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleJoinClass} className="flex gap-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter class code (e.g., CS101)"
                className="input flex-1"
                required
              />
              <button
                type="submit"
                disabled={joinClassMutation.isLoading}
                className="btn-primary"
              >
                {joinClassMutation.isLoading ? 'Joining...' : 'Join'}
              </button>
              <button
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Classes List */}
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Join your first class using a class code from your teacher.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Link
                key={cls._id}
                to={`/class/${cls._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{cls.title}</h3>
                  <span className="badge badge-info">{cls.code}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{cls.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{cls.members?.length || 0} students</span>
                  <span className="mx-2">•</span>
                  <FileText className="w-4 h-4 mr-1" />
                  <span>{cls.assignments?.length || 0} assignments</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Welcome to Classroom Portal!
              </p>
              <p className="text-sm text-gray-500">
                Start by joining a class or exploring the features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;