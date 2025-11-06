const axios = require('axios');

const API_BASE = 'https://classroom-portal-0epc.onrender.com';

const testRenderBackend = async () => {
  console.log('🧪 Testing Your Deployed Backend');
  console.log('Backend URL:', API_BASE);
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

    console.log('\n🎉 Your Render backend is working perfectly!');
    console.log('\n📋 Backend Status:');
    console.log('✅ Server is running');
    console.log('✅ Database is connected');
    console.log('✅ API endpoints are working');
    console.log('✅ Authentication is functional');
    console.log('\n🌐 Your backend is ready at:', API_BASE);
    console.log('\n🚀 Now you can deploy your frontend to Vercel!');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Check:');
      console.error('- Render service is running');
      console.error('- URL is correct');
      console.error('- Service is not sleeping (free tier)');
    }
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testRenderBackend();