const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

const addMoreSubmissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
    console.log('Connected to MongoDB');

    // Get all students and assignments
    const students = await User.find({ role: 'student' });
    const assignments = await Assignment.find({});

    console.log(`Found ${students.length} students and ${assignments.length} assignments`);

    // Create additional submissions
    const newSubmissions = [];

    // Add more submissions for existing assignments
    for (let i = 0; i < assignments.length; i++) {
      const assignment = assignments[i];
      
      // Get students who haven't submitted yet
      const existingSubmissions = await Submission.find({ assignment: assignment._id });
      const submittedStudentIds = existingSubmissions.map(sub => sub.student.toString());
      const availableStudents = students.filter(student => 
        !submittedStudentIds.includes(student._id.toString())
      );

      // Add 2-3 more submissions per assignment
      const numNewSubmissions = Math.min(3, availableStudents.length);
      
      for (let j = 0; j < numNewSubmissions; j++) {
        const student = availableStudents[j];
        let content = '';
        let grade = null;
        let feedback = '';
        let status = Math.random() > 0.3 ? 'graded' : 'submitted';

        // Generate content based on subject
        if (assignment.subject === 'Computer Science') {
          content = generateCSContent(assignment.title, student.name);
        } else if (assignment.subject === 'Mathematics') {
          content = generateMathContent(assignment.title, student.name);
        } else if (assignment.subject === 'Environmental Science') {
          content = generateEnvSciContent(assignment.title, student.name);
        } else if (assignment.subject === 'Physics') {
          content = generatePhysicsContent(assignment.title, student.name);
        } else {
          content = generateGeneralContent(assignment.title, student.name);
        }

        if (status === 'graded') {
          grade = Math.floor(Math.random() * 30) + 70; // Grades between 70-100
          feedback = generateFeedback(grade);
        }

        const submission = new Submission({
          assignment: assignment._id,
          student: student._id,
          content,
          grade,
          feedback,
          status
        });

        newSubmissions.push(submission);
      }
    }

    // Save all new submissions
    await Submission.insertMany(newSubmissions);
    console.log(`Added ${newSubmissions.length} new submissions`);

  } catch (error) {
    console.error('Error adding submissions:', error);
  } finally {
    mongoose.connection.close();
  }
};

function generateCSContent(title, studentName) {
  const contents = {
    'Introduction to JavaScript': `// JavaScript Assignment - ${studentName}

// Variable declarations
const studentName = "${studentName}";
let currentGrade = 0;
var isCompleted = false;

// Function to calculate final grade
function calculateGrade(assignments, exams) {
    const assignmentAvg = assignments.reduce((sum, grade) => sum + grade, 0) / assignments.length;
    const examAvg = exams.reduce((sum, grade) => sum + grade, 0) / exams.length;
    return (assignmentAvg * 0.4) + (examAvg * 0.6);
}

// Function to display student info
function displayInfo(name, grade) {
    return \`Student: \${name}, Current Grade: \${grade}%\`;
}

// For loop example
console.log("Assignment scores:");
for (let i = 1; i <= 5; i++) {
    console.log(\`Assignment \${i}: \${Math.floor(Math.random() * 20) + 80}\`);
}

// While loop example
let attempts = 0;
while (attempts < 3 && !isCompleted) {
    console.log(\`Attempt \${attempts + 1}\`);
    attempts++;
    isCompleted = Math.random() > 0.5;
}

console.log(displayInfo(studentName, calculateGrade([85, 92, 78], [88, 91])));`,

    'Database Design Project': `Database Design Project - ${studentName}

Library Management System Design

Entity Relationship Diagram:
- BOOK (BookID, Title, ISBN, AuthorID, CategoryID, PublicationYear)
- AUTHOR (AuthorID, FirstName, LastName, Biography)
- MEMBER (MemberID, Name, Email, Phone, JoinDate, Status)
- LOAN (LoanID, BookID, MemberID, LoanDate, DueDate, ReturnDate, Fine)
- CATEGORY (CategoryID, CategoryName, Description)

Relationships:
- AUTHOR writes BOOK (1:M)
- MEMBER borrows BOOK through LOAN (M:N)
- BOOK belongs to CATEGORY (M:1)

Sample SQL Queries:

1. Find all overdue books:
SELECT b.Title, m.Name, l.DueDate 
FROM Books b 
JOIN Loans l ON b.BookID = l.BookID 
JOIN Members m ON l.MemberID = m.MemberID 
WHERE l.ReturnDate IS NULL AND l.DueDate < CURDATE();

2. Most popular books:
SELECT b.Title, COUNT(l.LoanID) as LoanCount 
FROM Books b 
JOIN Loans l ON b.BookID = l.BookID 
GROUP BY b.BookID 
ORDER BY LoanCount DESC 
LIMIT 10;

3. Member activity report:
SELECT m.Name, COUNT(l.LoanID) as TotalLoans, 
       AVG(DATEDIFF(l.ReturnDate, l.LoanDate)) as AvgLoanDays
FROM Members m 
LEFT JOIN Loans l ON m.MemberID = l.MemberID 
GROUP BY m.MemberID;

Normalization Analysis:
The design follows Third Normal Form (3NF) principles:
- All non-key attributes depend on the primary key
- No transitive dependencies exist
- Eliminates data redundancy while maintaining referential integrity`,

    'Algorithm Analysis': `Algorithm Analysis Report - ${studentName}

Sorting Algorithm Comparison

1. Bubble Sort Analysis:
Time Complexity: O(n²) worst and average case, O(n) best case
Space Complexity: O(1)
Stability: Stable
Implementation: Simple but inefficient for large datasets

2. Quick Sort Analysis:
Time Complexity: O(n log n) average case, O(n²) worst case
Space Complexity: O(log n) due to recursion
Stability: Not stable
Implementation: Divide and conquer approach

3. Merge Sort Analysis:
Time Complexity: O(n log n) all cases
Space Complexity: O(n)
Stability: Stable
Implementation: Consistent performance, good for large datasets

Performance Testing Results:
Dataset Size: 10,000 elements
- Bubble Sort: 2.3 seconds
- Quick Sort: 0.012 seconds
- Merge Sort: 0.015 seconds

Dataset Size: 100,000 elements
- Bubble Sort: 4.2 minutes (too slow)
- Quick Sort: 0.18 seconds
- Merge Sort: 0.22 seconds

Conclusion:
For general-purpose sorting, Merge Sort provides the most reliable performance.
Quick Sort is preferred when average-case performance is critical and stability is not required.
Bubble Sort should only be used for educational purposes or very small datasets.`
  };
  
  return contents[title] || `Assignment submission for ${title} by ${studentName}\n\nThis is a sample submission demonstrating the required concepts and analysis.`;
}

function generateMathContent(title, studentName) {
  const contents = {
    'Calculus Problem Set 1': `Calculus Problem Set 1 - ${studentName}

Problem 1: Find the derivative of f(x) = 3x³ - 2x² + 5x - 1
Solution:
f'(x) = d/dx(3x³ - 2x² + 5x - 1)
f'(x) = 9x² - 4x + 5

Problem 2: Evaluate ∫(2x + 3)dx from 0 to 4
Solution:
∫(2x + 3)dx = x² + 3x + C
[x² + 3x]₀⁴ = (16 + 12) - (0) = 28

Problem 3: Critical points of g(x) = x⁴ - 4x³ + 6x²
Solution:
g'(x) = 4x³ - 12x² + 12x = 4x(x² - 3x + 3)
Setting g'(x) = 0: x = 0 or x² - 3x + 3 = 0
Discriminant = 9 - 12 = -3 < 0
Only real critical point: x = 0

Problem 4: Area under y = x² from x = 1 to x = 3
Solution:
Area = ∫₁³ x² dx = [x³/3]₁³ = 27/3 - 1/3 = 26/3 ≈ 8.67 square units`,

    'Linear Algebra Applications': `Linear Algebra Applications - ${studentName}

Problem 1: Gaussian Elimination
System: 2x + 3y - z = 1
        x - y + 2z = 3
        3x + y + z = 2

Augmented matrix and row operations:
[2  3 -1 | 1]    →    [1 -1  2 | 3]
[1 -1  2 | 3]          [0  5 -5 |-5]
[3  1  1 | 2]          [0  4 -5 |-7]

Solution: x = 1, y = 0, z = 1

Problem 2: Eigenvalues and Eigenvectors
Matrix A = [3  1]
           [0  2]

Characteristic polynomial: det(A - λI) = (3-λ)(2-λ) = 0
Eigenvalues: λ₁ = 3, λ₂ = 2

For λ₁ = 3: eigenvector v₁ = [1, 0]ᵀ
For λ₂ = 2: eigenvector v₂ = [1, -1]ᵀ

Problem 3: Linear Transformation
T: R² → R² defined by T(x,y) = (2x + y, x - y)
Matrix representation: [2  1]
                      [1 -1]

Problem 4: Real-world Application
Population dynamics model using matrix multiplication
to track species migration between regions.`,

    'Statistics Project': `Statistics Project - ${studentName}

Data Collection and Analysis

Dataset: Student Study Hours vs. Exam Scores (n=50)
Source: Campus survey conducted over 2 weeks

Descriptive Statistics:
Study Hours: Mean = 6.2, Median = 6.0, SD = 2.1
Exam Scores: Mean = 78.4, Median = 79.0, SD = 12.3

Hypothesis Testing:
H₀: ρ = 0 (no correlation between study hours and scores)
H₁: ρ ≠ 0 (significant correlation exists)

Correlation Analysis:
Pearson correlation coefficient: r = 0.73
p-value = 0.001 < α = 0.05
Conclusion: Reject H₀, significant positive correlation exists

Confidence Interval:
95% CI for mean exam score: (75.9, 80.9)

Linear Regression:
Score = 65.2 + 2.13(Hours)
R² = 0.53 (53% of variance explained)

Data Visualization:
- Scatter plot shows positive linear relationship
- Histogram of scores shows approximately normal distribution
- Box plot reveals no significant outliers`
  };
  
  return contents[title] || `Mathematics assignment for ${title} by ${studentName}\n\nDetailed mathematical analysis and problem-solving approach.`;
}

function generateEnvSciContent(title, studentName) {
  return `Environmental Science Assignment - ${studentName}

${title}

This comprehensive analysis examines environmental factors and their impacts on local ecosystems. The research includes field observations, data collection, and scientific methodology to understand complex environmental relationships.

Key findings include significant correlations between human activities and environmental changes, with recommendations for sustainable practices and conservation efforts.

The study methodology followed established scientific protocols with proper data collection, statistical analysis, and peer-reviewed source integration.`;
}

function generatePhysicsContent(title, studentName) {
  return `Physics Assignment - ${studentName}

${title}

Detailed physics problem solutions with step-by-step mathematical derivations, proper unit analysis, and conceptual explanations.

Each problem demonstrates understanding of fundamental physics principles including Newton's laws, energy conservation, and mathematical modeling of physical systems.

Solutions include diagrams, free-body analysis, and verification of results through dimensional analysis.`;
}

function generateGeneralContent(title, studentName) {
  return `Assignment Submission - ${studentName}

${title}

This submission demonstrates understanding of the core concepts covered in class. The work includes thorough analysis, critical thinking, and application of learned principles.

Research methodology follows academic standards with proper citation and evidence-based conclusions.`;
}

function generateFeedback(grade) {
  if (grade >= 95) return 'Outstanding work! Exceptional understanding and presentation. Excellent attention to detail.';
  if (grade >= 90) return 'Excellent submission! Strong grasp of concepts with minor areas for improvement.';
  if (grade >= 85) return 'Very good work! Shows solid understanding. Consider expanding on key points.';
  if (grade >= 80) return 'Good effort! Demonstrates understanding but could benefit from more detailed analysis.';
  if (grade >= 75) return 'Satisfactory work. Shows basic understanding but needs more depth and clarity.';
  return 'Needs improvement. Please review the material and consider office hours for additional help.';
}

addMoreSubmissions();