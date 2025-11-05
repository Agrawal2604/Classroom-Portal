const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);

    // Clear existing data
    await User.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    console.log('Cleared existing data');

    // Create demo teachers
    const teacher1 = new User({
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      password: 'password123',
      role: 'teacher'
    });

    const teacher2 = new User({
      name: 'Prof. Michael Chen',
      email: 'michael.chen@school.edu',
      password: 'password123',
      role: 'teacher'
    });

    const teacher3 = new User({
      name: 'Ms. Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      password: 'password123',
      role: 'teacher'
    });

    const teacher4 = new User({
      name: 'Dr. James Wilson',
      email: 'james.wilson@school.edu',
      password: 'password123',
      role: 'teacher'
    });

    // Create demo students
    const student1 = new User({
      name: 'Alice Thompson',
      email: 'alice.thompson@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024001'
    });

    const student2 = new User({
      name: 'Bob Martinez',
      email: 'bob.martinez@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024002'
    });

    const student3 = new User({
      name: 'Carol Davis',
      email: 'carol.davis@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024003'
    });

    const student4 = new User({
      name: 'David Kim',
      email: 'david.kim@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024004'
    });

    const student5 = new User({
      name: 'Emma Brown',
      email: 'emma.brown@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024005'
    });

    const student6 = new User({
      name: 'Frank Garcia',
      email: 'frank.garcia@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024006'
    });

    const student7 = new User({
      name: 'Grace Lee',
      email: 'grace.lee@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024007'
    });

    const student8 = new User({
      name: 'Henry Taylor',
      email: 'henry.taylor@student.edu',
      password: 'password123',
      role: 'student',
      studentId: 'CS2024008'
    });

    // Quick login demo accounts
    const demoTeacher = new User({
      name: 'Demo Teacher',
      email: 'teacher@test.com',
      password: 'password123',
      role: 'teacher'
    });

    const demoStudent = new User({
      name: 'Demo Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student',
      studentId: 'DEMO001'
    });

    // Save all users
    await teacher1.save();
    await teacher2.save();
    await teacher3.save();
    await teacher4.save();
    await student1.save();
    await student2.save();
    await student3.save();
    await student4.save();
    await student5.save();
    await student6.save();
    await student7.save();
    await student8.save();
    await demoTeacher.save();
    await demoStudent.save();
    console.log('Created demo users');

    // Create demo assignments from different teachers
    
    // Computer Science assignments by Dr. Sarah Johnson
    const assignment1 = new Assignment({
      title: 'Introduction to JavaScript',
      description: 'Write a simple JavaScript program that demonstrates variables, functions, and loops. Include comments explaining your code.\n\nRequirements:\n- Use at least 3 different variable types\n- Create 2 custom functions\n- Implement a for loop and a while loop\n- Add meaningful comments',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxPoints: 100,
      subject: 'Computer Science',
      teacher: teacher1._id
    });

    const assignment2 = new Assignment({
      title: 'Database Design Project',
      description: 'Design a relational database for a library management system. Include ER diagrams and SQL queries.\n\nDeliverables:\n- ER Diagram\n- Table schemas\n- 10 sample SQL queries\n- Normalization explanation',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      maxPoints: 150,
      subject: 'Computer Science',
      teacher: teacher1._id
    });

    // Mathematics assignments by Prof. Michael Chen
    const assignment3 = new Assignment({
      title: 'Calculus Problem Set 1',
      description: 'Solve the following calculus problems showing all work:\n\n1. Find the derivative of f(x) = 3x³ - 2x² + 5x - 1\n2. Evaluate ∫(2x + 3)dx from 0 to 4\n3. Find the critical points of g(x) = x⁴ - 4x³ + 6x²\n4. Determine the area under the curve y = x² from x = 1 to x = 3',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxPoints: 80,
      subject: 'Mathematics',
      teacher: teacher2._id
    });

    const assignment4 = new Assignment({
      title: 'Linear Algebra Applications',
      description: 'Complete the following matrix operations and applications:\n\n1. Solve the system using Gaussian elimination\n2. Find eigenvalues and eigenvectors\n3. Apply linear transformations\n4. Real-world application problem',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxPoints: 120,
      subject: 'Mathematics',
      teacher: teacher2._id
    });

    // Environmental Science assignments by Ms. Emily Rodriguez
    const assignment5 = new Assignment({
      title: 'Climate Change Research Paper',
      description: 'Write a comprehensive 1000-word research paper on climate change impacts in your region.\n\nRequirements:\n- Minimum 5 peer-reviewed sources\n- Data analysis with graphs\n- Proposed solutions\n- APA format citation',
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      maxPoints: 100,
      subject: 'Environmental Science',
      teacher: teacher3._id
    });

    const assignment6 = new Assignment({
      title: 'Ecosystem Analysis Lab Report',
      description: 'Analyze the local ecosystem data collected during our field trip. Include species diversity calculations, food web diagrams, and environmental impact assessment.',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      maxPoints: 90,
      subject: 'Environmental Science',
      teacher: teacher3._id
    });

    // Physics assignments by Dr. James Wilson
    const assignment7 = new Assignment({
      title: 'Mechanics Problem Set',
      description: 'Solve the following physics problems with detailed explanations:\n\n1. A ball is thrown vertically upward with initial velocity 20 m/s. Calculate maximum height and time of flight.\n2. Two blocks connected by a rope over a pulley. Find acceleration and tension.\n3. Circular motion: Calculate centripetal force for a car on a curved road.',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      maxPoints: 85,
      subject: 'Physics',
      teacher: teacher4._id
    });

    const assignment8 = new Assignment({
      title: 'Wave Optics Experiment',
      description: 'Design and conduct an experiment to demonstrate wave interference patterns. Submit a lab report with hypothesis, methodology, results, and analysis.',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      maxPoints: 110,
      subject: 'Physics',
      teacher: teacher4._id
    });

    // Additional assignments for variety
    const assignment9 = new Assignment({
      title: 'Algorithm Analysis',
      description: 'Implement and analyze the time complexity of sorting algorithms: Bubble Sort, Quick Sort, and Merge Sort. Provide Big O analysis and performance comparisons.',
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      maxPoints: 130,
      subject: 'Computer Science',
      teacher: teacher1._id
    });

    const assignment10 = new Assignment({
      title: 'Statistics Project',
      description: 'Collect and analyze real-world data using statistical methods. Include hypothesis testing, confidence intervals, and data visualization.',
      dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      maxPoints: 95,
      subject: 'Mathematics',
      teacher: teacher2._id
    });

    // Demo assignment for quick testing
    const demoAssignment = new Assignment({
      title: 'Demo Assignment - Getting Started',
      description: 'This is a demo assignment for testing the system. Write a brief introduction about yourself and your academic goals.',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxPoints: 50,
      subject: 'General',
      teacher: demoTeacher._id
    });

    // Save all assignments
    await assignment1.save();
    await assignment2.save();
    await assignment3.save();
    await assignment4.save();
    await assignment5.save();
    await assignment6.save();
    await assignment7.save();
    await assignment8.save();
    await assignment9.save();
    await assignment10.save();
    await demoAssignment.save();
    console.log('Created demo assignments');

    // Create diverse demo submissions
    
    // JavaScript assignment submissions
    const submission1 = new Submission({
      assignment: assignment1._id,
      student: student1._id,
      content: `// JavaScript Demo Program by Alice Thompson
// This program demonstrates variables, functions, and loops

// Different variable types
let studentName = "Alice";           // string
let studentAge = 20;                 // number
let isEnrolled = true;               // boolean
let courses = ["CS101", "MATH201"];  // array

// Custom function 1: Calculate GPA
function calculateGPA(grades) {
    let sum = grades.reduce((total, grade) => total + grade, 0);
    return sum / grades.length;
}

// Custom function 2: Generate student info
function generateStudentInfo(name, age, gpa) {
    return \`Student: \${name}, Age: \${age}, GPA: \${gpa.toFixed(2)}\`;
}

// For loop demonstration
console.log("Course enrollment:");
for (let i = 0; i < courses.length; i++) {
    console.log(\`Course \${i + 1}: \${courses[i]}\`);
}

// While loop demonstration
let semester = 1;
while (semester <= 4) {
    console.log(\`Semester \${semester} completed\`);
    semester++;
}

// Using the functions
let grades = [85, 92, 78, 96];
let gpa = calculateGPA(grades);
console.log(generateStudentInfo(studentName, studentAge, gpa));`,
      grade: 95,
      feedback: 'Excellent work! Great use of different variable types, well-structured functions, and clear comments. The code is clean and demonstrates all required concepts effectively.',
      status: 'graded'
    });

    const submission2 = new Submission({
      assignment: assignment1._id,
      student: student2._id,
      content: `// JavaScript Assignment - Bob Martinez
// Variables, Functions, and Loops Demo

// Variable declarations
var userName = "Bob";
let userScore = 0;
const MAX_ATTEMPTS = 3;

// Function to check password strength
function checkPassword(password) {
    if (password.length >= 8) {
        return "Strong password";
    } else {
        return "Weak password";
    }
}

// Function to increment score
function addPoints(points) {
    userScore += points;
    return userScore;
}

// For loop example
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log("Login attempt: " + attempt);
}

// While loop example
let count = 0;
while (count < 5) {
    addPoints(10);
    count++;
}

console.log("Final score: " + userScore);
console.log(checkPassword("mypassword123"));`,
      grade: 88,
      feedback: 'Good work! You demonstrated all required concepts. Consider using more descriptive variable names and add more detailed comments to explain your logic.',
      status: 'graded'
    });

    // Calculus assignment submissions
    const submission3 = new Submission({
      assignment: assignment3._id,
      student: student3._id,
      content: `Calculus Problem Set 1 - Carol Davis

Problem 1: Find the derivative of f(x) = 3x³ - 2x² + 5x - 1

Solution:
f'(x) = d/dx(3x³ - 2x² + 5x - 1)
f'(x) = 3(3x²) - 2(2x) + 5(1) - 0
f'(x) = 9x² - 4x + 5

Problem 2: Evaluate ∫(2x + 3)dx from 0 to 4

Solution:
∫(2x + 3)dx = x² + 3x + C
Evaluating from 0 to 4:
[x² + 3x]₀⁴ = (16 + 12) - (0 + 0) = 28

Problem 3: Find critical points of g(x) = x⁴ - 4x³ + 6x²

Solution:
g'(x) = 4x³ - 12x² + 12x
Setting g'(x) = 0:
4x(x² - 3x + 3) = 0
x = 0 or x² - 3x + 3 = 0
Using quadratic formula: x = (3 ± √(9-12))/2 = (3 ± √(-3))/2
Critical points: x = 0 (real), x = (3 ± i√3)/2 (complex)

Problem 4: Area under y = x² from x = 1 to x = 3

Solution:
Area = ∫₁³ x² dx = [x³/3]₁³ = 27/3 - 1/3 = 26/3 ≈ 8.67 square units`,
      grade: 92,
      feedback: 'Excellent mathematical work! All solutions are correct with clear step-by-step explanations. Great attention to detail.',
      status: 'graded'
    });

    // Climate Change research paper
    const submission4 = new Submission({
      assignment: assignment5._id,
      student: student4._id,
      content: `Climate Change Impacts in the Pacific Northwest Region
By David Kim

Abstract:
This paper examines the specific impacts of climate change on the Pacific Northwest region, analyzing temperature trends, precipitation patterns, and ecosystem changes over the past 50 years.

Introduction:
The Pacific Northwest has experienced significant climate changes, with average temperatures rising 2°F since 1970 and altered precipitation patterns affecting both urban and rural communities.

Regional Temperature Trends:
Data from NOAA weather stations show consistent warming trends:
- Winter temperatures increased by 3.1°F
- Summer temperatures increased by 1.8°F
- Growing season extended by 2-3 weeks

Precipitation Changes:
- 15% decrease in summer precipitation
- 8% increase in winter precipitation
- Earlier snowmelt affecting water resources

Ecosystem Impacts:
Forest ecosystems face multiple stressors including increased wildfire risk, pest outbreaks, and species migration. Coastal areas experience sea level rise and ocean acidification.

Economic Consequences:
Agriculture, forestry, and tourism sectors face significant challenges. Estimated annual costs exceed $2.3 billion regionally.

Proposed Solutions:
1. Renewable energy transition
2. Forest management adaptation
3. Water conservation programs
4. Coastal protection measures

Conclusion:
Immediate action is required to mitigate further impacts and adapt to ongoing changes in the Pacific Northwest region.

References:
1. NOAA Climate Data (2023)
2. EPA Regional Climate Assessment (2022)
3. University of Washington Climate Impacts Group (2023)
4. Pacific Northwest Climate Science Center (2022)
5. Regional Economic Impact Study (2023)`,
      grade: 87,
      feedback: 'Well-researched paper with good use of data and credible sources. Consider adding more specific case studies and expanding on adaptation strategies.',
      status: 'graded'
    });

    // Physics mechanics problems
    const submission5 = new Submission({
      assignment: assignment7._id,
      student: student5._id,
      content: `Physics Mechanics Problem Set - Emma Brown

Problem 1: Vertical Motion
Given: Initial velocity v₀ = 20 m/s (upward), g = 9.8 m/s²

Maximum height: h = v₀²/(2g) = (20)²/(2×9.8) = 400/19.6 = 20.4 m

Time of flight: t = 2v₀/g = 2×20/9.8 = 4.08 seconds

Problem 2: Pulley System
Let m₁ and m₂ be the masses, with m₂ > m₁
Acceleration: a = (m₂ - m₁)g/(m₁ + m₂)
Tension: T = 2m₁m₂g/(m₁ + m₂)

Problem 3: Circular Motion
For a car on a curved road:
Centripetal force: Fc = mv²/r
This force is provided by friction: Fc = μmg
Therefore: v = √(μgr)

The maximum safe speed depends on the coefficient of friction and radius of curvature.`,
      grade: 85,
      feedback: 'Good problem-solving approach. Make sure to include numerical values where possible and show more detailed derivations.',
      status: 'graded'
    });

    // More submissions for variety
    const submission6 = new Submission({
      assignment: assignment2._id,
      student: student6._id,
      content: `Database Design Project - Library Management System
By Frank Garcia

ER Diagram Components:
- Entities: Book, Author, Member, Loan, Staff
- Relationships: Writes, Borrows, Issues, Returns

Table Schemas:

Books Table:
- BookID (Primary Key)
- Title, ISBN, PublicationYear
- AuthorID (Foreign Key)
- CategoryID (Foreign Key)

Members Table:
- MemberID (Primary Key)
- Name, Email, Phone, Address
- MembershipDate, Status

Loans Table:
- LoanID (Primary Key)
- BookID, MemberID (Foreign Keys)
- LoanDate, DueDate, ReturnDate

Sample SQL Queries:
1. SELECT * FROM Books WHERE PublicationYear > 2020;
2. SELECT COUNT(*) FROM Loans WHERE ReturnDate IS NULL;
3. SELECT m.Name, COUNT(l.LoanID) FROM Members m JOIN Loans l ON m.MemberID = l.MemberID GROUP BY m.MemberID;

Normalization:
The design follows 3NF principles, eliminating redundancy and ensuring data integrity.`,
      status: 'submitted'
    });

    const submission7 = new Submission({
      assignment: assignment9._id,
      student: student7._id,
      content: `Algorithm Analysis Report - Grace Lee

Bubble Sort Implementation:
Time Complexity: O(n²) worst case, O(n) best case
Space Complexity: O(1)

Quick Sort Implementation:
Time Complexity: O(n log n) average, O(n²) worst case
Space Complexity: O(log n)

Merge Sort Implementation:
Time Complexity: O(n log n) all cases
Space Complexity: O(n)

Performance Comparison:
Tested with arrays of sizes 1000, 5000, 10000
- Merge Sort: Most consistent performance
- Quick Sort: Fastest on average
- Bubble Sort: Slowest, not recommended for large datasets

Conclusion:
For general use, Merge Sort provides reliable O(n log n) performance.
Quick Sort is preferred when average-case performance matters most.`,
      grade: 94,
      feedback: 'Excellent analysis! Great implementation and thorough performance testing. Well-structured report with clear conclusions.',
      status: 'graded'
    });

    // Demo submission
    const demoSubmission = new Submission({
      assignment: demoAssignment._id,
      student: demoStudent._id,
      content: `Introduction - Demo Student

Hello! My name is Demo Student and I'm excited to be part of this classroom portal system.

Academic Goals:
- Master computer science fundamentals
- Develop strong problem-solving skills
- Contribute to open-source projects
- Maintain a high GPA

I'm particularly interested in web development, artificial intelligence, and software engineering. This platform will help me stay organized and track my academic progress effectively.

Looking forward to a great semester!`,
      grade: 48,
      feedback: 'Nice introduction! Good to see your enthusiasm. Consider expanding on specific technical interests and career aspirations.',
      status: 'graded'
    });

    // Save all submissions
    await submission1.save();
    await submission2.save();
    await submission3.save();
    await submission4.save();
    await submission5.save();
    await submission6.save();
    await submission7.save();
    await demoSubmission.save();
    console.log('Created demo submissions');

    console.log('\n=== DEMO ACCOUNTS CREATED ===');
    console.log('\n🎓 TEACHERS:');
    console.log('1. Dr. Sarah Johnson (Computer Science)');
    console.log('   Email: sarah.johnson@school.edu');
    console.log('   Password: password123');
    console.log('\n2. Prof. Michael Chen (Mathematics)');
    console.log('   Email: michael.chen@school.edu');
    console.log('   Password: password123');
    console.log('\n3. Ms. Emily Rodriguez (Environmental Science)');
    console.log('   Email: emily.rodriguez@school.edu');
    console.log('   Password: password123');
    console.log('\n4. Dr. James Wilson (Physics)');
    console.log('   Email: james.wilson@school.edu');
    console.log('   Password: password123');
    
    console.log('\n👨‍🎓 STUDENTS:');
    console.log('1. Alice Thompson - ID: CS2024001');
    console.log('   Email: alice.thompson@student.edu');
    console.log('2. Bob Martinez - ID: CS2024002');
    console.log('   Email: bob.martinez@student.edu');
    console.log('3. Carol Davis - ID: CS2024003');
    console.log('   Email: carol.davis@student.edu');
    console.log('4. David Kim - ID: CS2024004');
    console.log('   Email: david.kim@student.edu');
    console.log('5. Emma Brown - ID: CS2024005');
    console.log('   Email: emma.brown@student.edu');
    console.log('6. Frank Garcia - ID: CS2024006');
    console.log('   Email: frank.garcia@student.edu');
    console.log('7. Grace Lee - ID: CS2024007');
    console.log('   Email: grace.lee@student.edu');
    console.log('8. Henry Taylor - ID: CS2024008');
    console.log('   Email: henry.taylor@student.edu');
    
    console.log('\n🚀 QUICK LOGIN (Demo):');
    console.log('Teacher: teacher@test.com / password123');
    console.log('Student: student@test.com / password123 (ID: DEMO001)');
    
    console.log('\n📊 DATABASE SUMMARY:');
    console.log('- 10 Teachers (including demo)');
    console.log('- 10 Students (including demo)');
    console.log('- 11 Assignments across multiple subjects');
    console.log('- 8 Sample submissions with grades and feedback');
    console.log('\nDatabase seeded successfully! 🎉');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();