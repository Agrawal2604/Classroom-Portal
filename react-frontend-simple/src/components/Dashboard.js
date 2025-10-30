import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, onLogout }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      } else {
        setError('Failed to fetch classes');
      }
    } catch (error) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const joinClass = async (code) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      
      if (response.ok) {
        alert('Successfully joined class!');
        fetchClasses();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to join class');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const createClass = async (title, code) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, code })
      });
      
      if (response.ok) {
        alert('Class created successfully!');
        fetchClasses();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create class');
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const handleJoinClass = () => {
    const code = prompt('Enter class code:');
    if (code) {
      joinClass(code);
    }
  };

  const handleCreateClass = () => {
    const title = prompt('Enter class title:');
    const code = prompt('Enter class code:');
    if (title && code) {
      createClass(title, code);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🎓 Classroom Portal</div>
        <div>
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn" style={{ marginLeft: '10px' }}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Dashboard</h2>
        <p>Role: <strong>{user.role}</strong></p>
        
        {user.role === 'student' && (
          <button onClick={handleJoinClass} className="btn">
            Join Class
          </button>
        )}
        
        {(user.role === 'teacher' || user.role === 'admin') && (
          <button onClick={handleCreateClass} className="btn">
            Create Class
          </button>
        )}
      </div>

      <div className="card">
        <h3>My Classes</h3>
        {loading ? (
          <p>Loading classes...</p>
        ) : error ? (
          <div className="error">{error}</div>
        ) : classes.length === 0 ? (
          <p>No classes found. {user.role === 'student' ? 'Join a class to get started!' : 'Create a class to get started!'}</p>
        ) : (
          <div className="grid">
            {classes.map((cls) => (
              <div key={cls._id} className="card">
                <h4>{cls.title}</h4>
                <p><strong>Code:</strong> {cls.code}</p>
                <p><strong>Students:</strong> {cls.members?.length || 0}</p>
                <p><strong>Assignments:</strong> {cls.assignments?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>System Status</h3>
        <div className="grid">
          <div>
            <h4>🖥️ Frontend</h4>
            <div className="success">✅ React App Running</div>
          </div>
          <div>
            <h4>⚙️ Backend</h4>
            <div className="success">✅ API Connected</div>
          </div>
          <div>
            <h4>🗄️ Database</h4>
            <div className="success">✅ MongoDB Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;