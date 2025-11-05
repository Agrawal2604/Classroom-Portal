const mongoose = require('mongoose');
require('dotenv').config();

// Database connection configuration
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to database...');
    console.log('📍 Database URI:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT_MS) || 30000,
      socketTimeoutMS: 45000
    });

    console.log('✅ Database connected successfully!');
    console.log(`📊 Connected to: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🗄️  Database name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 Network Error: Cannot reach database server');
      console.error('💡 Check your internet connection and database URL');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication Error: Invalid username/password');
      console.error('💡 Check your database credentials');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('⚙️  Configuration Error: Database URI not set');
      console.error('💡 Set MONGODB_URI in your .env file');
    }
    
    process.exit(1);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const conn = await connectDB();
    
    // Test basic operations
    console.log('\n🧪 Testing database operations...');
    
    // Test collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Test write operation
    const testDoc = await conn.connection.db.collection('test').insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Database connection test successful'
    });
    console.log('✍️  Write test successful:', testDoc.insertedId);
    
    // Clean up test document
    await conn.connection.db.collection('test').deleteOne({ _id: testDoc.insertedId });
    console.log('🧹 Cleanup completed');
    
    console.log('\n🎉 Database setup completed successfully!');
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
};

// Database health check
const healthCheck = async () => {
  try {
    await connectDB();
    
    const stats = await mongoose.connection.db.stats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Documents: ${stats.objects}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
};

// Export functions
module.exports = {
  connectDB,
  testConnection,
  healthCheck
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'test':
      testConnection();
      break;
    case 'health':
      healthCheck();
      break;
    case 'connect':
      connectDB().then(() => {
        console.log('Connection established. Press Ctrl+C to exit.');
      });
      break;
    default:
      console.log('Database Setup Tool');
      console.log('==================');
      console.log('');
      console.log('Commands:');
      console.log('  node setupDatabase.js test    - Test database connection');
      console.log('  node setupDatabase.js health  - Check database health');
      console.log('  node setupDatabase.js connect - Connect and keep alive');
      console.log('');
      console.log('Environment Variables Required:');
      console.log('  MONGODB_URI - Database connection string');
      console.log('  JWT_SECRET  - JWT signing secret');
  }
}