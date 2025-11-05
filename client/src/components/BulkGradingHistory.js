import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const BulkGradingHistory = ({ onClose }) => {
  const [bulkOperations, setBulkOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBulkGradingHistory();
  }, []);

  const fetchBulkGradingHistory = async () => {
    try {
      // Get all submissions with bulk_update history
      const response = await api.get('/api/submissions');
      const submissions = response.data;
      
      // Group bulk operations by date and teacher
      const bulkOps = {};
      
      submissions.forEach(submission => {
        if (submission.gradeHistory) {
          submission.gradeHistory.forEach(history => {
            if (history.changeType === 'bulk_update') {
              const key = `${history.gradedBy._id}_${new Date(history.gradedAt).toDateString()}`;
              
              if (!bulkOps[key]) {
                bulkOps[key] = {
                  date: history.gradedAt,
                  teacher: history.gradedBy,
                  submissions: [],
                  totalGraded: 0
                };
              }
              
              bulkOps[key].submissions.push({
                student: submission.student,
                assignment: submission.assignment,
                grade: history.grade,
                feedback: history.feedback
              });
              bulkOps[key].totalGraded++;
            }
          });
        }
      });
      
      setBulkOperations(Object.values(bulkOps).sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      setError('Failed to load bulk grading history');
      console.error('Error fetching bulk grading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, minWidth: '400px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading bulk grading history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, minWidth: '400px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: '#dc3545' }}>{error}</p>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          zIndex: 999 
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="card" style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        zIndex: 1000, 
        minWidth: '600px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📊 Bulk Grading History</h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
            ✕
          </button>
        </div>

        {bulkOperations.length > 0 ? (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {bulkOperations.map((operation, index) => (
              <div 
                key={index}
                style={{ 
                  marginBottom: '20px', 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #17a2b8'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <h5 style={{ margin: 0, color: '#495057' }}>
                      📊 Bulk Operation
                    </h5>
                    <small style={{ color: '#6c757d' }}>
                      {formatDate(operation.date)} by {operation.teacher.name}
                    </small>
                  </div>
                  <div style={{ 
                    backgroundColor: '#17a2b8', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {operation.totalGraded} submissions
                  </div>
                </div>
                
                <div style={{ marginTop: '10px' }}>
                  <strong style={{ fontSize: '0.9rem' }}>Graded Submissions:</strong>
                  <div style={{ marginTop: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                    {operation.submissions.map((sub, subIndex) => (
                      <div 
                        key={subIndex}
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '6px 0',
                          borderBottom: subIndex < operation.submissions.length - 1 ? '1px solid #dee2e6' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem' }}>
                          <strong>{sub.student.name}</strong>
                          <div style={{ color: '#6c757d' }}>{sub.assignment.title}</div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                          <strong style={{ color: '#28a745' }}>Grade: {sub.grade}</strong>
                          {sub.feedback && (
                            <div style={{ color: '#6c757d', fontSize: '0.8rem' }}>
                              Feedback provided
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <h5>No bulk grading operations found</h5>
            <p>Bulk grading history will appear here when teachers use the bulk grading feature.</p>
          </div>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default BulkGradingHistory;