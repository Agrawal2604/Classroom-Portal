const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
    console.log('Connected to MongoDB');

    // Get counts before deletion
    const userCount = await User.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const submissionCount = await Submission.countDocuments();

    console.log('\n=== CURRENT DATABASE STATUS ===');
    console.log(`Users: ${userCount}`);
    console.log(`Assignments: ${assignmentCount}`);
    console.log(`Submissions: ${submissionCount}`);

    // Clear all data
    console.log('\n=== CLEARING DATABASE ===');
    
    const deletedUsers = await User.deleteMany({});
    console.log(`✓ Deleted ${deletedUsers.deletedCount} users`);
    
    const deletedAssignments = await Assignment.deleteMany({});
    console.log(`✓ Deleted ${deletedAssignments.deletedCount} assignments`);
    
    const deletedSubmissions = await Submission.deleteMany({});
    console.log(`✓ Deleted ${deletedSubmissions.deletedCount} submissions`);

    // Verify deletion
    const remainingUsers = await User.countDocuments();
    const remainingAssignments = await Assignment.countDocuments();
    const remainingSubmissions = await Submission.countDocuments();

    console.log('\n=== VERIFICATION ===');
    console.log(`Remaining users: ${remainingUsers}`);
    console.log(`Remaining assignments: ${remainingAssignments}`);
    console.log(`Remaining submissions: ${remainingSubmissions}`);

    if (remainingUsers === 0 && remainingAssignments === 0 && remainingSubmissions === 0) {
      console.log('\n🎉 Database cleared successfully!');
    } else {
      console.log('\n⚠️  Some data may still remain in the database');
    }

  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
  }
};

clearDatabase();