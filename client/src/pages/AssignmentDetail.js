import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AssignmentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAssignmentDetails = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        api.get(`/api/assignments/${id}`),
        api.get(`/api/submissions?assignmentId=${id}`)
      ]);
      
      setAssignment(assignmentRes.data);
      
      // Find user's submission if student
      if (user.role === 'student') {
        const userSubmission = submissionsRes.data.find(
          sub => sub.student._id === user.id
        );
        setSubmission(userSubmission);
      }
    } catch (error) {
      setError('Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/submissions', {
        assignmentId: id,
        content: submissionContent
      });
      
      setSuccess('Assignment submitted successfully!');
      fetchAssignmentDetails(); // Refresh to show submission
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!assignment) {
    return <div className="container">Assignment not found.</div>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/assignments')} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
        ← Back to Assignments
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1>{assignment.title}</h1>
            <p><strong>Subject:</strong> {assignment.subject}</p>
            <p><strong>Teacher:</strong> {assignment.teacher.name}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Due Date:</strong></p>
            <p style={{ color: isOverdue(assignment.dueDate) ? '#dc3545' : '#666' }}>
              {formatDate(assignment.dueDate)}
            </p>
            <p><strong>Max Points:</strong> {assignment.maxPoints}</p>
            {isOverdue(assignment.dueDate) && (
              <span className="status-badge status-late">Overdue</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{assignment.description}</p>
        </div>

        {user.role === 'student' && (
          <div>
            <h3>Your Submission</h3>
            {submission ? (
              <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`status-badge status-${submission.status}`}>
                    {submission.status}
                  </span>
                  <span>Submitted: {formatDate(submission.submittedAt)}</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong>Your Answer:</strong>
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{submission.content}</p>
                </div>

                {submission.grade !== undefined && (
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Grade:</strong> {submission.grade}/{assignment.maxPoints}
                  </div>
                )}

                {submission.feedback && (
                  <div>
                    <strong>Teacher Feedback:</strong>
                    <p style={{ whiteSpace: 'pre-wrap', marginTop: '5px' }}>{submission.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {error && (
                  <div className="alert alert-error">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Your Answer</label>
                    <textarea
                      className="form-control"
                      rows="8"
                      value={submissionContent}
                      onChange={(e) => setSubmissionContent(e.target.value)}
                      placeholder="Enter your assignment submission here..."
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting || isOverdue(assignment.dueDate)}
                  >
                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                  
                  {isOverdue(assignment.dueDate) && (
                    <p style={{ color: '#dc3545', marginTop: '10px' }}>
                      This assignment is overdue. Submissions are no longer accepted.
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;