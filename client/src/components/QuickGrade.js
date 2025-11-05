import React, { useState } from 'react';
import api from '../utils/api';

const QuickGrade = ({ submission, onGradeUpdate }) => {
  const [grade, setGrade] = useState(submission.grade || '');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleQuickSave = async (newGrade) => {
    if (!newGrade || newGrade === submission.grade) return;
    
    setSaving(true);
    try {
      await api.put(`/api/submissions/${submission._id}/grade`, {
        grade: parseFloat(newGrade),
        feedback: submission.feedback || ''
      });
      
      setLastSaved(new Date());
      onGradeUpdate();
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Failed to save grade');
    } finally {
      setSaving(false);
    }
  };

  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    setGrade(newGrade);
    
    // Auto-save after 2 seconds of no typing
    clearTimeout(window.gradeTimeout);
    window.gradeTimeout = setTimeout(() => {
      if (newGrade && newGrade !== submission.grade) {
        handleQuickSave(newGrade);
      }
    }, 2000);
  };

  const handleBlur = () => {
    // Save immediately when user leaves the field
    clearTimeout(window.gradeTimeout);
    if (grade && grade !== submission.grade) {
      handleQuickSave(grade);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type="number"
          value={grade}
          onChange={handleGradeChange}
          onBlur={handleBlur}
          min="0"
          max={submission.assignment.maxPoints}
          step="0.1"
          style={{
            width: '80px',
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            textAlign: 'center'
          }}
          placeholder="Grade"
        />
        <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          / {submission.assignment.maxPoints}
        </span>
      </div>
      
      {saving && (
        <span style={{ color: '#007bff', fontSize: '0.8rem' }}>
          💾 Saving...
        </span>
      )}
      
      {lastSaved && !saving && (
        <span style={{ color: '#28a745', fontSize: '0.8rem' }}>
          ✅ Saved {lastSaved.toLocaleTimeString()}
        </span>
      )}
      
      {grade && (
        <span style={{ 
          fontSize: '0.8rem',
          color: grade >= submission.assignment.maxPoints * 0.9 ? '#28a745' : 
                grade >= submission.assignment.maxPoints * 0.7 ? '#ffc107' : '#dc3545'
        }}>
          ({((grade / submission.assignment.maxPoints) * 100).toFixed(1)}%)
        </span>
      )}
    </div>
  );
};

export default QuickGrade;