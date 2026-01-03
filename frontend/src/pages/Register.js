import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    department: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/login');
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333333'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    backgroundColor: 'white'
  };

  const buttonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666666'
  };

  const errorStyle = {
    backgroundColor: '#f5f5f5',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    marginBottom: '1rem',
    border: '1px solid #d4d4d4'
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Register</h1>
      
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={rowStyle}>
          <div>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '0.5rem' }}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={inputStyle}
              placeholder="First name"
            />
          </div>

          <div>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Your email address"
          />
        </div>

        <div style={rowStyle}>
          <div>
            <label htmlFor="department" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Computer Science"
            />
          </div>

          <div>
            <label htmlFor="semester" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Semester
            </label>
            <input
              type="number"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              min="1"
              max="8"
              style={inputStyle}
              placeholder="e.g., 3"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            style={inputStyle}
            placeholder="Min 6 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
            style={inputStyle}
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div style={linkStyle}>
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
