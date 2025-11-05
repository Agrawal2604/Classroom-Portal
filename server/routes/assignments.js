const express = require('express');
const Assignment = require('../models/Assignment');
const { auth, teacherAuth } = require('../middleware/auth');

const router = express.Router();

// Get all assignments
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ isActive: true })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'name email');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create assignment (teachers only)
router.post('/', auth, teacherAuth, async (req, res) => {
  try {
    const { title, description, dueDate, maxPoints, subject } = req.body;
    
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      maxPoints,
      subject,
      teacher: req.user._id
    });
    
    await assignment.save();
    await assignment.populate('teacher', 'name email');
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update assignment (teachers only)
router.put('/:id', auth, teacherAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.assign(assignment, req.body);
    await assignment.save();
    await assignment.populate('teacher', 'name email');
    
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete assignment (teachers only)
router.delete('/:id', auth, teacherAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Option to soft delete (set isActive = false) or hard delete
    const { permanent } = req.query;
    
    if (permanent === 'true') {
      // Hard delete: Remove assignment and all related submissions
      const Submission = require('../models/Submission');
      await Submission.deleteMany({ assignment: assignment._id });
      await Assignment.findByIdAndDelete(req.params.id);
      
      res.json({ 
        message: 'Assignment and all related submissions permanently deleted',
        deletedAssignmentId: req.params.id
      });
    } else {
      // Soft delete: Set isActive = false
      assignment.isActive = false;
      await assignment.save();
      
      res.json({ 
        message: 'Assignment deactivated (soft deleted)',
        assignmentId: req.params.id
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;