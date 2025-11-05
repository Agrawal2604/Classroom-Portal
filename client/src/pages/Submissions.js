import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import GradeHistory from '../components/GradeHistory';
import BulkGrading from '../components/BulkGrading';
import BulkGradingHistory from '../components/BulkGradingHistory';
import GradingAnalytics from '../components/GradingAnalytics';

const Submissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [showHistory, setShowHistory] = useState(null);
  const [showBulkGrading, setShowBulkGrading] = useState(false);
  const [showBulkHistory, setShowBulkHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching submissions...');
      const response = await api.get('/api/submissions');
      // Handle new API response format
      const submissionsData = response.data.success ? response.data.submissions : response.data;
      setSubmissions(submissionsData || []);
      console.log('Fetched submissions:', submissionsData?.length || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      
      if (error.response?.status === 401) {
        console.log('Authentication error - redirecting to login');
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to fetch submissions: ${errorMessage}`);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, grade, feedback) => {
    setGrading({ ...grading, [submissionId]: true });
    
    try {
      console.log('Grading submission:', { submissionId, grade, feedback });
      
      const response = await api.put(`/api/submissions/${submissionId}/grade`, {
        grade: parseFloat(grade),
        feedback
      });
      
      console.log('Grading response:', response.data);
      
      // Show success message
      const message = response.data.success ? response.data.message : 'Grade saved successfully!';
      alert(message);
      
      fetchSubmissions(); // Refresh submissions
    } catch (error) {
      console.error('Error grading submission:', error);
      
      // Show specific error message with more details
      let errorMessage = 'Failed to save grade. Please try again.';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
        
        // Add specific error details
        if (error.response.data.error) {
          errorMessage += `\n\nError Code: ${error.response.data.error}`;
        }
        
        if (error.response.data.assignmentOwner && error.response.data.currentTeacher) {
          errorMessage += `\n\nThis assignment belongs to ${error.response.data.assignmentOwner}, but you are logged in as ${error.response.data.currentTeacher}.`;
        }
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setGrading({ ...grading, [submissionId]: false });
    }
  };

  const handleDeleteSubmission = async (submissionId, assignmentTitle, studentName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the submission by ${studentName} for "${assignmentTitle}"?\n\nThis action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        await api.delete(`/api/submissions/${submissionId}`);
        
        // Remove from local state
        setSubmissions(submissions.filter(submission => submission._id !== submissionId));
        
        alert('Submission deleted successfully!');
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{user.role === 'teacher' ? 'All Submissions' : 'My Submissions'}</h1>
        {user.role === 'teacher' && submissions.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setShowBulkGrading(true)}
              className="btn btn-primary"
            >
              📊 Bulk Grading
            </button>
            <button 
              onClick={() => setShowBulkHistory(true)}
              className="btn btn-secondary"
            >
              📋 Bulk History
            </button>
            <button 
              onClick={() => setShowAnalytics(true)}
              className="btn btn-secondary"
            >
              📈 Analytics
            </button>
          </div>
        )}
      </div>
      
      {submissions.length > 0 ? (
        <div className="grid">
          {submissions.map(submission => (
            <SubmissionCard 
              key={submission._id}
              submission={submission}
              user={user}
              onGrade={handleGrade}
              onDelete={handleDeleteSubmission}
              onShowHistory={setShowHistory}
              grading={grading[submission._id]}
            />
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No submissions found.</p>
        </div>
      )}
      
      {/* Grade History Modal */}
      {showHistory && (
        <GradeHistory 
          submissionId={showHistory}
          onClose={() => setShowHistory(null)}
        />
      )}
      
      {/* Bulk Grading Modal */}
      {showBulkGrading && (
        <BulkGrading 
          submissions={submissions}
          onUpdate={fetchSubmissions}
          onClose={() => setShowBulkGrading(false)}
        />
      )}
      
      {/* Bulk Grading History Modal */}
      {showBulkHistory && (
        <BulkGradingHistory 
          onClose={() => setShowBulkHistory(false)}
        />
      )}
      
      {/* Grading Analytics Modal */}
      {showAnalytics && (
        <GradingAnalytics 
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
};

const SubmissionCard = ({ submission, user, onGrade, onDelete, onShowHistory, grading }) => {
  const [grade, setGrade] = useState(submission.grade || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [showGrading, setShowGrading] = useState(false); 
 const handleSubmitGrade = (e) => {
    e.preventDefault();
    onGrade(submission._id, grade, feedback);
    setShowGrading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div>
          <h3>{submission.assignment.title}</h3>
          {user.role === 'teacher' && (
            <p><strong>Student:</strong> {submission.student.name} ({submission.student.studentId})</p>
          )}
          <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className={`status-badge status-${submission.status}`}>
            {submission.status}
          </span>
          {submission.grade !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 0 0' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                Grade: {submission.grade}/{submission.assignment.maxPoints}
                <span style={{ 
                  marginLeft: '10px',
                  color: submission.grade >= submission.assignment.maxPoints * 0.9 ? '#28a745' : 
                        submission.grade >= submission.assignment.maxPoints * 0.7 ? '#ffc107' : '#dc3545',
                  fontSize: '0.9rem'
                }}>
                  ({((submission.grade / submission.assignment.maxPoints) * 100).toFixed(1)}%)
                </span>
              </p>
              <button 
                onClick={() => onShowHistory(submission._id)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
              >
                📊 History
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Submission Content:</strong>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          {submission.content}
        </p>
      </div>

      {submission.feedback && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Teacher Feedback:</strong>
          <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{submission.feedback}</p>
        </div>
      )}

      {user.role === 'teacher' && (
        <div>
          {!showGrading ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowGrading(true)}
                className="btn btn-primary"
              >
                {submission.grade !== undefined ? 'Update Grade' : 'Grade Submission'}
              </button>
              <button 
                onClick={() => onDelete(submission._id, submission.assignment.title, submission.student.name)}
                className="btn btn-danger"
              >
                Delete Submission
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h5 style={{ marginBottom: '15px', color: '#495057' }}>
                {submission.grade !== undefined ? 'Update Grade' : 'Grade Submission'}
              </h5>
              
              {submission.grade !== undefined && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                  <small style={{ color: '#6c757d' }}>
                    <strong>Current Grade:</strong> {submission.grade}/{submission.assignment.maxPoints} 
                    {submission.gradedAt && (
                      <span> • Graded on {new Date(submission.gradedAt).toLocaleDateString()}</span>
                    )}
                  </small>
                </div>
              )}
              
              <form onSubmit={handleSubmitGrade}>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>
                    Grade (out of {submission.assignment.maxPoints})
                    <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="number"
                      className="form-control"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      min="0"
                      max={submission.assignment.maxPoints}
                      step="0.1"
                      required
                      style={{ maxWidth: '120px' }}
                    />
                    <span style={{ color: '#6c757d' }}>/ {submission.assignment.maxPoints}</span>
                    {grade && (
                      <span style={{ 
                        color: grade >= submission.assignment.maxPoints * 0.9 ? '#28a745' : 
                              grade >= submission.assignment.maxPoints * 0.7 ? '#ffc107' : '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        ({((grade / submission.assignment.maxPoints) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                  {grade > submission.assignment.maxPoints && (
                    <small style={{ color: '#dc3545' }}>
                      Grade cannot exceed maximum points ({submission.assignment.maxPoints})
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>Feedback</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback to help the student improve..."
                    style={{ resize: 'vertical' }}
                  />
                  <small style={{ color: '#6c757d' }}>
                    {feedback.length}/500 characters
                  </small>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    disabled={grading || !grade || grade > submission.assignment.maxPoints}
                    style={{ minWidth: '120px' }}
                  >
                    {grading ? (
                      <>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        💾 {submission.grade !== undefined ? 'Update Grade' : 'Save Grade'}
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowGrading(false);
                      setGrade(submission.grade || '');
                      setFeedback(submission.feedback || '');
                    }}
                    disabled={grading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Submissions;