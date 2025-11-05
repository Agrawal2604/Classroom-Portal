const axios = require('axios');

// Test frontend API calls exactly as the React app would make them
const testFrontendAPI = async () => {
  try {
    console.log('🧪 Testing Frontend API Integration\n');

    // Configure axios exactly like the frontend
    const api = axios.create({
      baseURL: 'http://localhost:3001',
      timeout: 10000,
    });

    // Test 1: Health check
    console.log('1️⃣ Testing API health check...');
    const healthResponse = await api.get('/api/test');
    console.log('✅ API health check successful:', healthResponse.data.message);

    // Test 2: Login request (exactly like frontend)
    console.log('\n2️⃣ Testing login request (frontend style)...');
    const loginResponse = await api.post('/api/auth/login', {
      email: 'teacher@test.com',
      password: 'password123'
    });

    console.log('✅ Login successful!');
    console.log('   Response structure:', {
      hasToken: !!loginResponse.data.token,
      hasUser: !!loginResponse.data.user,
      userName: loginResponse.data.user?.name,
      userRole: loginResponse.data.user?.role
    });

    // Test 3: Authenticated request
    console.log('\n3️⃣ Testing authenticated request...');
    const token = loginResponse.data.token;
    
    // Add token to headers (like frontend interceptor)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const meResponse = await api.get('/api/auth/me');
    console.log('✅ Authenticated request successful:', meResponse.data.user.name);

    // Test 4: Test submissions endpoint
    console.log('\n4️⃣ Testing submissions endpoint...');
    const submissionsResponse = await api.get('/api/submissions');
    console.log('✅ Submissions endpoint working:', {
      success: submissionsResponse.data.success,
      count: submissionsResponse.data.submissions?.length || submissionsResponse.data.length
    });

    console.log('\n🎉 All frontend API tests passed!');
    console.log('\n📋 Summary:');
    console.log('✅ Server connectivity: Working');
    console.log('✅ Login endpoint: Working');
    console.log('✅ Token authentication: Working');
    console.log('✅ Protected routes: Working');
    console.log('✅ API response format: Correct');

  } catch (error) {
    console.error('❌ Frontend API test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Check:');
      console.error('- Server is running on port 3001');
      console.error('- No firewall blocking connections');
      console.error('- CORS is properly configured');
    }
  }
};

testFrontendAPI();