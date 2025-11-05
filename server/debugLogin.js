const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User');

const debugLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classroom-portal');
    console.log('Connected to MongoDB');

    // Test direct database login
    console.log('\n=== DIRECT DATABASE TEST ===');
    const user = await User.findOne({ email: 'teacher@test.com' });
    if (user) {
      console.log('User found in database');
      const isMatch = await user.comparePassword('password123');
      console.log('Password comparison result:', isMatch);
    } else {
      console.log('User NOT found in database');
    }

    // Test API login
    console.log('\n=== API TEST ===');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'teacher@test.com',
        password: 'password123'
      });
      console.log('API Login Success:', response.data);
    } catch (error) {
      console.log('API Login Error:', error.response?.data || error.message);
      
      // Test if server is running
      try {
        const testResponse = await axios.get('http://localhost:5000/');
        console.log('Server is running:', testResponse.data);
      } catch (serverError) {
        console.log('Server connection error:', serverError.message);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugLogin();