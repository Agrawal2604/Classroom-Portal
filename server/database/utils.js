import User from '../models/User.js';
import Class from '../models/Class.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

// Database utility functions

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        students: await User.countDocuments({ role: 'student' }),
        teachers: await User.countDocuments({ role: 'teacher' }),
        admins: await User.countDocuments({ role: 'admin' })
      },
      classes: {
        total: await Class.countDocuments(),
        active: await Class.countDocuments({ 
          assignments: { $exists: true, $not: { $size: 0 } } 
        })
      },
      assignments: {
        total: await Assignment.countDocuments(),
        upcoming: await Assignment.countDocuments({ 
          dueAt: { $gt: new Date() } 
        }),
        overdue: await Assignment.countDocuments({ 
          dueAt: { $lt: new Date() } 
        })
      },
      submissions: {
        total: await Submission.countDocuments(),
        submitted: await Submission.countDocuments({ status: 'submitted' }),
        graded: await Submission.countDocuments({ status: 'graded' }),
        late: await Submission.countDocuments({ late: true })
      }
    };
    
    return stats;
  } catch (error) {
    throw new Error(`Failed to get database stats: ${error.message}`);
  }
};

// Get user dashboard data
export const getUserDashboardData = async (userId, userRole) => {
  try {
    let data = {};
    
    if (userRole === 'student') {
      // Student dashboard data
      const classes = await Class.find({ members: userId })
        .populate('teacherId', 'name email')
        .populate('assignments');
      
      const submissions = await Submission.find({ studentId: userId })
        .populate('assignmentId', 'title dueAt')
        .sort({ submittedAt: -1 });
      
      data = {
        classes,
        submissions,
        stats: {
          totalClasses: classes.length,
          totalSubmissions: submissions.length,
          gradedSubmissions: submissions.filter(s => s.status === 'graded').length,
          averageGrade: submissions
            .filter(s => s.grade && s.grade.score)
            .reduce((acc, s, _, arr) => acc + s.grade.score / arr.length, 0) || 0
        }
      };
    } 
    else if (userRole === 'teacher') {
      // Teacher dashboard data
      const classes = await Class.find({ teacherId: userId })
        .populate('members', 'name email')
        .populate('assignments');
      
      const assignments = await Assignment.find({ createdBy: userId })
        .populate('classId', 'title code')
        .sort({ createdAt: -1 });
      
      const submissions = await Submission.find({
        assignmentId: { $in: assignments.map(a => a._id) }
      })
        .populate('studentId', 'name email')
        .populate('assignmentId', 'title');
      
      data = {
        classes,
        assignments,
        submissions,
        stats: {
          totalClasses: classes.length,
          totalStudents: classes.reduce((acc, c) => acc + c.members.length, 0),
          totalAssignments: assignments.length,
          pendingGrading: submissions.filter(s => s.status === 'submitted').length
        }
      };
    }
    else if (userRole === 'admin') {
      // Admin dashboard data
      const allUsers = await User.find().select('-password').sort({ createdAt: -1 });
      const allClasses = await Class.find()
        .populate('teacherId', 'name email')
        .sort({ createdAt: -1 });
      
      data = {
        users: allUsers,
        classes: allClasses,
        stats: await getDatabaseStats()
      };
    }
    
    return data;
  } catch (error) {
    throw new Error(`Failed to get dashboard data: ${error.message}`);
  }
};

// Clean up old data (utility for maintenance)
export const cleanupOldData = async (daysOld = 30) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Remove old assignments that are past due and have no submissions
    const oldAssignments = await Assignment.find({
      dueAt: { $lt: cutoffDate },
      createdAt: { $lt: cutoffDate }
    });
    
    let cleanedAssignments = 0;
    for (const assignment of oldAssignments) {
      const hasSubmissions = await Submission.countDocuments({ 
        assignmentId: assignment._id 
      });
      
      if (hasSubmissions === 0) {
        await Assignment.findByIdAndDelete(assignment._id);
        cleanedAssignments++;
      }
    }
    
    return {
      cleanedAssignments,
      message: `Cleaned up ${cleanedAssignments} old assignments`
    };
  } catch (error) {
    throw new Error(`Cleanup failed: ${error.message}`);
  }
};

// Backup database collections
export const backupCollections = async () => {
  try {
    const backup = {
      timestamp: new Date(),
      users: await User.find().select('-password'),
      classes: await Class.find(),
      assignments: await Assignment.find(),
      submissions: await Submission.find()
    };
    
    return backup;
  } catch (error) {
    throw new Error(`Backup failed: ${error.message}`);
  }
};

export default {
  getDatabaseStats,
  getUserDashboardData,
  cleanupOldData,
  backupCollections
};