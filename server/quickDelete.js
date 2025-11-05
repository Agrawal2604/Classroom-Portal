#!/usr/bin/env node

const DataManager = require('./dataManager');

// Quick delete script with simple commands
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Quick Delete Tool for Classroom Portal');
  console.log('=====================================');
  console.log('');
  console.log('Usage: node quickDelete.js <command> [options]');
  console.log('');
  console.log('Commands:');
  console.log('  clear-all                    - Delete ALL data (users, assignments, submissions)');
  console.log('  clear-assignments           - Delete all assignments and submissions');
  console.log('  clear-submissions           - Delete all submissions only');
  console.log('  clear-subject <name>        - Delete all data for a specific subject');
  console.log('  clear-teacher <email>       - Delete all data created by a teacher');
  console.log('  remove-user <email>         - Delete a specific user');
  console.log('  list                        - Show all data in database');
  console.log('');
  console.log('Examples:');
  console.log('  node quickDelete.js list');
  console.log('  node quickDelete.js clear-subject "Computer Science"');
  console.log('  node quickDelete.js remove-user "student@test.com"');
  console.log('  node quickDelete.js clear-teacher "teacher@test.com"');
  process.exit(0);
}

const manager = new DataManager();

const runQuickDelete = async () => {
  const command = args[0];
  const option = args[1];

  try {
    await manager.connect();

    switch (command) {
      case 'clear-all':
        console.log('⚠️  WARNING: This will delete ALL data!');
        const User = require('./models/User');
        const Assignment = require('./models/Assignment');
        const Submission = require('./models/Submission');
        
        await Submission.deleteMany({});
        await Assignment.deleteMany({});
        await User.deleteMany({});
        
        console.log('✅ All data cleared successfully!');
        break;

      case 'clear-assignments':
        const Assignment2 = require('./models/Assignment');
        const Submission2 = require('./models/Submission');
        
        await Submission2.deleteMany({});
        await Assignment2.deleteMany({});
        
        console.log('✅ All assignments and submissions cleared!');
        break;

      case 'clear-submissions':
        const Submission3 = require('./models/Submission');
        const result = await Submission3.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} submissions!`);
        break;

      case 'clear-subject':
        if (!option) {
          console.log('❌ Please specify a subject name');
          return;
        }
        await manager.deleteBySubject(option);
        break;

      case 'clear-teacher':
        if (!option) {
          console.log('❌ Please specify a teacher email');
          return;
        }
        await manager.deleteByTeacher(option);
        break;

      case 'remove-user':
        if (!option) {
          console.log('❌ Please specify a user email');
          return;
        }
        await manager.deleteUser(option);
        break;

      case 'list':
        await manager.listData();
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        console.log('Run "node quickDelete.js" for help');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await manager.disconnect();
  }
};

runQuickDelete();