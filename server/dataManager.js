const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

class DataManager {
  constructor() {
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
      console.log('Connected to MongoDB');
      this.connected = true;
    }
  }

  async disconnect() {
    if (this.connected) {
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB');
      this.connected = false;
    }
  }

  // Delete specific user by email or ID
  async deleteUser(identifier) {
    await this.connect();
    
    const query = identifier.includes('@') 
      ? { email: identifier } 
      : { _id: identifier };
    
    const user = await User.findOne(query);
    if (!user) {
      console.log(`User not found: ${identifier}`);
      return false;
    }

    console.log(`Deleting user: ${user.name} (${user.email})`);
    
    if (user.role === 'teacher') {
      // Delete assignments and their submissions
      const assignments = await Assignment.find({ teacher: user._id });
      for (const assignment of assignments) {
        await Submission.deleteMany({ assignment: assignment._id });
        console.log(`  - Deleted submissions for assignment: ${assignment.title}`);
      }
      await Assignment.deleteMany({ teacher: user._id });
      console.log(`  - Deleted ${assignments.length} assignments`);
    } else {
      // Delete student submissions
      const submissions = await Submission.deleteMany({ student: user._id });
      console.log(`  - Deleted ${submissions.deletedCount} submissions`);
    }
    
    await User.findByIdAndDelete(user._id);
    console.log(`✓ User ${user.name} deleted successfully`);
    return true;
  }

  // Delete specific assignment by ID or title
  async deleteAssignment(identifier) {
    await this.connect();
    
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { title: { $regex: identifier, $options: 'i' } };
    
    const assignment = await Assignment.findOne(query).populate('teacher', 'name email');
    if (!assignment) {
      console.log(`Assignment not found: ${identifier}`);
      return false;
    }

    console.log(`Deleting assignment: ${assignment.title} by ${assignment.teacher.name}`);
    
    // Delete related submissions
    const submissions = await Submission.deleteMany({ assignment: assignment._id });
    console.log(`  - Deleted ${submissions.deletedCount} submissions`);
    
    await Assignment.findByIdAndDelete(assignment._id);
    console.log(`✓ Assignment "${assignment.title}" deleted successfully`);
    return true;
  }

  // Delete specific submission by ID
  async deleteSubmission(submissionId) {
    await this.connect();
    
    const submission = await Submission.findById(submissionId)
      .populate('assignment', 'title')
      .populate('student', 'name email');
    
    if (!submission) {
      console.log(`Submission not found: ${submissionId}`);
      return false;
    }

    console.log(`Deleting submission by ${submission.student.name} for "${submission.assignment.title}"`);
    
    await Submission.findByIdAndDelete(submissionId);
    console.log(`✓ Submission deleted successfully`);
    return true;
  }

  // Delete all data for a specific subject
  async deleteBySubject(subject) {
    await this.connect();
    
    console.log(`Deleting all data for subject: ${subject}`);
    
    const assignments = await Assignment.find({ subject: { $regex: subject, $options: 'i' } });
    console.log(`Found ${assignments.length} assignments for subject: ${subject}`);
    
    for (const assignment of assignments) {
      const submissions = await Submission.deleteMany({ assignment: assignment._id });
      console.log(`  - Deleted ${submissions.deletedCount} submissions for: ${assignment.title}`);
    }
    
    const deletedAssignments = await Assignment.deleteMany({ subject: { $regex: subject, $options: 'i' } });
    console.log(`✓ Deleted ${deletedAssignments.deletedCount} assignments for subject: ${subject}`);
    
    return deletedAssignments.deletedCount;
  }

  // Delete all data by a specific teacher
  async deleteByTeacher(teacherEmail) {
    await this.connect();
    
    const teacher = await User.findOne({ email: teacherEmail, role: 'teacher' });
    if (!teacher) {
      console.log(`Teacher not found: ${teacherEmail}`);
      return false;
    }

    console.log(`Deleting all data by teacher: ${teacher.name}`);
    
    const assignments = await Assignment.find({ teacher: teacher._id });
    for (const assignment of assignments) {
      const submissions = await Submission.deleteMany({ assignment: assignment._id });
      console.log(`  - Deleted ${submissions.deletedCount} submissions for: ${assignment.title}`);
    }
    
    const deletedAssignments = await Assignment.deleteMany({ teacher: teacher._id });
    console.log(`✓ Deleted ${deletedAssignments.deletedCount} assignments by ${teacher.name}`);
    
    return true;
  }

  // List all data for review before deletion
  async listData() {
    await this.connect();
    
    const users = await User.find({}).select('name email role studentId');
    const assignments = await Assignment.find({}).populate('teacher', 'name email').select('title subject teacher maxPoints dueDate');
    const submissions = await Submission.find({}).populate('student', 'name').populate('assignment', 'title').select('student assignment status grade');
    
    console.log('\n=== DATABASE CONTENTS ===');
    
    console.log(`\n👥 USERS (${users.length}):`);
    users.forEach(user => {
      const id = user.studentId ? ` (ID: ${user.studentId})` : '';
      console.log(`  - ${user.name} (${user.email}) - ${user.role}${id}`);
    });
    
    console.log(`\n📚 ASSIGNMENTS (${assignments.length}):`);
    assignments.forEach(assignment => {
      const dueDate = assignment.dueDate.toDateString();
      console.log(`  - "${assignment.title}" (${assignment.subject}) by ${assignment.teacher.name} - Due: ${dueDate}`);
    });
    
    console.log(`\n📝 SUBMISSIONS (${submissions.length}):`);
    submissions.forEach(submission => {
      const grade = submission.grade ? ` - Grade: ${submission.grade}` : '';
      console.log(`  - ${submission.student.name} -> "${submission.assignment.title}" (${submission.status})${grade}`);
    });
    
    return { users: users.length, assignments: assignments.length, submissions: submissions.length };
  }
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0];
const identifier = args[1];

const manager = new DataManager();

const runCommand = async () => {
  try {
    switch (command) {
      case 'list':
        await manager.listData();
        break;
        
      case 'delete-user':
        if (!identifier) {
          console.log('Usage: node dataManager.js delete-user <email-or-id>');
          return;
        }
        await manager.deleteUser(identifier);
        break;
        
      case 'delete-assignment':
        if (!identifier) {
          console.log('Usage: node dataManager.js delete-assignment <id-or-title>');
          return;
        }
        await manager.deleteAssignment(identifier);
        break;
        
      case 'delete-submission':
        if (!identifier) {
          console.log('Usage: node dataManager.js delete-submission <submission-id>');
          return;
        }
        await manager.deleteSubmission(identifier);
        break;
        
      case 'delete-subject':
        if (!identifier) {
          console.log('Usage: node dataManager.js delete-subject <subject-name>');
          return;
        }
        await manager.deleteBySubject(identifier);
        break;
        
      case 'delete-teacher-data':
        if (!identifier) {
          console.log('Usage: node dataManager.js delete-teacher-data <teacher-email>');
          return;
        }
        await manager.deleteByTeacher(identifier);
        break;
        
      default:
        console.log('Available commands:');
        console.log('  list                              - List all data');
        console.log('  delete-user <email-or-id>         - Delete specific user');
        console.log('  delete-assignment <id-or-title>   - Delete specific assignment');
        console.log('  delete-submission <submission-id> - Delete specific submission');
        console.log('  delete-subject <subject-name>     - Delete all data for subject');
        console.log('  delete-teacher-data <email>       - Delete all data by teacher');
        console.log('\nExamples:');
        console.log('  node dataManager.js list');
        console.log('  node dataManager.js delete-user teacher@test.com');
        console.log('  node dataManager.js delete-assignment "JavaScript"');
        console.log('  node dataManager.js delete-subject "Computer Science"');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await manager.disconnect();
  }
};

if (require.main === module) {
  runCommand();
}

module.exports = DataManager;