import React, { useState, useEffect } from 'react';
import axios from 'axios';

const APITest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Basic connectivity
    try {
      const response = await axios.get('http://localhost:3001/api/test');
      addResult('Server Connectivity', 'success', 'Server is reachable', response.data);
    } catch (error) {
      addResult('Server Connectivity', 'error', `Failed: ${error.message}`, error.response?.data);
    }

    // Test 2: CORS check
    try {
      const response = await fetch('http://localhost:3001/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      addResult('CORS Check', 'success', 'CORS is working', data);
    } catch (error) {
      addResult('CORS Check', 'error', `CORS failed: ${error.message}`);
    }

    // Test 3: Login test
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: 'teacher@test.com',
        password: 'password123'
      });
      addResult('Login Test', 'success', 'Login successful', {
        hasToken: !!response.data.token,
        user: response.data.user?.name
      });
    } catch (error) {
      addResult('Login Test', 'error', `Login failed: ${error.response?.data?.message || error.message}`, error.response?.data);
    }

    // Test 4: Check axios defaults
    addResult('Axios Config', 'info', 'Current axios configuration', {
      baseURL: axios.defaults.baseURL,
      timeout: axios.defaults.timeout,
      headers: axios.defaults.headers
    });

    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 API Connectivity Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTests} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Running Tests...' : 'Run Tests Again'}
        </button>
      </div>

      <div>
        {results.map((result, index) => (
          <div 
            key={index}
            style={{
              padding: '15px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: result.status === 'success' ? '#d4edda' : 
                             result.status === 'error' ? '#f8d7da' : '#d1ecf1'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: result.status === 'success' ? '#155724' : 
                                        result.status === 'error' ? '#721c24' : '#0c5460' }}>
                {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : 'ℹ️'} {result.test}
              </h4>
              <small style={{ color: '#666' }}>{result.timestamp}</small>
            </div>
            <p style={{ margin: '10px 0 0 0' }}>{result.message}</p>
            {result.data && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer', color: '#666' }}>View Details</summary>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  overflow: 'auto',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🔧 Configuration Info</h3>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
        <p><strong>Expected Backend:</strong> http://localhost:3001</p>
        <p><strong>Current Environment:</strong> {process.env.NODE_ENV || 'development'}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
      </div>
    </div>
  );
};

export default APITest;