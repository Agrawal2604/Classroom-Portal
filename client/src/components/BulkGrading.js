import React, { useState } from 'react';
import api from '../utils/api';

const BulkGrading = ({ submissions, onUpdate, onClose }) => {
  const [bulkGrade, setBulkGrade] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleSelectAll = () => {
    if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(submissions.map(s => s._id));
    }
  };

  const handleSelectSubmission = (submissionId) => {
    if (selectedSubmissions.includes(submissionId)) {
      setSelectedSubmissions(selectedSubmissions.filter(id => id !== submissionId));
    } else {
      setSelectedSubmissions([...selectedSubmissions, submissionId]);
    }
  };

  const handleBulkGrade = async () => {
    if (!bulkGrade || selectedSubmissions.length === 0) {
      alert('Please enter a grade and select submissions');
      return;
    }

    setProcessing(true);

    try {
      const response = await api.put('/api/submissions/bulk-grade', {
        submissionIds: selectedSubmissions,
        grade: parseFloat(bulkGrade),
        feedback: bulkFeedback
      });

      const { results, summary } = response.data;
      
      // Show detailed results
      let message = `Bulk Grading Results:\n\n`;
      message += `✅ Successfully graded: ${summary.successful} submissions\n`;
      if (summary.failed > 0) {
        message += `❌ Failed: ${summary.failed} submissions\n`;
      }
      message += `📊 Grade applied: ${summary.grade}\n`;
      if (summary.feedback) {
        message += `💬 Feedback: "${summary.feedback}"\n`;
      }
      
      // Show details of successful grades
      if (results.success.length > 0) {
        message += `\n📝 Graded Students:\n`;
        results.success.forEach(item => {
          const updateType = item.wasUpdate ? ' (Updated)' : ' (New)';
          message += `• ${item.studentName}${updateType}\n`;
        });
      }
      
      // Show errors if any
      if (results.errors.length > 0) {
        message += `\n⚠️ Errors:\n`;
        results.errors.forEach(error => {
          message += `• ${error.studentName || 'Unknown'}: ${error.error}\n`;
        });
      }

      alert(message);
      
      if (summary.successful > 0) {
        onUpdate();
      }
      
    } catch (error) {
      console.error('Error in bulk grading:', error);
      const errorMessage = error.response?.data?.message || 'Failed to perform bulk grading';
      alert(`Error: ${errorMessage}`);
    } finally {
      setProcessing(false);
      onClose();
    }
  };

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
          <h3>Bulk Grading</h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label>Grade to assign</label>
            <input
              type="number"
              className="form-control"
              value={bulkGrade}
              onChange={(e) => setBulkGrade(e.target.value)}
              min="0"
              step="0.1"
              placeholder="Enter grade"
            />
          </div>
          
          <div className="form-group">
            <label>Feedback (optional)</label>
            <textarea
              className="form-control"
              rows="3"
              value={bulkFeedback}
              onChange={(e) => setBulkFeedback(e.target.value)}
              placeholder="Enter feedback for all selected submissions"
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h5>Select Submissions ({selectedSubmissions.length} selected)</h5>
            <button 
              onClick={handleSelectAll}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              {selectedSubmissions.length === submissions.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
            {submissions.map(submission => (
              <div 
                key={submission._id}
                style={{ 
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: selectedSubmissions.includes(submission._id) ? '#e3f2fd' : 'white'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSubmissions.includes(submission._id)}
                  onChange={() => handleSelectSubmission(submission._id)}
                  style={{ marginRight: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{submission.student?.name}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                    {submission.assignment?.title}
                    {submission.grade !== undefined && (
                      <span style={{ marginLeft: '10px', color: '#28a745' }}>
                        Current: {submission.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            disabled={processing}
          >
            Cancel
          </button>
          <button 
            onClick={handleBulkGrade}
            className="btn btn-primary"
            disabled={processing || !bulkGrade || selectedSubmissions.length === 0}
          >
            {processing ? 'Processing...' : `Grade ${selectedSubmissions.length} Submissions`}
          </button>
        </div>
      </div>
    </>
  );
};

export default BulkGrading;