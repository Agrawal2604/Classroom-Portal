import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const GradeHistory = ({ submissionId, onClose }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGradeHistory();
  }, [submissionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGradeHistory = async () => {
    try {
      const response = await api.get(`/api/submissions/${submissionId}/history`);
      setHistory(response.data);
    } catch (error) {
      setError('Failed to load grade history');
      console.error('Error fetching grade history:', error);
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
          Loading grade history...
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
        minWidth: '500px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Grade History</h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
            ✕
          </button>
        </div>

        {/* Current Grade */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <h5 style={{ margin: '0 0 10px 0', color: '#495057' }}>Current Grade</h5>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '1.2rem', color: '#28a745' }}>
                {history.currentGrade !== undefined ? history.currentGrade : 'Not graded'}
              </strong>
              {history.currentGrade !== undefined && (
                <span style={{ color: '#6c757d', marginLeft: '5px' }}>points</span>
              )}
            </div>
            {history.gradedAt && (
              <small style={{ color: '#6c757d' }}>
                Graded on {formatDate(history.gradedAt)}
                {history.gradedBy && ` by ${history.gradedBy.name}`}
              </small>
            )}
          </div>
          {history.currentFeedback && (
            <div style={{ marginTop: '10px' }}>
              <strong>Feedback:</strong>
              <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>{history.currentFeedback}</p>
            </div>
          )}
        </div>

        {/* Grade History */}
        {history.gradeHistory && history.gradeHistory.length > 0 ? (
          <div>
            <h5 style={{ marginBottom: '15px' }}>Previous Grades</h5>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {history.gradeHistory.map((entry, index) => {
                const getChangeTypeInfo = (changeType) => {
                  switch (changeType) {
                    case 'bulk_update':
                      return { icon: '📊', label: 'Bulk Update', color: '#17a2b8' };
                    case 'correction':
                      return { icon: '🔧', label: 'Correction', color: '#ffc107' };
                    default:
                      return { icon: '✏️', label: 'Individual', color: '#28a745' };
                  }
                };
                
                const changeInfo = getChangeTypeInfo(entry.changeType);
                
                return (
                  <div 
                    key={index} 
                    style={{ 
                      marginBottom: '15px', 
                      padding: '12px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px',
                      borderLeft: `4px solid ${changeInfo.color}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ color: '#495057' }}>
                          Grade: {entry.grade} points
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            color: changeInfo.color,
                            backgroundColor: 'white',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            border: `1px solid ${changeInfo.color}`
                          }}>
                            {changeInfo.icon} {changeInfo.label}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <small style={{ color: '#6c757d' }}>
                          {formatDate(entry.gradedAt)}
                        </small>
                        {entry.gradedBy && (
                          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                            by {entry.gradedBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                    {entry.feedback && (
                      <div style={{ marginTop: '10px' }}>
                        <strong style={{ fontSize: '0.9rem' }}>Feedback:</strong>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                          {entry.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
            <p>No previous grades found.</p>
            <small>This submission has not been re-graded.</small>
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

export default GradeHistory;