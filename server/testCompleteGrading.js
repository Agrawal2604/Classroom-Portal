const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const testCompleteGrading = async () => {
  try {
    console.log('🧪 Testing Complete Grading System\n');

    // Step 1: Login as demo teacher
    console.log('1️⃣ Logging in as demo teacher...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'teacher@test.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    const teacher = loginResponse.data.user;
    console.log('✅ Logged in as:', teacher.name, '(Role:', teacher.role + ')');

    const authHeaders = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Step 2: Get all submissions for this teacher
    console.log('\n2️⃣ Fetching teacher\'s submissions...');
    const submissionsResponse = await axios.get(`${API_BASE}/submissions`, authHeaders);
    
    if (submissionsResponse.data.success) {
      const submissions = submissionsResponse.data.submissions;
      console.log('✅ Found submissions:', submissions.length);
      
      // Show submission details
      submissions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.student.name} - ${sub.assignment.title}`);
        console.log(`      Grade: ${sub.grade || 'Not graded'} | Status: ${sub.status} | Can Grade: ${sub.canGrade}`);
      });

      // Step 3: Find submissions that can be graded
      const gradableSubmissions = submissions.filter(s => s.canGrade);
      console.log('\n📝 Submissions available for grading:', gradableSubmissions.length);

      if (gradableSubmissions.length > 0) {
        // Test individual grading
        console.log('\n3️⃣ Testing individual grading...');
        const testSubmission = gradableSubmissions[0];
        console.log('Grading submission by:', testSubmission.student.name);
        console.log('Assignment:', testSubmission.assignment.title);
        console.log('Max Points:', testSubmission.assignment.maxPoints);

        const gradeData = {
          grade: 45,
          feedback: 'Excellent work! Clear explanations and good understanding of concepts. Well done!'
        };

        try {
          const gradeResponse = await axios.put(
            `${API_BASE}/submissions/${testSubmission._id}/grade`,
            gradeData,
            authHeaders
          );

          if (gradeResponse.data.success) {
            console.log('✅ Grading successful!');
            console.log('   Student:', gradeResponse.data.submission.student.name);
            console.log('   Grade:', gradeResponse.data.submission.grade + '/' + gradeResponse.data.submission.assignment.maxPoints);
            console.log('   Percentage:', Math.round((gradeResponse.data.submission.grade / gradeResponse.data.submission.assignment.maxPoints) * 100) + '%');
            console.log('   Feedback:', gradeResponse.data.submission.feedback ? 'Provided' : 'None');
          }
        } catch (gradeError) {
          console.log('❌ Grading failed:', gradeError.response?.data?.message || gradeError.message);
        }

        // Test grade update (if we have more submissions)
        if (gradableSubmissions.length > 1) {
          console.log('\n4️⃣ Testing grade update...');
          const updateSubmission = gradableSubmissions[1];
          
          // First grade
          await axios.put(
            `${API_BASE}/submissions/${updateSubmission._id}/grade`,
            { grade: 40, feedback: 'Good work, but could be improved.' },
            authHeaders
          );
          
          // Then update
          const updateResponse = await axios.put(
            `${API_BASE}/submissions/${updateSubmission._id}/grade`,
            { grade: 47, feedback: 'Updated after review - much better analysis!' },
            authHeaders
          );

          if (updateResponse.data.success) {
            console.log('✅ Grade update successful!');
            console.log('   Previous Grade:', updateResponse.data.submission.previousGrade);
            console.log('   New Grade:', updateResponse.data.submission.grade);
            console.log('   Has History:', updateResponse.data.submission.gradeHistory.length > 0);
          }
        }

        // Test bulk grading
        if (gradableSubmissions.length > 2) {
          console.log('\n5️⃣ Testing bulk grading...');
          const bulkSubmissions = gradableSubmissions.slice(2, 5); // Take up to 3 submissions
          const bulkIds = bulkSubmissions.map(s => s._id);

          const bulkGradeData = {
            submissionIds: bulkIds,
            grade: 42,
            feedback: 'Good effort shown. Demonstrates understanding of key concepts.'
          };

          try {
            const bulkResponse = await axios.put(
              `${API_BASE}/submissions/bulk-grade`,
              bulkGradeData,
              authHeaders
            );

            if (bulkResponse.data.success) {
              console.log('✅ Bulk grading successful!');
              console.log('   Total Requested:', bulkResponse.data.summary.totalRequested);
              console.log('   Successful:', bulkResponse.data.summary.successful);
              console.log('   Failed:', bulkResponse.data.summary.failed);
              console.log('   Grade Applied:', bulkResponse.data.summary.grade);
            }
          } catch (bulkError) {
            console.log('❌ Bulk grading failed:', bulkError.response?.data?.message || bulkError.message);
          }
        }
      } else {
        console.log('⚠️ No submissions available for grading by this teacher');
      }

      // Step 6: Verify final state
      console.log('\n6️⃣ Verifying final state...');
      const finalResponse = await axios.get(`${API_BASE}/submissions`, authHeaders);
      if (finalResponse.data.success) {
        const finalSubmissions = finalResponse.data.submissions;
        const gradedCount = finalSubmissions.filter(s => s.grade !== null && s.grade !== undefined).length;
        
        console.log('✅ Final verification:');
        console.log('   Total Submissions:', finalSubmissions.length);
        console.log('   Graded Submissions:', gradedCount);
        console.log('   Ungraded Submissions:', finalSubmissions.length - gradedCount);
      }

    } else {
      console.log('❌ Failed to fetch submissions:', submissionsResponse.data);
    }

    console.log('\n🎉 Grading system test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

// Run the test
testCompleteGrading();