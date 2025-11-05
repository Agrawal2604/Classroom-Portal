import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/api/assignments'),
        api.get('/api/submissions')
      ]);
      
      setAssignments(assignmentsRes.data.slice(0, 5)); // Latest 5 assignments
      setSubmissions(submissionsRes.data.slice(0, 5)); // Latest 5 submissions
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>
      
      <div className="grid grid-2">
        <div className="card">
          <h3>Recent Assignments</h3>
          {assignments.length > 0 ? (
            <div>
              {assignments.map(assignment => (
                <div key={assignment._id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/assignments/${assignment._id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{assignment.title}</h4>
                  </Link>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
                    Due: {formatDate(assignment.dueDate)} | {assignment.subject}
                  </p>
                </div>
              ))}
              <Link to="/assignments" className="btn btn-primary" style={{ marginTop: '10px' }}>
                View All Assignments
              </Link>
            </div>
          ) : (
            <p>No assignments available.</p>
          )}
        </div>

        <div className="card">
          <h3>{user.role === 'teacher' ? 'Recent Submissions' : 'My Recent Submissions'}</h3>
          {submissions.length > 0 ? (
            <div>
              {submissions.map(submission => (
                <div key={submission._id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{submission.assignment.title}</h4>
                  {user.role === 'teacher' && (
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>
                      Student: {submission.student.name}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`status-badge status-${submission.status}`}>
                      {submission.status}
                    </span>
                    {submission.grade && (
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        Grade: {submission.grade}/{submission.assignment.maxPoints}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/submissions" className="btn btn-primary" style={{ marginTop: '10px' }}>
                View All Submissions
              </Link>
            </div>
          ) : (
            <p>No submissions available.</p>
          )}
        </div>
      </div>

      {user.role === 'teacher' && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/assignments/create" className="btn btn-primary">
              Create New Assignment
            </Link>
            <Link to="/submissions" className="btn btn-secondary">
              Grade Submissions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;