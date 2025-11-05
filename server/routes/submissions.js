const express = require('express');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { auth, teacherAuth } = require('../middleware/auth');

const router = express.Router();

// Get submissions for an assignment (teachers) or user's submissions (students)
router.get('/', auth, async (req, res) => {
  try {
    console.log('📋 Fetching submissions for:', req.user.role, req.user.name);
    let query = {};

    if (req.user.role === 'student') {
      query.student = req.user._id;
      console.log('👨‍🎓 Student query - fetching own submissions');
    }

    if (req.query.assignmentId) {
      query.assignment = req.query.assignmentId;
      console.log('📚 Filtering by assignment:', req.query.assignmentId);
    }

    // For teachers, only show submissions for their assignments
    if (req.user.role === 'teacher' && !req.query.assignmentId) {
      // First find assignments by this teacher
      const Assignment = require('../models/Assignment');
      const teacherAssignments = await Assignment.find({ teacher: req.user._id }).select('_id');
      const assignmentIds = teacherAssignments.map(a => a._id);
      query.assignment = { $in: assignmentIds };
      console.log('👨‍🏫 Teacher query - fetching submissions for their assignments:', assignmentIds.length);
    }

    const submissions = await Submission.find(query)
      .populate({
        path: 'assignment',
        select: 'title dueDate maxPoints subject teacher',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .populate('student', 'name email studentId')
      .populate('gradedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log('✅ Found submissions:', submissions.length);

    // Add additional metadata
    const enrichedSubmissions = submissions.map(submission => ({
      ...submission.toObject(),
      isLate: submission.createdAt > submission.assignment.dueDate,
      daysLate: submission.createdAt > submission.assignment.dueDate 
        ? Math.ceil((submission.createdAt - submission.assignment.dueDate) / (1000 * 60 * 60 * 24))
        : 0,
      gradePercentage: submission.grade && submission.assignment.maxPoints 
        ? Math.round((submission.grade / submission.assignment.maxPoints) * 100)
        : null,
      hasGradeHistory: submission.gradeHistory && submission.gradeHistory.length > 0,
      canGrade: req.user.role === 'teacher' && 
                submission.assignment.teacher._id.toString() === req.user._id.toString()
    }));

    res.json({
      success: true,
      count: enrichedSubmissions.length,
      submissions: enrichedSubmissions,
      userRole: req.user.role,
      userId: req.user._id
    });

  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({ 
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// Submit assignment (students only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit assignments' });
    }

    const { assignmentId, content } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const isLate = new Date() > assignment.dueDate;

    const submission = new Submission({
      assignment: assignmentId,
      student: req.user._id,
      content,
      status: isLate ? 'late' : 'submitted'
    });

    await submission.save();
    await submission.populate('assignment', 'title dueDate maxPoints');
    await submission.populate('student', 'name email studentId');

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade submission (teachers only)
router.put('/:id/grade', auth, teacherAuth, async (req, res) => {
  try {
    console.log('📊 Grading attempt by teacher:', req.user.name, '(ID:', req.user._id, ')');
    const { grade, feedback } = req.body;
    console.log('📋 Grading data:', { 
      submissionId: req.params.id,
      grade, 
      feedback: feedback ? `"${feedback.substring(0, 50)}..."` : 'none' 
    });

    // Validate grade input
    if (grade === undefined || grade === null) {
      console.log('❌ Grade is required');
      return res.status(400).json({ 
        message: 'Grade is required',
        error: 'GRADE_REQUIRED'
      });
    }

    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0) {
      console.log('❌ Invalid grade value:', grade);
      return res.status(400).json({ 
        message: 'Grade must be a valid number greater than or equal to 0',
        error: 'INVALID_GRADE'
      });
    }

    // Find submission with full population
    const submission = await Submission.findById(req.params.id)
      .populate({
        path: 'assignment',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .populate('student', 'name email studentId')
      .populate('gradedBy', 'name email');

    if (!submission) {
      console.log('❌ Submission not found:', req.params.id);
      return res.status(404).json({ 
        message: 'Submission not found',
        error: 'SUBMISSION_NOT_FOUND'
      });
    }

    console.log('✅ Submission found:');
    console.log('   - Assignment:', submission.assignment.title);
    console.log('   - Student:', submission.student.name, '(' + submission.student.studentId + ')');
    console.log('   - Assignment Teacher ID:', submission.assignment.teacher._id);
    console.log('   - Current User ID:', req.user._id);
    console.log('   - Authorization Check:', submission.assignment.teacher._id.toString() === req.user._id.toString());

    // Enhanced authorization check
    const isAuthorized = submission.assignment.teacher._id.toString() === req.user._id.toString();
    if (!isAuthorized) {
      console.log('❌ Authorization failed:');
      console.log('   - Assignment belongs to:', submission.assignment.teacher.name);
      console.log('   - Current teacher:', req.user.name);
      return res.status(403).json({ 
        message: `Not authorized to grade this assignment. This assignment belongs to ${submission.assignment.teacher.name}.`,
        error: 'NOT_AUTHORIZED',
        assignmentOwner: submission.assignment.teacher.name,
        currentTeacher: req.user.name
      });
    }

    // Validate grade against max points
    if (gradeNum > submission.assignment.maxPoints) {
      console.log('❌ Grade exceeds max points:', gradeNum, '>', submission.assignment.maxPoints);
      return res.status(400).json({ 
        message: `Grade (${gradeNum}) cannot exceed maximum points (${submission.assignment.maxPoints})`,
        error: 'GRADE_EXCEEDS_MAX',
        maxPoints: submission.assignment.maxPoints,
        providedGrade: gradeNum
      });
    }

    // Store previous grade for history (if exists)
    const previousGrade = submission.grade;
    const previousFeedback = submission.feedback;
    const previousGradedAt = submission.gradedAt;
    const previousGradedBy = submission.gradedBy;
    const isUpdate = previousGrade !== undefined && previousGrade !== null;

    console.log('📝 Grade change:', {
      previous: previousGrade || 'Not graded',
      new: gradeNum,
      isUpdate: isUpdate
    });

    // Add to grade history BEFORE updating (if this is an update)
    if (isUpdate) {
      if (!submission.gradeHistory) {
        submission.gradeHistory = [];
      }
      submission.gradeHistory.push({
        grade: previousGrade,
        feedback: previousFeedback || '',
        gradedAt: previousGradedAt,
        gradedBy: previousGradedBy,
        changeType: 'individual',
        timestamp: new Date()
      });
      console.log('📚 Added previous grade to history');
    }

    // Update submission with new grade
    submission.grade = gradeNum;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    console.log('💾 Saving grade to database...');
    
    // Save with error handling
    try {
      await submission.save();
      console.log('✅ Grade saved successfully to database');
    } catch (saveError) {
      console.error('❌ Database save error:', saveError);
      return res.status(500).json({ 
        message: 'Failed to save grade to database',
        error: 'DATABASE_SAVE_ERROR',
        details: saveError.message
      });
    }

    // Re-populate for response
    await submission.populate('gradedBy', 'name email');

    // Prepare response
    const response = {
      success: true,
      message: isUpdate ? 'Grade updated successfully' : 'Grade assigned successfully',
      submission: {
        id: submission._id,
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status,
        gradedAt: submission.gradedAt,
        gradedBy: {
          id: submission.gradedBy._id,
          name: submission.gradedBy.name,
          email: submission.gradedBy.email
        },
        student: {
          id: submission.student._id,
          name: submission.student.name,
          email: submission.student.email,
          studentId: submission.student.studentId
        },
        assignment: {
          id: submission.assignment._id,
          title: submission.assignment.title,
          maxPoints: submission.assignment.maxPoints
        },
        gradeHistory: submission.gradeHistory || [],
        isUpdate: isUpdate,
        previousGrade: isUpdate ? previousGrade : null
      }
    };

    console.log('🎉 Grading completed successfully:', {
      student: submission.student.name,
      assignment: submission.assignment.title,
      grade: `${gradeNum}/${submission.assignment.maxPoints}`,
      feedback: feedback ? 'Yes' : 'No'
    });

    res.json(response);

  } catch (error) {
    console.error('❌ Error in grading process:', error);
    res.status(500).json({ 
      message: 'Internal server error during grading',
      error: 'INTERNAL_ERROR',
      details: error.message
    });
  }
});

// Get grade history for a submission
router.get('/:id/history', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignment', 'title teacher')
      .populate('student', 'name email')
      .populate('gradedBy', 'name email')
      .populate('gradeHistory.gradedBy', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check authorization
    const isStudent = submission.student._id.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' && 
                     submission.assignment.teacher.toString() === req.user._id.toString();

    if (!isStudent && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      submissionId: submission._id,
      currentGrade: submission.grade,
      currentFeedback: submission.feedback,
      gradedAt: submission.gradedAt,
      gradedBy: submission.gradedBy,
      gradeHistory: submission.gradeHistory || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk grade submissions (teachers only)
router.put('/bulk-grade', auth, teacherAuth, async (req, res) => {
  try {
    console.log('📊 Bulk grading attempt by teacher:', req.user.name);
    const { submissionIds, grade, feedback } = req.body;
    console.log('📋 Bulk grading data:', { 
      submissionCount: submissionIds?.length || 0,
      grade, 
      feedback: feedback ? 'provided' : 'none' 
    });

    // Validate input
    if (!submissionIds || !Array.isArray(submissionIds) || submissionIds.length === 0) {
      return res.status(400).json({ 
        message: 'Submission IDs array is required',
        error: 'MISSING_SUBMISSION_IDS'
      });
    }

    if (grade === undefined || grade === null) {
      return res.status(400).json({ 
        message: 'Grade is required',
        error: 'GRADE_REQUIRED'
      });
    }

    const gradeNum = parseFloat(grade);
    if (isNaN(gradeNum) || gradeNum < 0) {
      return res.status(400).json({ 
        message: 'Grade must be a valid number greater than or equal to 0',
        error: 'INVALID_GRADE'
      });
    }

    const results = {
      success: [],
      errors: [],
      totalProcessed: 0,
      startTime: new Date()
    };

    console.log(`🔄 Processing ${submissionIds.length} submissions...`);

    // Process each submission
    for (let i = 0; i < submissionIds.length; i++) {
      const submissionId = submissionIds[i];
      console.log(`📝 Processing submission ${i + 1}/${submissionIds.length}: ${submissionId}`);
      
      try {
        const submission = await Submission.findById(submissionId)
          .populate({
            path: 'assignment',
            populate: {
              path: 'teacher',
              select: 'name email'
            }
          })
          .populate('student', 'name email studentId');

        if (!submission) {
          console.log(`❌ Submission not found: ${submissionId}`);
          results.errors.push({
            submissionId,
            error: 'Submission not found',
            errorCode: 'NOT_FOUND'
          });
          continue;
        }

        // Check if teacher owns the assignment
        const isAuthorized = submission.assignment.teacher._id.toString() === req.user._id.toString();
        if (!isAuthorized) {
          console.log(`❌ Not authorized for submission: ${submissionId}`);
          results.errors.push({
            submissionId,
            studentName: submission.student.name,
            assignmentTitle: submission.assignment.title,
            error: `Not authorized to grade this assignment (belongs to ${submission.assignment.teacher.name})`,
            errorCode: 'NOT_AUTHORIZED'
          });
          continue;
        }

        // Validate grade against max points
        if (gradeNum > submission.assignment.maxPoints) {
          console.log(`❌ Grade exceeds max points for submission: ${submissionId}`);
          results.errors.push({
            submissionId,
            studentName: submission.student.name,
            assignmentTitle: submission.assignment.title,
            error: `Grade (${gradeNum}) cannot exceed maximum points (${submission.assignment.maxPoints})`,
            errorCode: 'GRADE_EXCEEDS_MAX',
            maxPoints: submission.assignment.maxPoints
          });
          continue;
        }

        // Store previous grade for history (if exists)
        const previousGrade = submission.grade;
        const previousFeedback = submission.feedback;
        const previousGradedAt = submission.gradedAt;
        const previousGradedBy = submission.gradedBy;
        const hadPreviousGrade = previousGrade !== undefined && previousGrade !== null;

        // Add to grade history BEFORE updating (if this is an update)
        if (hadPreviousGrade) {
          if (!submission.gradeHistory) {
            submission.gradeHistory = [];
          }
          submission.gradeHistory.push({
            grade: previousGrade,
            feedback: previousFeedback || '',
            gradedAt: previousGradedAt,
            gradedBy: previousGradedBy,
            changeType: 'bulk_update',
            timestamp: new Date()
          });
        }

        // Update submission
        submission.grade = gradeNum;
        submission.feedback = feedback || '';
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.gradedBy = req.user._id;

        // Save with error handling
        try {
          await submission.save();
          console.log(`✅ Saved grade for ${submission.student.name}`);
        } catch (saveError) {
          console.error(`❌ Save error for submission ${submissionId}:`, saveError);
          results.errors.push({
            submissionId,
            studentName: submission.student.name,
            error: `Database save error: ${saveError.message}`,
            errorCode: 'SAVE_ERROR'
          });
          continue;
        }

        results.success.push({
          submissionId: submission._id,
          studentName: submission.student.name,
          studentId: submission.student.studentId,
          assignmentTitle: submission.assignment.title,
          previousGrade: hadPreviousGrade ? previousGrade : null,
          newGrade: gradeNum,
          wasUpdate: hadPreviousGrade,
          gradedAt: submission.gradedAt
        });

        results.totalProcessed++;

      } catch (error) {
        console.error(`❌ Error processing submission ${submissionId}:`, error);
        results.errors.push({
          submissionId,
          error: `Processing error: ${error.message}`,
          errorCode: 'PROCESSING_ERROR'
        });
      }
    }

    const endTime = new Date();
    const processingTime = endTime - results.startTime;

    console.log('🎉 Bulk grading completed:', {
      total: submissionIds.length,
      successful: results.success.length,
      failed: results.errors.length,
      processingTime: `${processingTime}ms`
    });

    res.json({
      success: true,
      message: `Bulk grading completed. Successfully processed ${results.totalProcessed} of ${submissionIds.length} submissions.`,
      results,
      summary: {
        totalRequested: submissionIds.length,
        successful: results.success.length,
        failed: results.errors.length,
        grade: gradeNum,
        feedback: feedback || 'No feedback provided',
        processingTime: processingTime,
        completedAt: endTime
      },
      bulkGradeDetails: {
        teacherName: req.user.name,
        teacherId: req.user._id,
        gradeApplied: gradeNum,
        feedbackProvided: !!feedback
      }
    });

  } catch (error) {
    console.error('❌ Error in bulk grading:', error);
    res.status(500).json({ 
      message: 'Internal server error during bulk grading',
      error: 'BULK_GRADING_ERROR',
      details: error.message
    });
  }
});

// Delete submission (students can delete their own, teachers can delete any)
router.delete('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignment');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check authorization
    const isOwner = submission.student.toString() === req.user._id.toString();
    const isTeacher = req.user.role === 'teacher' && 
                     submission.assignment.teacher.toString() === req.user._id.toString();
    
    if (!isOwner && !isTeacher) {
      return res.status(403).json({ message: 'Not authorized to delete this submission' });
    }
    
    await Submission.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Submission deleted successfully',
      deletedSubmissionId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;