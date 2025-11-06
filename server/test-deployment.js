const axios = require('axios');

// Test deployment - replace with your actual Render URL
const API_BASE = process.env.API_URL || 'http://localhost:3001';

const testDeployment = async () => {
  console.log('🧪 Testing Deployment');
  console.log('API Base URL:', API_BASE);
  console.log('');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: API test endpoint
    console.log('\n2️⃣ Testing API endpoint...');
    const apiResponse = await axios.get(`${API_BASE}/api/test`);
    console.log('✅ API test passed:', apiResponse.data);

    // Test 3: Authentication
    console.log('\n3️⃣ Testing authentication...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      email: 'teacher@test.com',
      password: 'password123'
    });
    console.log('✅ Authentication test passed:', {
      user: loginResponse.data.user.name,
      role: loginResponse.data.user.role,
      hasToken: !!loginResponse.data.token
    });

    console.log('\n🎉 All deployment tests passed!');
    console.log('\n📋 Deployment Summary:');
    console.log('✅ Server is running');
    console.log('✅ Database is connected');
    console.log('✅ API endpoints are working');
    console.log('✅ Authentication is functional');
    console.log('\n🌐 Your API is ready at:', API_BASE);

  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Check:');
      console.error('- Server is running');
      console.error('- URL is correct');
      console.error('- No firewall blocking');
    }
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testDeployment();