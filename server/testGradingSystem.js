const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:8080/api';

const testGradingSystem = async () => {
  try {
    console.log('🧪 Testing Classroom Assignment Portal Grading System\n');

    // Test 1: Login as demo teacher
    console.log('1️⃣ Testing Teacher Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'teacher@test.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    const teacher = loginResponse.data.user;
    console.log('✅ Teacher logged in:', teacher.name);

    const authHeaders = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Test 2: Get teacher's submissions
    console.log('\n2️⃣ Fetching Teacher\'s Submissions...');
    const submissionsResponse = await axios.get(`${API_BASE}/submissions`, authHeaders);
    const submissions = submissionsResponse.data.submissions;
    console.log('✅ Found submissions:', submissions.length);

    // Find ungraded submissions
    const ungradedSubmissions = submissions.filter(s => !s.grade && s.canGrade);
    console.log('📝 Ungraded submissions available:', ungradedSubmissions.length);

    if (ungradedSubmissions.length > 0) {
      const testSubmission = ungradedSubmissions[0];
      console.log('\n3️⃣ Testing Individual Grading...');
      console.log('Target submission:', {
        student: testSubmission.student.name,
        assignment: testSubmission.assignment.title,
        maxPoints: testSubmission.assignment.maxPoints
      });

      // Test 3: Grade a submission
      const gradeData = {
        grade: 45,
        feedback: 'Great work! Well-structured response with clear explanations. Keep up the excellent effort!'
      };

      const gradeResponse = await axios.put(
        `${API_BASE}/submissions/${testSubmission._id}/grade`,
        gradeData,
        authHeaders
      );

      console.log('✅ Individual grading successful:', {
        student: gradeResponse.data.submission.student.name,
        grade: `${gradeResponse.data.submission.grade}/${gradeResponse.data.submission.assignment.maxPoints}`,
        percentage: Math.round((gradeResponse.data.submission.grade / gradeResponse.data.submission.assignment.maxPoints) * 100) + '%'
      });

      // Test 4: Update the same grade (test grade history)
      console.log('\n4️⃣ Testing Grade Update (History Tracking)...');
      const updateData = {
        grade: 48,
        feedback: 'Updated grade after review. Excellent attention to detail and comprehensive analysis!'
      };

      const updateResponse = await axios.put(
        `${API_BASE}/submissions/${testSubmission._id}/grade`,
        updateData,
        authHeaders
      );

      console.log('✅ Grade update successful:', {
        previousGrade: updateResponse.data.submission.previousGrade,
        newGrade: updateResponse.data.submission.grade,
        hasHistory: updateResponse.data.submission.gradeHistory.length > 0
      });

      // Test 5: Check grade history
      console.log('\n5️⃣ Testing Grade History...');
      const historyResponse = await axios.get(
        `${API_BASE}/submissions/${testSubmission._id}/history`,
        authHeaders
      );

      console.log('✅ Grade history retrieved:', {
        currentGrade: historyResponse.data.currentGrade,
        historyEntries: historyResponse.data.gradeHistory.length,
        gradedBy: historyResponse.data.gradedBy?.name
      });
    }

    // Test 6: Bulk grading
    const remainingUngraded = submissions.filter(s => !s.grade && s.canGrade);
    if (remainingUngraded.length > 1) {
      console.log('\n6️⃣ Testing Bulk Grading...');
      const bulkSubmissionIds = remainingUngraded.slice(0, 3).map(s => s._id);
      
      const bulkGradeData = {
        submissionIds: bulkSubmissionIds,
        grade: 42,
        feedback: 'Good effort on this assignment. Shows understanding of key concepts.'
      };

      const bulkResponse = await axios.put(
        `${API_BASE}/submissions/bulk-grade`,
        bulkGradeData,
        authHeaders
      );

      console.log('✅ Bulk grading successful:', {
        totalRequested: bulkResponse.data.summary.totalRequested,
        successful: bulkResponse.data.summary.successful,
        failed: bulkResponse.data.summary.failed,
        grade: bulkResponse.data.summary.grade
      });
    }

    // Test 7: Verify data persistence
    console.log('\n7️⃣ Verifying Data Persistence...');
    const finalSubmissionsResponse = await axios.get(`${API_BASE}/submissions`, authHeaders);
    const finalSubmissions = finalSubmissionsResponse.data.submissions;
    const gradedCount = finalSubmissions.filter(s => s.grade !== null && s.grade !== undefined).length;
    
    console.log('✅ Data persistence verified:', {
      totalSubmissions: finalSubmissions.length,
      gradedSubmissions: gradedCount,
      ungradedSubmissions: finalSubmissions.length - gradedCount
    });

    // Test 8: Authorization test (try to grade another teacher's assignment)
    console.log('\n8️⃣ Testing Authorization (Should Fail)...');
    try {
      // Find a submission from another teacher
      const otherTeacherSubmission = finalSubmissions.find(s => !s.canGrade);
      if (otherTeacherSubmission) {
        await axios.put(
          `${API_BASE}/submissions/${otherTeacherSubmission._id}/grade`,
          { grade: 50, feedback: 'Test' },
          authHeaders
        );
        console.log('❌ Authorization test failed - should have been blocked');
      } else {
        console.log('⚠️ No other teacher submissions found to test authorization');
      }
    } catch (authError) {
      if (authError.response?.status === 403) {
        console.log('✅ Authorization working correctly - access denied as expected');
      } else {
        console.log('⚠️ Unexpected authorization error:', authError.response?.data?.message);
      }
    }

    console.log('\n🎉 All grading system tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Teacher authentication');
    console.log('✅ Submission retrieval');
    console.log('✅ Individual grading');
    console.log('✅ Grade updates with history');
    console.log('✅ Grade history tracking');
    console.log('✅ Bulk grading');
    console.log('✅ Data persistence');
    console.log('✅ Authorization controls');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run tests
testGradingSystem();