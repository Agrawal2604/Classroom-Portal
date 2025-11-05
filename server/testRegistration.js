const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing Registration API...');
    
    // Test registration
    const registrationData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      role: 'student',
      studentId: 'TEST001'
    };
    
    console.log('📝 Registration data:', registrationData);
    
    const response = await axios.post('http://localhost:5003/api/auth/register', registrationData);
    
    console.log('✅ Registration successful!');
    console.log('👤 User created:', response.data.user);
    console.log('🔑 Token received:', !!response.data.token);
    
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
  }
};

testRegistration();