import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Plus,
  Calendar,
  Clock
} from 'lucide-react';
import { classesAPI, assignmentsAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClass, setNewClass] = useState({ title: '', code: '', description: '' });
  const queryClient = useQueryClient();

  // Fetch classes
  const { data: classes = [], isLoading: classesLoading } = useQuery(
    'classes',
    classesAPI.getAll,
    {
      select: (response) => response.data
    }
  );

  // Create class mutation
  const createClassMutation = useMutation(
    classesAPI.create,
    {
      onSuccess: () => {
        toast.success('Class created successfully!');
        queryClient.invalidateQueries('classes');
        setNewClass({ title: '', code: '', description: '' });
        setShowCreateForm(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create class');
      }
    }
  );

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (newClass.title && newClass.code) {
      createClassMutation.mutate(newClass);
    }
  };

  if (classesLoading) {
    return <LoadingSpinner />;
  }

  const totalStudents = classes.reduce((total, cls) => total + (cls.members?.length || 0), 0);
  const totalAssignments = classes.reduce((total, cls) => total + (cls.assignments?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">My Classes</p>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Grading</p>
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
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Class
          </button>
        </div>

        {/* Create Class Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  placeholder="Class title (e.g., Introduction to Programming)"
                  className="input"
                  required
                />
                <input
                  type="text"
                  value={newClass.code}
                  onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                  placeholder="Class code (e.g., CS101)"
                  className="input"
                  required
                />
              </div>
              <textarea
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                placeholder="Class description (optional)"
                className="input"
                rows="3"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createClassMutation.isLoading}
                  className="btn-primary"
                >
                  {createClassMutation.isLoading ? 'Creating...' : 'Create Class'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes List */}
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first class to start teaching.
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
                <p className="text-sm text-gray-600 mb-3">{cls.description || 'No description'}</p>
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

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
            <Calendar className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900">Schedule Assignment</h3>
            <p className="text-sm text-gray-500">Create a new assignment with due date</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
            <FileText className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Grade Submissions</h3>
            <p className="text-sm text-gray-500">Review and grade student work</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all">
            <Users className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Manage Students</h3>
            <p className="text-sm text-gray-500">View and manage class enrollment</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;