const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with enhanced error handling and reconnection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${conn.connection.name} on ${conn.connection.host}:${conn.connection.port}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 Network Error: Cannot reach database server');
      console.error('💡 Solutions:');
      console.error('   - Check your internet connection');
      console.error('   - Verify the database URL in .env file');
      console.error('   - Ensure MongoDB service is running (if local)');
    } else if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication Error: Invalid credentials');
      console.error('💡 Solutions:');
      console.error('   - Check username and password in connection string');
      console.error('   - Verify database user permissions');
    }
    
    // Don't exit in development, try to reconnect
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Attempting to reconnect in 5 seconds...');
      setTimeout(connectDB, 5000);
    } else {
      process.exit(1);
    }
  }
};

// Initialize database connection
connectDB();

// Handle connection events with better error handling
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(() => {
      mongoose.connect(process.env.MONGODB_URI).catch(console.error);
    }, 5000);
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully');
});

mongoose.connection.on('connected', () => {
  console.log('🔗 MongoDB connection established');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));

app.get('/', (req, res) => {
  res.json({ message: 'Classroom Assignment Portal API' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});