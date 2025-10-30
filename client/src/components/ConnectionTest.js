import React, { useState, useEffect } from 'react';
import { healthAPI, authAPI } from '../services/api';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [authStatus, setAuthStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    try {
      // Test backend health
      const healthResponse = await healthAPI.check();
      if (healthResponse.data.status === 'healthy') {
        setBackendStatus('✅ Connected - Database: ' + healthResponse.data.database.database);
      } else {
        setBackendStatus('❌ Backend unhealthy');
      }

      // Test authentication endpoint
      try {
        const authResponse = await authAPI.login({
          email: 'teacher@test.com',
          password: 'password123'
        });
        if (authResponse.data.token) {
          setAuthStatus('✅ Authentication working - User: ' + authResponse.data.user.name);
        }
      } catch (authError) {
        if (authError.response?.status === 400) {
          setAuthStatus('✅ Auth endpoint responding (invalid credentials expected)');
        } else {
          setAuthStatus('❌ Auth endpoint error: ' + authError.message);
        }
      }

    } catch (error) {
      setError('❌ Connection failed: ' + error.message);
      setBackendStatus('❌ Cannot connect to backend');
      setAuthStatus('❌ Cannot test authentication');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔧 Backend Connection Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Backend Health:</strong> {backendStatus}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Authentication API:</strong> {authStatus}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <button onClick={testConnections} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        🔄 Test Again
      </button>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Expected Results:</h3>
        <ul>
          <li>✅ Backend Health: Connected - Database: classroom-portal</li>
          <li>✅ Authentication API: Working with valid credentials</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTest;