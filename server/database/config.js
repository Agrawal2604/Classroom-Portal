import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  development: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/classroom-portal-dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  production: {
    uri: process.env.MONGO_URI_PROD || process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    }
  },
  test: {
    uri: process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/classroom-portal-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = dbConfig[env];

// Database connection function
export const connectDatabase = async () => {
  try {
    console.log(`🔌 Connecting to MongoDB (${env} environment)...`);
    
    await mongoose.connect(currentConfig.uri, currentConfig.options);
    
    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: states[state],
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      collections: await mongoose.connection.db.listCollections().toArray()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
};

export default { connectDatabase, checkDatabaseHealth };