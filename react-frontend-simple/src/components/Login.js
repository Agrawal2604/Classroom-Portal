import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await onLogin(credentials);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const quickLogin = (email, password) => {
    setCredentials({ email, password });
    setTimeout(() => {
      onLogin({ email, password });
    }, 100);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="text-center">
          <h1 className="logo">🎓 Classroom Portal</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="input"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f7fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>Quick Login (Demo)</h3>
          <div className="text-center">
            <button 
              onClick={() => quickLogin('teacher@test.com', 'password123')}
              className="btn btn-secondary"
            >
              👨‍🏫 Login as Teacher
            </button>
            <button 
              onClick={() => quickLogin('student@test.com', 'password123')}
              className="btn btn-secondary"
            >
              👨‍🎓 Login as Student
            </button>
            <button 
              onClick={() => quickLogin('admin@test.com', 'password123')}
              className="btn btn-secondary"
            >
              👑 Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;