const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const debugDB = async () => {
  try {
    console.log('🔍 Environment check:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to:', mongoose.connection.name);
    console.log('📍 Host:', mongoose.connection.host);
    
    // List all users
    const users = await User.find({});
    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    // Test specific user lookup
    const testUser = await User.findOne({ email: 'teacher@test.com' });
    console.log('\n🎯 Test user lookup:');
    console.log('teacher@test.com found:', !!testUser);
    if (testUser) {
      console.log('User details:', {
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
      });
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

debugDB();