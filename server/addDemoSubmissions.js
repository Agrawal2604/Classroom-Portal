const mongoose = require('mongoose');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
require('dotenv').config();

const addDemoSubmissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Find demo teacher and assignment
    const teacher = await User.findOne({ email: 'teacher@test.com' });
    const assignment = await Assignment.findOne({ teacher: teacher._id });
    
    // Find some students who haven't submitted yet
    const students = await User.find({ 
      role: 'student',
      email: { $in: ['david.kim@student.edu', 'emma.brown@student.edu', 'frank.garcia@student.edu'] }
    });

    console.log(`\n📝 Adding submissions for: ${assignment.title}`);

    for (const student of students) {
      // Check if already submitted
      const existing = await Submission.findOne({
        assignment: assignment._id,
        student: student._id
      });

      if (!existing) {
        const submission = new Submission({
          assignment: assignment._id,
          student: student._id,
          content: `Assignment Submission - ${student.name}

Demo Assignment - Getting Started

This submission demonstrates my understanding of the assignment requirements.

About Me:
I am ${student.name}, a dedicated student pursuing computer science. My academic goals include mastering programming fundamentals, developing problem-solving skills, and contributing to innovative technology solutions.

Academic Interests:
- Software Development
- Data Analysis  
- Web Technologies
- Artificial Intelligence

I am excited to learn and grow throughout this course and look forward to applying these concepts in real-world scenarios.

Thank you for this opportunity to introduce myself and share my academic aspirations.

Best regards,
${student.name}
Student ID: ${student.studentId}`,
          status: 'submitted'
        });

        await submission.save();
        console.log(`✅ Added submission for ${student.name}`);
      } else {
        console.log(`⚠️ ${student.name} already submitted`);
      }
    }

    console.log('\n🎯 Now you can test grading with teacher@test.com!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

addDemoSubmissions();