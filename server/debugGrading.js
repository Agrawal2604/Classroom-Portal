const mongoose = require('mongoose');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
require('dotenv').config();

const debugGrading = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Find demo teacher
    const teacher = await User.findOne({ email: 'teacher@test.com' });
    console.log('\n👨‍🏫 Demo Teacher:', {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role
    });

    // Find assignments by this teacher
    const assignments = await Assignment.find({ teacher: teacher._id });
    console.log('\n📚 Teacher\'s Assignments:', assignments.length);
    
    if (assignments.length > 0) {
      const assignment = assignments[0];
      console.log('First Assignment:', {
        id: assignment._id,
        title: assignment.title,
        teacher: assignment.teacher,
        teacherMatch: assignment.teacher.toString() === teacher._id.toString()
      });

      // Find submissions for this assignment
      const submissions = await Submission.find({ assignment: assignment._id })
        .populate('assignment')
        .populate('student', 'name email');
      
      console.log('\n📝 Submissions for this assignment:', submissions.length);
      
      if (submissions.length > 0) {
        const submission = submissions[0];
        console.log('First Submission:', {
          id: submission._id,
          student: submission.student.name,
          assignmentTitle: submission.assignment.title,
          assignmentTeacher: submission.assignment.teacher,
          teacherMatch: submission.assignment.teacher.toString() === teacher._id.toString(),
          currentGrade: submission.grade,
          status: submission.status
        });

        // Test authorization logic
        console.log('\n🔐 Authorization Check:');
        console.log('Teacher ID:', teacher._id.toString());
        console.log('Assignment Teacher ID:', submission.assignment.teacher.toString());
        console.log('Match:', submission.assignment.teacher.toString() === teacher._id.toString());
      }
    }

    // Also check other teachers
    console.log('\n👥 All Teachers:');
    const allTeachers = await User.find({ role: 'teacher' });
    for (const t of allTeachers) {
      const assignmentCount = await Assignment.countDocuments({ teacher: t._id });
      console.log(`- ${t.name} (${t.email}): ${assignmentCount} assignments`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugGrading();