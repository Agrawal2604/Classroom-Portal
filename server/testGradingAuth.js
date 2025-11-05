const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
require('dotenv').config();

const testGradingAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Login as demo teacher
    const teacher = await User.findOne({ email: 'teacher@test.com' });
    console.log('\n👨‍🏫 Teacher found:', teacher.name, teacher.role);

    // Generate JWT token (simulate login)
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET);
    console.log('🔑 JWT Token generated');

    // Verify token (simulate auth middleware)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authUser = await User.findById(decoded.id).select('-password');
    console.log('✅ Token verified, user:', authUser.name, authUser.role);

    // Check teacher auth
    if (authUser.role !== 'teacher') {
      console.log('❌ Teacher auth failed');
      return;
    }
    console.log('✅ Teacher auth passed');

    // Find a submission to grade
    const submissions = await Submission.find()
      .populate('assignment')
      .populate('student', 'name email')
      .limit(5);

    console.log('\n📝 Available submissions:');
    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];
      const isAuthorized = sub.assignment.teacher.toString() === authUser._id.toString();
      console.log(`${i + 1}. ${sub.assignment.title} by ${sub.student.name}`);
      console.log(`   Assignment Teacher: ${sub.assignment.teacher}`);
      console.log(`   Current User: ${authUser._id}`);
      console.log(`   Authorized: ${isAuthorized}`);
      console.log(`   Current Grade: ${sub.grade || 'Not graded'}`);
      console.log('');
    }

    // Test grading the demo assignment
    const demoSubmission = await Submission.findOne()
      .populate('assignment')
      .populate('student', 'name email');

    if (demoSubmission) {
      console.log('🎯 Testing grading authorization:');
      console.log('Submission ID:', demoSubmission._id);
      console.log('Assignment:', demoSubmission.assignment.title);
      console.log('Student:', demoSubmission.student.name);
      console.log('Assignment Teacher ID:', demoSubmission.assignment.teacher);
      console.log('Current Teacher ID:', authUser._id);
      console.log('Teacher IDs match:', demoSubmission.assignment.teacher.toString() === authUser._id.toString());

      // Check if this teacher owns this assignment
      const ownsAssignment = demoSubmission.assignment.teacher.toString() === authUser._id.toString();
      
      if (!ownsAssignment) {
        console.log('❌ Authorization failed: Teacher does not own this assignment');
        
        // Find an assignment this teacher owns
        const teacherAssignment = await Assignment.findOne({ teacher: authUser._id });
        if (teacherAssignment) {
          console.log('\n✅ Found assignment owned by teacher:', teacherAssignment.title);
          
          // Find submission for this assignment
          const teacherSubmission = await Submission.findOne({ assignment: teacherAssignment._id })
            .populate('assignment')
            .populate('student', 'name email');
          
          if (teacherSubmission) {
            console.log('✅ Found submission for teacher\'s assignment:');
            console.log('- Student:', teacherSubmission.student.name);
            console.log('- Current Grade:', teacherSubmission.grade || 'Not graded');
            console.log('- This should be gradeable by the teacher');
          }
        }
      } else {
        console.log('✅ Authorization passed: Teacher owns this assignment');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testGradingAuth();