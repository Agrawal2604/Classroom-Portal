const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const testLogin = async () => {
  try {
    console.log('🧪 Testing Login and Registration System\n');

    // Test 1: Server health check
    console.log('1️⃣ Testing server connection...');
    const healthResponse = await axios.get(`${API_BASE}/test`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: Test teacher login
    console.log('\n2️⃣ Testing teacher login...');
    try {
      const teacherLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'teacher@test.com',
        password: 'password123'
      });
      
      console.log('✅ Teacher login successful!');
      console.log('   User:', teacherLoginResponse.data.user.name);
      console.log('   Role:', teacherLoginResponse.data.user.role);
      console.log('   Token received:', !!teacherLoginResponse.data.token);
      
      // Test token validation
      const token = teacherLoginResponse.data.token;
      const meResponse = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Token validation successful:', meResponse.data.user.name);
      
    } catch (loginError) {
      console.log('❌ Teacher login failed:', loginError.response?.data?.message || loginError.message);
    }

    // Test 3: Test student login
    console.log('\n3️⃣ Testing student login...');
    try {
      const studentLoginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'student@test.com',
        password: 'password123'
      });
      
      console.log('✅ Student login successful!');
      console.log('   User:', studentLoginResponse.data.user.name);
      console.log('   Role:', studentLoginResponse.data.user.role);
      console.log('   Student ID:', studentLoginResponse.data.user.studentId);
      
    } catch (loginError) {
      console.log('❌ Student login failed:', loginError.response?.data?.message || loginError.message);
    }

    // Test 4: Test invalid login
    console.log('\n4️⃣ Testing invalid login (should fail)...');
    try {
      await axios.post(`${API_BASE}/auth/login`, {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
      console.log('❌ Invalid login test failed - should have been rejected');
    } catch (invalidError) {
      if (invalidError.response?.status === 400) {
        console.log('✅ Invalid login correctly rejected:', invalidError.response.data.message);
      } else {
        console.log('⚠️ Unexpected error:', invalidError.response?.data?.message || invalidError.message);
      }
    }

    // Test 5: Test registration
    console.log('\n5️⃣ Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      role: 'student',
      studentId: `TEST${Date.now()}`
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log('✅ Registration successful!');
      console.log('   User:', registerResponse.data.user.name);
      console.log('   Email:', registerResponse.data.user.email);
      console.log('   Role:', registerResponse.data.user.role);
      console.log('   Token received:', !!registerResponse.data.token);
    } catch (registerError) {
      console.log('❌ Registration failed:', registerError.response?.data?.message || registerError.message);
    }

    console.log('\n🎉 Login and Registration tests completed!');

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Server connection failed. Make sure:');
      console.error('- Server is running on port 3001');
      console.error('- MongoDB connection is working');
      console.error('- No firewall blocking the connection');
    }
  }
};

testLogin();