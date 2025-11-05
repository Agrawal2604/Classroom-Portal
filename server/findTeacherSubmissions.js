const mongoose = require('mongoose');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
require('dotenv').config();

const findTeacherSubmissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Find demo teacher
    const teacher = await User.findOne({ email: 'teacher@test.com' });
    console.log('\n👨‍🏫 Demo Teacher:', teacher.name);

    // Find assignments by this teacher
    const assignments = await Assignment.find({ teacher: teacher._id });
    console.log('\n📚 Teacher\'s Assignments:');
    
    for (const assignment of assignments) {
      console.log(`\n📋 Assignment: ${assignment.title}`);
      console.log(`   ID: ${assignment._id}`);
      console.log(`   Max Points: ${assignment.maxPoints}`);
      
      // Find submissions for this assignment
      const submissions = await Submission.find({ assignment: assignment._id })
        .populate('student', 'name email studentId');
      
      console.log(`   📝 Submissions (${submissions.length}):`);
      
      for (const submission of submissions) {
        console.log(`   - ${submission.student.name} (${submission.student.studentId})`);
        console.log(`     ID: ${submission._id}`);
        console.log(`     Grade: ${submission.grade || 'Not graded'}`);
        console.log(`     Status: ${submission.status}`);
        console.log(`     Content preview: ${submission.content.substring(0, 100)}...`);
      }
    }

    // Also show what other teachers have
    console.log('\n\n👥 Other Teachers and Their Assignments:');
    const otherTeachers = await User.find({ 
      role: 'teacher', 
      email: { $ne: 'teacher@test.com' } 
    });

    for (const otherTeacher of otherTeachers) {
      const teacherAssignments = await Assignment.find({ teacher: otherTeacher._id });
      console.log(`\n${otherTeacher.name} (${otherTeacher.email}):`);
      for (const assignment of teacherAssignments) {
        const submissionCount = await Submission.countDocuments({ assignment: assignment._id });
        console.log(`  - ${assignment.title} (${submissionCount} submissions)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

findTeacherSubmissions();