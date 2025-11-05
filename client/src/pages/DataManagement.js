import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const DataManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (user?.role === 'teacher') {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [usersRes, assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/api/auth/users'), // We'll need to create this endpoint
        api.get('/api/assignments'),
        api.get('/api/submissions')
      ]);
      
      setUsers(usersRes.data || []);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"?\n\nThis will permanently delete the user and all their related data. This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await api.delete(`/api/auth/user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully!');
        
        // Refresh all data since related assignments/submissions may be affected
        fetchAllData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId, assignmentTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${assignmentTitle}"?\n\nThis will permanently delete the assignment and all student submissions. This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await api.delete(`/api/assignments/${assignmentId}?permanent=true`);
        setAssignments(assignments.filter(a => a._id !== assignmentId));
        alert('Assignment deleted successfully!');
        
        // Refresh submissions since they may be affected
        fetchAllData();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleDeleteSubmission = async (submissionId, assignmentTitle, studentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the submission by ${studentName} for "${assignmentTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await api.delete(`/api/submissions/${submissionId}`);
        setSubmissions(submissions.filter(s => s._id !== submissionId));
        alert('Submission deleted successfully!');
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission. Please try again.');
      }
    }
  };

  const handleBulkDelete = async (type) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ALL ${type}?\n\nThis will permanently delete all ${type} and cannot be undone.`
    );
    
    if (confirmDelete) {
      const secondConfirm = window.confirm(
        `This is your final warning. You are about to delete ALL ${type}.\n\nType "DELETE" in the next prompt to confirm.`
      );
      
      if (secondConfirm) {
        const finalConfirm = prompt('Type "DELETE" to confirm bulk deletion:');
        if (finalConfirm === 'DELETE') {
          try {
            // Implementation would depend on creating bulk delete endpoints
            alert(`Bulk delete for ${type} would be implemented here`);
          } catch (error) {
            console.error(`Error bulk deleting ${type}:`, error);
            alert(`Failed to bulk delete ${type}. Please try again.`);
          }
        }
      }
    }
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="container">
        <div className="card">
          <h2>Access Denied</h2>
          <p>Only teachers can access the data management page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Data Management</h1>
      <p>Manage users, assignments, and submissions. Use with caution - deletions are permanent.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '10px' }}
        >
          Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`btn ${activeTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '10px' }}
        >
          Assignments ({assignments.length})
        </button>
        <button 
          onClick={() => setActiveTab('submissions')}
          className={`btn ${activeTab === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Submissions ({submissions.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Users Management</h3>
            <button 
              onClick={() => handleBulkDelete('users')}
              className="btn btn-danger"
            >
              Delete All Users
            </button>
          </div>
          
          {users.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userData => (
                    <tr key={userData._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{userData.name}</td>
                      <td style={{ padding: '10px' }}>{userData.email}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`status-badge ${userData.role === 'teacher' ? 'status-graded' : 'status-submitted'}`}>
                          {userData.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{userData.studentId || '-'}</td>
                      <td style={{ padding: '10px' }}>
                        {userData._id !== user.id && (
                          <button 
                            onClick={() => handleDeleteUser(userData._id, userData.name)}
                            className="btn btn-danger"
                            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Assignments Management</h3>
            <button 
              onClick={() => handleBulkDelete('assignments')}
              className="btn btn-danger"
            >
              Delete All Assignments
            </button>
          </div>
          
          {assignments.length > 0 ? (
            <div className="grid">
              {assignments.map(assignment => (
                <div key={assignment._id} className="card" style={{ backgroundColor: '#f8f9fa' }}>
                  <h4>{assignment.title}</h4>
                  <p><strong>Subject:</strong> {assignment.subject}</p>
                  <p><strong>Teacher:</strong> {assignment.teacher?.name}</p>
                  <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <p><strong>Points:</strong> {assignment.maxPoints}</p>
                  
                  <div style={{ marginTop: '15px' }}>
                    <button 
                      onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                      className="btn btn-danger"
                    >
                      Delete Assignment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No assignments found.</p>
          )}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Submissions Management</h3>
            <button 
              onClick={() => handleBulkDelete('submissions')}
              className="btn btn-danger"
            >
              Delete All Submissions
            </button>
          </div>
          
          {submissions.length > 0 ? (
            <div className="grid">
              {submissions.map(submission => (
                <div key={submission._id} className="card" style={{ backgroundColor: '#f8f9fa' }}>
                  <h4>{submission.assignment?.title}</h4>
                  <p><strong>Student:</strong> {submission.student?.name}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge status-${submission.status}`} style={{ marginLeft: '10px' }}>
                      {submission.status}
                    </span>
                  </p>
                  {submission.grade && (
                    <p><strong>Grade:</strong> {submission.grade}/{submission.assignment?.maxPoints}</p>
                  )}
                  <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                  
                  <div style={{ marginTop: '15px' }}>
                    <button 
                      onClick={() => handleDeleteSubmission(
                        submission._id, 
                        submission.assignment?.title, 
                        submission.student?.name
                      )}
                      className="btn btn-danger"
                    >
                      Delete Submission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No submissions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DataManagement;