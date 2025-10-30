import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Class from '../models/Class.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

dotenv.config();

// Database initialization and seeding
async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Classroom Portal Database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out in production)
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
        name: 'Sarah Teacher',
        email: 'sarah@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'teacher'
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

    // Get user IDs for relationships
    const teacher1 = createdUsers.find(u => u.email === 'teacher@test.com');
    const teacher2 = createdUsers.find(u => u.email === 'sarah@test.com');
    const student1 = createdUsers.find(u => u.email === 'student@test.com');
    const student2 = createdUsers.find(u => u.email === 'bob@test.com');

    // Create Classes
    console.log('🏫 Creating classes...');
    
    const classes = [
      {
        title: 'Introduction to Programming',
        code: 'CS101',
        description: 'Learn the basics of programming with JavaScript and Python',
        teacherId: teacher1._id,
        members: [student1._id, student2._id],
        assignments: []
      },
      {
        title: 'Web Development',
        code: 'WEB201',
        description: 'Build modern web applications with HTML, CSS, and JavaScript',
        teacherId: teacher1._id,
        members: [student1._id],
        assignments: []
      },
      {
        title: 'Database Systems',
        code: 'DB301',
        description: 'Learn database design and SQL',
        teacherId: teacher2._id,
        members: [student2._id],
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
        description: 'Write a simple Hello World program in JavaScript. Include comments explaining your code.',
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        classId: createdClasses[0]._id,
        createdBy: teacher1._id,
        attachments: [],
        visibility: 'class'
      },
      {
        title: 'Variables and Data Types',
        description: 'Create examples of different data types in JavaScript: strings, numbers, booleans, arrays, and objects.',
        dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 14 days
        classId: createdClasses[0]._id,
        createdBy: teacher1._id,
        attachments: [],
        visibility: 'class'
      },
      {
        title: 'Build a Simple Website',
        description: 'Create a personal portfolio website using HTML and CSS. Include at least 3 pages.',
        dueAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // Due in 21 days
        classId: createdClasses[1]._id,
        createdBy: teacher1._id,
        attachments: [],
        visibility: 'class'
      },
      {
        title: 'Database Design Project',
        description: 'Design a database schema for a library management system. Include ER diagram.',
        dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
        classId: createdClasses[2]._id,
        createdBy: teacher2._id,
        attachments: [],
        visibility: 'class'
      }
    ];

    const createdAssignments = await Assignment.insertMany(assignments);
    console.log(`✅ Created ${createdAssignments.length} assignments`);

    // Update classes with assignment references
    await Class.findByIdAndUpdate(createdClasses[0]._id, {
      $push: { assignments: { $each: [createdAssignments[0]._id, createdAssignments[1]._id] } }
    });
    await Class.findByIdAndUpdate(createdClasses[1]._id, {
      $push: { assignments: createdAssignments[2]._id }
    });
    await Class.findByIdAndUpdate(createdClasses[2]._id, {
      $push: { assignments: createdAssignments[3]._id }
    });

    // Create Sample Submissions
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
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Submitted 2 days ago
        late: false,
        status: 'graded',
        grade: {
          score: 95,
          max: 100
        },
        feedback: 'Excellent work! Clean code with good comments.',
        gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        assignmentId: createdAssignments[0]._id,
        studentId: student2._id,
        linkOrFiles: [
          {
            type: 'file',
            url: '',
            meta: {
              name: 'hello-world.js',
              size: 1024,
              type: 'application/javascript'
            }
          }
        ],
        submittedAt: new Date(),
        late: false,
        status: 'submitted',
        grade: null,
        feedback: null,
        gradedAt: null
      }
    ];

    const createdSubmissions = await Submission.insertMany(submissions);
    console.log(`✅ Created ${createdSubmissions.length} submissions`);

    // Database Statistics
    console.log('\n📊 Database Statistics:');
    console.log(`👥 Users: ${await User.countDocuments()}`);
    console.log(`🏫 Classes: ${await Class.countDocuments()}`);
    console.log(`📝 Assignments: ${await Assignment.countDocuments()}`);
    console.log(`📤 Submissions: ${await Submission.countDocuments()}`);

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n🔑 Test Accounts:');
    console.log('👨‍🏫 Teachers:');
    console.log('  - teacher@test.com / password123 (John Teacher)');
    console.log('  - sarah@test.com / password123 (Sarah Teacher)');
    console.log('👨‍🎓 Students:');
    console.log('  - student@test.com / password123 (Alice Student)');
    console.log('  - bob@test.com / password123 (Bob Student)');
    console.log('👑 Admin:');
    console.log('  - admin@test.com / password123 (Admin User)');

    console.log('\n📚 Sample Classes:');
    console.log('  - CS101: Introduction to Programming');
    console.log('  - WEB201: Web Development');
    console.log('  - DB301: Database Systems');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run initialization
initializeDatabase();