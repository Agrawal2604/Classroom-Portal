const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Assignment = require('./models/Assignment');

const addMoreAssignments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
    console.log('Connected to MongoDB');

    // Get all teachers
    const teachers = await User.find({ role: 'teacher' });
    console.log(`Found ${teachers.length} teachers`);

    const newAssignments = [];

    // Find teachers by email for specific assignments
    const sarahJohnson = teachers.find(t => t.email === 'sarah.johnson@school.edu');
    const michaelChen = teachers.find(t => t.email === 'michael.chen@school.edu');
    const emilyRodriguez = teachers.find(t => t.email === 'emily.rodriguez@school.edu');
    const jamesWilson = teachers.find(t => t.email === 'james.wilson@school.edu');

    // Additional Computer Science assignments
    if (sarahJohnson) {
      newAssignments.push(
        new Assignment({
          title: 'Web Development Project',
          description: `Create a responsive web application using HTML, CSS, and JavaScript.

Requirements:
- Responsive design that works on mobile and desktop
- Interactive features using JavaScript
- Clean, semantic HTML structure
- CSS Grid or Flexbox for layout
- Form validation
- Local storage implementation

Deliverables:
- Source code (HTML, CSS, JS files)
- README with setup instructions
- Live demo link (GitHub Pages or similar)
- Brief documentation of features

Grading Criteria:
- Functionality (40%)
- Code quality (30%)
- Design and UX (20%)
- Documentation (10%)`,
          dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
          maxPoints: 120,
          subject: 'Computer Science',
          teacher: sarahJohnson._id
        }),

        new Assignment({
          title: 'Data Structures Implementation',
          description: `Implement and analyze fundamental data structures in your preferred programming language.

Required Implementations:
1. Linked List (with insert, delete, search operations)
2. Stack (with push, pop, peek operations)
3. Queue (with enqueue, dequeue operations)
4. Binary Search Tree (with insert, delete, search, traversal)

For each data structure:
- Implement all required operations
- Analyze time and space complexity
- Write unit tests
- Provide usage examples

Bonus: Implement a hash table with collision handling

Submit: Source code, test files, and analysis document`,
          dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          maxPoints: 140,
          subject: 'Computer Science',
          teacher: sarahJohnson._id
        })
      );
    }

    // Additional Mathematics assignments
    if (michaelChen) {
      newAssignments.push(
        new Assignment({
          title: 'Differential Equations Project',
          description: `Solve and analyze differential equations with real-world applications.

Problems to solve:
1. Population growth model: dP/dt = kP(1 - P/M)
2. Cooling problem: dT/dt = -k(T - T_ambient)
3. Oscillatory motion: d²x/dt² + ω²x = 0
4. RC circuit: L(di/dt) + Ri = V(t)

For each problem:
- Find the general solution
- Apply initial conditions
- Graph the solution
- Interpret results in context
- Discuss stability and behavior

Include MATLAB or Python plots where appropriate.`,
          dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
          maxPoints: 110,
          subject: 'Mathematics',
          teacher: michaelChen._id
        }),

        new Assignment({
          title: 'Probability and Statistics Analysis',
          description: `Complete statistical analysis project using real data.

Project Components:
1. Data Collection (minimum 100 data points)
2. Descriptive Statistics (mean, median, mode, variance, etc.)
3. Probability Distributions (identify and fit appropriate distribution)
4. Hypothesis Testing (choose appropriate test)
5. Confidence Intervals (95% and 99%)
6. Regression Analysis (if applicable)
7. Data Visualization (histograms, box plots, scatter plots)

Tools: Use R, Python, or Excel for calculations and graphs
Report: 8-10 pages including methodology, results, and conclusions
Data Source: Must be cited and verifiable`,
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          maxPoints: 100,
          subject: 'Mathematics',
          teacher: michaelChen._id
        })
      );
    }

    // Additional Environmental Science assignments
    if (emilyRodriguez) {
      newAssignments.push(
        new Assignment({
          title: 'Sustainability Assessment Project',
          description: `Conduct a comprehensive sustainability assessment of your local community or campus.

Assessment Areas:
1. Energy consumption and renewable energy potential
2. Water usage and conservation measures
3. Waste management and recycling programs
4. Transportation and carbon footprint
5. Green spaces and biodiversity
6. Sustainable food systems

Methodology:
- Data collection through surveys, interviews, and observations
- Quantitative analysis of resource consumption
- Comparison with sustainability benchmarks
- Stakeholder engagement

Deliverables:
- 15-page assessment report
- Executive summary with recommendations
- Data visualizations and infographics
- Presentation to class (10 minutes)

Focus on actionable recommendations for improvement.`,
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          maxPoints: 130,
          subject: 'Environmental Science',
          teacher: emilyRodriguez._id
        }),

        new Assignment({
          title: 'Environmental Impact Case Study',
          description: `Analyze a significant environmental impact case study of your choice.

Suggested Topics:
- Industrial pollution incidents
- Deforestation projects
- Mining operations
- Urban development impacts
- Agricultural practices
- Climate change effects

Analysis Requirements:
1. Background and context
2. Environmental impacts (air, water, soil, biodiversity)
3. Socioeconomic effects
4. Regulatory response
5. Mitigation measures implemented
6. Lessons learned
7. Current status and ongoing monitoring

Use peer-reviewed sources and government reports
Include maps, photos, and data visualizations
Minimum 8 credible references required`,
          dueDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
          maxPoints: 90,
          subject: 'Environmental Science',
          teacher: emilyRodriguez._id
        })
      );
    }

    // Additional Physics assignments
    if (jamesWilson) {
      newAssignments.push(
        new Assignment({
          title: 'Electromagnetic Induction Lab',
          description: `Design and conduct experiments to demonstrate electromagnetic induction principles.

Experiment 1: Faraday's Law
- Measure induced EMF in coils with different parameters
- Vary magnetic field strength, coil turns, and rate of change
- Plot EMF vs. rate of flux change

Experiment 2: Lenz's Law Demonstration
- Observe direction of induced currents
- Use different conductor materials
- Document observations with video/photos

Experiment 3: Transformer Principles
- Build simple transformer with different turn ratios
- Measure voltage transformation
- Calculate efficiency

Lab Report Requirements:
- Hypothesis and theoretical background
- Experimental setup and procedure
- Data collection and analysis
- Error analysis and uncertainties
- Conclusions and real-world applications

Safety protocols must be followed at all times.`,
          dueDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
          maxPoints: 115,
          subject: 'Physics',
          teacher: jamesWilson._id
        }),

        new Assignment({
          title: 'Quantum Physics Problem Set',
          description: `Solve advanced quantum mechanics problems demonstrating key principles.

Problem Set Includes:
1. Wave-particle duality calculations
2. Uncertainty principle applications
3. Schrödinger equation solutions (particle in a box)
4. Quantum tunneling probability calculations
5. Atomic orbital energy levels
6. Photoelectric effect analysis

For each problem:
- Show complete mathematical derivation
- Include proper units and significant figures
- Provide physical interpretation of results
- Discuss quantum vs. classical behavior

Mathematical tools: Complex numbers, differential equations, probability theory
Reference: Griffiths "Introduction to Quantum Mechanics"

This is an advanced assignment requiring strong mathematical background.`,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          maxPoints: 125,
          subject: 'Physics',
          teacher: jamesWilson._id
        })
      );
    }

    // Save all new assignments
    await Assignment.insertMany(newAssignments);
    console.log(`Added ${newAssignments.length} new assignments`);

    // Display summary
    console.log('\n=== NEW ASSIGNMENTS ADDED ===');
    newAssignments.forEach((assignment, index) => {
      console.log(`${index + 1}. ${assignment.title} (${assignment.subject})`);
      console.log(`   Due: ${assignment.dueDate.toDateString()}`);
      console.log(`   Points: ${assignment.maxPoints}`);
    });

  } catch (error) {
    console.error('Error adding assignments:', error);
  } finally {
    mongoose.connection.close();
  }
};

addMoreAssignments();