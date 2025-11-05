const axios = require('axios');

const testSubmission = async () => {
  try {
    console.log('🧪 Testing Student Submission...');
    
    // First, login as a student to get a token
    console.log('🔐 Logging in as student...');
    const loginResponse = await axios.post('http://localhost:5003/api/auth/login', {
      email: 'student@test.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const student = loginResponse.data.user;
    console.log('✅ Logged in as:', student.name);
    
    // Get available assignments
    console.log('📚 Fetching assignments...');
    const assignmentsResponse = await axios.get('http://localhost:5003/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const assignments = assignmentsResponse.data;
    console.log(`📋 Found ${assignments.length} assignments`);
    
    if (assignments.length === 0) {
      console.log('❌ No assignments available for testing');
      return;
    }
    
    // Use the first assignment for testing
    const testAssignment = assignments[0];
    console.log('🎯 Testing with assignment:', testAssignment.title);
    
    // Submit the assignment
    const submissionData = {
      assignmentId: testAssignment._id,
      content: `Test submission for "${testAssignment.title}" by ${student.name}

This is a test submission to verify that the submission system is working correctly.

Assignment Details:
- Title: ${testAssignment.title}
- Subject: ${testAssignment.subject}
- Due Date: ${new Date(testAssignment.dueDate).toLocaleDateString()}
- Max Points: ${testAssignment.maxPoints}

Student Response:
I have completed this assignment according to the requirements. This submission demonstrates that the system is properly recording student submissions in the database.

Submitted on: ${new Date().toLocaleString()}`
    };
    
    console.log('📝 Submitting assignment...');
    const submissionResponse = await axios.post('http://localhost:5003/api/submissions', submissionData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Submission successful!');
    console.log('📄 Submission ID:', submissionResponse.data._id);
    console.log('📊 Status:', submissionResponse.data.status);
    console.log('👤 Student:', submissionResponse.data.student.name);
    console.log('📋 Assignment:', submissionResponse.data.assignment.title);
    
  } catch (error) {
    console.log('❌ Submission test failed:', error.response?.data || error.message);
    if (error.response?.status === 400 && error.response?.data?.message === 'Assignment already submitted') {
      console.log('ℹ️  This is expected if the student already submitted this assignment');
    }
  }
};

testSubmission();