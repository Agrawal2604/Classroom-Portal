import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Classroom Portal
        </Link>
        
        <div className="navbar-nav">
          {user ? (
            <>
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/assignments" className="nav-link">Assignments</Link>
              {user.role === 'teacher' && (
                <Link to="/assignments/create" className="nav-link">Create Assignment</Link>
              )}
              <Link to="/submissions" className="nav-link">
                {user.role === 'teacher' ? 'All Submissions' : 'My Submissions'}
              </Link>
              {user.role === 'teacher' && (
                <Link to="/data-management" className="nav-link">Data Management</Link>
              )}
              <span className="nav-link">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;