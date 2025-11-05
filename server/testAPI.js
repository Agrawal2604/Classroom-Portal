const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('🧪 Testing API endpoints...');
    
    // Test basic API
    try {
      const response = await axios.get('http://localhost:5003/');
      console.log('✅ Basic API test:', response.data);
    } catch (error) {
      console.log('❌ Basic API failed:', error.message);
    }

    // Test login endpoint
    try {
      const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
        email: 'teacher@test.com',
        password: 'password123'
      });
      console.log('✅ Login API test successful');
      console.log('👤 User:', loginResponse.data.user.name);
      console.log('🔑 Token received:', !!loginResponse.data.token);
    } catch (error) {
      console.log('❌ Login API failed:', error.response?.data || error.message);
    }

    // Test invalid login
    try {
      await axios.post('http://localhost:5003/api/auth/login', {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid login correctly rejected');
      } else {
        console.log('❌ Unexpected error for invalid login:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testAPI();