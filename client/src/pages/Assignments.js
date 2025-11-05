import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${assignmentTitle}"?\n\nThis will permanently delete the assignment and all student submissions. This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await api.delete(`/api/assignments/${assignmentId}?permanent=true`);
        
        // Remove from local state
        setAssignments(assignments.filter(assignment => assignment._id !== assignmentId));
        
        alert('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Assignments</h1>
        {user.role === 'teacher' && (
          <Link to="/assignments/create" className="btn btn-primary">
            Create New Assignment
          </Link>
        )}
      </div>

      {assignments.length > 0 ? (
        <div className="grid">
          {assignments.map(assignment => (
            <div key={assignment._id} className="card assignment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <Link to={`/assignments/${assignment._id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                      {assignment.title}
                    </h3>
                  </Link>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                    {assignment.description.substring(0, 150)}
                    {assignment.description.length > 150 && '...'}
                  </p>
                </div>
                {isOverdue(assignment.dueDate) && (
                  <span className="status-badge status-late">
                    Overdue
                  </span>
                )}
              </div>
              
              <div className="assignment-meta">
                <div>
                  <strong>Subject:</strong> {assignment.subject}<br />
                  <strong>Teacher:</strong> {assignment.teacher.name}<br />
                  <strong>Max Points:</strong> {assignment.maxPoints}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Due Date:</strong><br />
                  <span style={{ color: isOverdue(assignment.dueDate) ? '#dc3545' : '#666' }}>
                    {formatDate(assignment.dueDate)}
                  </span>
                </div>
              </div>
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <Link to={`/assignments/${assignment._id}`} className="btn btn-primary">
                  View Details
                </Link>
                {user.role === 'teacher' && assignment.teacher._id === user.id && (
                  <button 
                    onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                    className="btn btn-danger"
                    style={{ fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No assignments available.</p>
          {user.role === 'teacher' && (
            <Link to="/assignments/create" className="btn btn-primary">
              Create Your First Assignment
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Assignments;