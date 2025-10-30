import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Classes API
export const classesAPI = {
  getAll: () => api.get('/classes'),
  create: (classData) => api.post('/classes', classData),
  join: (code) => api.post('/classes/join', { code }),
  getById: (id) => api.get(`/classes/${id}`),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
};

// Assignments API
export const assignmentsAPI = {
  getByClass: (classId) => api.get(`/assignments/class/${classId}`),
  create: (assignmentData) => api.post('/assignments', assignmentData),
  getById: (id) => api.get(`/assignments/${id}`),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Submissions API
export const submissionsAPI = {
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  create: (submissionData) => api.post('/submissions', submissionData),
  grade: (id, gradeData) => api.put(`/submissions/${id}/grade`, gradeData),
  getById: (id) => api.get(`/submissions/${id}`),
};

// Database API
export const databaseAPI = {
  getStats: () => api.get('/database/stats'),
  getDashboard: () => api.get('/database/dashboard'),
  getProfile: () => api.get('/database/profile'),
};

// Health API
export const healthAPI = {
  check: () => axios.get('http://localhost:3001/health'),
  status: () => axios.get('http://localhost:3001/'),
};

export default api;