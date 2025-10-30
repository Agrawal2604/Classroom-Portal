import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Class from '../models/Class.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

dotenv.config();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Classroom Portal Database...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Class.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});

    // Create Users
    console.log('👥 Creating users...');
    const users = [
      {
        name: 'John Teacher',
        email: 'teacher@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'teacher'
      },
      {
        name: 'Alice Student',
        email: 'student@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      },
      {
        name: 'Bob Student',
        email: 'bob@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'admin'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get user references
    const teacher = createdUsers.find(u => u.email === 'teacher@test.com');
    const student1 = createdUsers.find(u => u.email === 'student@test.com');
    const student2 = createdUsers.find(u => u.email === 'bob@test.com');

    // Create Classes
    console.log('🏫 Creating classes...');
    const classes = [
      {
        title: 'Introduction to Programming',
        code: 'CS101',
        description: 'Learn the basics of programming',
        teacherId: teacher._id,
        members: [student1._id, student2._id],
        assignments: []
      },
      {
        title: 'Web Development',
        code: 'WEB201',
        description: 'Build modern web applications',
        teacherId: teacher._id,
        members: [student1._id],
        assignments: []
      }
    ];

    const createdClasses = await Class.insertMany(classes);
    console.log(`✅ Created ${createdClasses.length} classes`);

    // Create Assignments
    console.log('📝 Creating assignments...');
    const assignments = [
      {
        title: 'Hello World Program',
        description: 'Write a simple Hello World program in JavaScript',
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        classId: createdClasses[0]._id,
        createdBy: teacher._id,
        attachments: [],
        visibility: 'class'
      },
      {
        title: 'Build a Simple Website',
        description: 'Create a personal portfolio website',
        dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        classId: createdClasses[1]._id,
        createdBy: teacher._id,
        attachments: [],
        visibility: 'class'
      }
    ];

    const createdAssignments = await Assignment.insertMany(assignments);
    console.log(`✅ Created ${createdAssignments.length} assignments`);

    // Update classes with assignments
    await Class.findByIdAndUpdate(createdClasses[0]._id, {
      $push: { assignments: createdAssignments[0]._id }
    });
    await Class.findByIdAndUpdate(createdClasses[1]._id, {
      $push: { assignments: createdAssignments[1]._id }
    });

    // Create simple submissions
    console.log('📤 Creating sample submissions...');
    const submissions = [
      {
        assignmentId: createdAssignments[0]._id,
        studentId: student1._id,
        linkOrFiles: [
          {
            type: 'link',
            url: 'https://github.com/alice/hello-world'
          }
        ],
        submittedAt: new Date(),
        late: false,
        status: 'submitted'
      }
    ];

    const createdSubmissions = await Submission.insertMany(submissions);
    console.log(`✅ Created ${createdSubmissions.length} submissions`);

    // Show statistics
    console.log('\n📊 Database Statistics:');
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`🏫 Classes: ${await Class.countDocuments()}`);
    console.log(`📝 Assignments: ${await Assignment.countDocuments()}`);
    console.log(`📤 Submissions: ${await Submission.countDocuments()}`);

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n🔑 Test Accounts:');
    console.log('👨‍🏫 Teacher: teacher@test.com / password123');
    console.log('👨‍🎓 Students: student@test.com / password123, bob@test.com / password123');
    console.log('👑 Admin: admin@test.com / password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

initializeDatabase();