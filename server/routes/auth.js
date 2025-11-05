const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      studentId: role === 'student' ? studentId : undefined
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      studentId: req.user.studentId
    }
  });
});

// Get all users (for admin/data management)
router.get('/users', auth, async (req, res) => {
  try {
    // Only teachers can view all users for now
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user account
router.delete('/user/:id', auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUser = req.user;
    
    // Users can only delete their own account, or teachers can delete students
    const canDelete = 
      targetUserId === currentUser._id.toString() || 
      (currentUser.role === 'teacher');
    
    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }
    
    const userToDelete = await User.findById(targetUserId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow teachers to delete other teachers
    if (currentUser.role === 'teacher' && userToDelete.role === 'teacher' && 
        targetUserId !== currentUser._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete other teachers' });
    }
    
    // Delete user and related data
    const Assignment = require('../models/Assignment');
    const Submission = require('../models/Submission');
    
    if (userToDelete.role === 'teacher') {
      // Delete all assignments created by this teacher and their submissions
      const teacherAssignments = await Assignment.find({ teacher: targetUserId });
      for (const assignment of teacherAssignments) {
        await Submission.deleteMany({ assignment: assignment._id });
      }
      await Assignment.deleteMany({ teacher: targetUserId });
    } else {
      // Delete all submissions by this student
      await Submission.deleteMany({ student: targetUserId });
    }
    
    // Delete the user
    await User.findByIdAndDelete(targetUserId);
    
    res.json({ 
      message: `User ${userToDelete.name} and all related data deleted successfully`,
      deletedUserId: targetUserId,
      userRole: userToDelete.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;