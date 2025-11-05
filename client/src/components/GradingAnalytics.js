import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const GradingAnalytics = ({ onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGradingAnalytics();
  }, []);

  const fetchGradingAnalytics = async () => {
    try {
      const [submissionsRes, assignmentsRes] = await Promise.all([
        api.get('/api/submissions'),
        api.get('/api/assignments')
      ]);
      
      const submissions = submissionsRes.data;
      const assignments = assignmentsRes.data;
      
      // Calculate analytics
      const totalSubmissions = submissions.length;
      const gradedSubmissions = submissions.filter(s => s.grade !== undefined).length;
      const ungradedSubmissions = totalSubmissions - gradedSubmissions;
      
      // Grade distribution
      const gradeRanges = {
        'A (90-100%)': 0,
        'B (80-89%)': 0,
        'C (70-79%)': 0,
        'D (60-69%)': 0,
        'F (0-59%)': 0
      };
      
      submissions.forEach(submission => {
        if (submission.grade !== undefined && submission.assignment) {
          const percentage = (submission.grade / submission.assignment.maxPoints) * 100;
          if (percentage >= 90) gradeRanges['A (90-100%)']++;
          else if (percentage >= 80) gradeRanges['B (80-89%)']++;
          else if (percentage >= 70) gradeRanges['C (70-79%)']++;
          else if (percentage >= 60) gradeRanges['D (60-69%)']++;
          else gradeRanges['F (0-59%)']++;
        }
      });
      
      // Bulk grading statistics
      let bulkGradedCount = 0;
      let individualGradedCount = 0;
      let totalGradeChanges = 0;
      
      submissions.forEach(submission => {
        if (submission.gradeHistory) {
          totalGradeChanges += submission.gradeHistory.length;
          submission.gradeHistory.forEach(history => {
            if (history.changeType === 'bulk_update') {
              bulkGradedCount++;
            } else {
              individualGradedCount++;
            }
          });
        }
      });
      
      // Assignment statistics
      const assignmentStats = assignments.map(assignment => {
        const assignmentSubmissions = submissions.filter(s => s.assignment._id === assignment._id);
        const graded = assignmentSubmissions.filter(s => s.grade !== undefined).length;
        const avgGrade = assignmentSubmissions.length > 0 
          ? assignmentSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / assignmentSubmissions.length 
          : 0;
        
        return {
          title: assignment.title,
          subject: assignment.subject,
          totalSubmissions: assignmentSubmissions.length,
          gradedSubmissions: graded,
          averageGrade: avgGrade.toFixed(1),
          maxPoints: assignment.maxPoints,
          averagePercentage: assignment.maxPoints > 0 ? ((avgGrade / assignment.maxPoints) * 100).toFixed(1) : 0
        };
      });
      
      setAnalytics({
        overview: {
          totalSubmissions,
          gradedSubmissions,
          ungradedSubmissions,
          gradingProgress: totalSubmissions > 0 ? ((gradedSubmissions / totalSubmissions) * 100).toFixed(1) : 0
        },
        gradeDistribution: gradeRanges,
        gradingMethods: {
          bulkGraded: bulkGradedCount,
          individualGraded: individualGradedCount,
          totalGradeChanges
        },
        assignmentStats: assignmentStats.sort((a, b) => b.totalSubmissions - a.totalSubmissions)
      });
      
    } catch (error) {
      setError('Failed to load grading analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, minWidth: '400px' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading grading analytics...
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
        minWidth: '700px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>📊 Grading Analytics</h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '5px 10px' }}>
            ✕
          </button>
        </div>

        {/* Overview */}
        <div style={{ marginBottom: '25px' }}>
          <h5>📈 Overview</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
                {analytics.overview.totalSubmissions}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Submissions</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#388e3c' }}>
                {analytics.overview.gradedSubmissions}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Graded</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f57c00' }}>
                {analytics.overview.ungradedSubmissions}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Ungraded</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7b1fa2' }}>
                {analytics.overview.gradingProgress}%
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Progress</div>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div style={{ marginBottom: '25px' }}>
          <h5>📊 Grade Distribution</h5>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            {Object.entries(analytics.gradeDistribution).map(([range, count]) => (
              <div key={range} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span>{range}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    backgroundColor: '#dee2e6', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${analytics.overview.gradedSubmissions > 0 ? (count / analytics.overview.gradedSubmissions) * 100 : 0}%`, 
                      height: '100%', 
                      backgroundColor: '#007bff' 
                    }} />
                  </div>
                  <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grading Methods */}
        <div style={{ marginBottom: '25px' }}>
          <h5>⚙️ Grading Methods</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', color: '#388e3c' }}>{analytics.gradingMethods.individualGraded}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Individual</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', color: '#1976d2' }}>{analytics.gradingMethods.bulkGraded}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Bulk Graded</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', color: '#f57c00' }}>{analytics.gradingMethods.totalGradeChanges}</div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Total Changes</div>
            </div>
          </div>
        </div>

        {/* Assignment Statistics */}
        <div>
          <h5>📚 Assignment Statistics</h5>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {analytics.assignmentStats.map((assignment, index) => (
              <div key={index} style={{ 
                padding: '10px', 
                marginBottom: '8px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                borderLeft: '3px solid #007bff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{assignment.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                      {assignment.gradedSubmissions}/{assignment.totalSubmissions} graded
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Avg: {assignment.averageGrade}/{assignment.maxPoints} ({assignment.averagePercentage}%)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default GradingAnalytics;