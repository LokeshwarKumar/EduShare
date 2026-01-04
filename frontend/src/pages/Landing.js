import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center'
  };

  const heroStyle = {
    backgroundColor: '#f5f5f5',
    padding: '3rem 2rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    color: '#000000',
    marginBottom: '1rem',
    fontWeight: 'bold'
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#666666',
    marginBottom: '2rem'
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'left'
  };

  const featureTitleStyle = {
    fontSize: '1.25rem',
    color: '#666666',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem'
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#999999',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#d4d4d4',
    color: '#333333'
  };

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>EduShare</h1>
        <p style={subtitleStyle}>
          Your College Material Sharing Platform
        </p>
        <p style={{ color: '#666666', lineHeight: '1.6' }}>
          Share, discover, and access educational materials with your college community. 
          Upload your study resources and help fellow students succeed.
        </p>
      </div>

      <div style={featuresStyle}>
        <div style={featureCardStyle}>
          <h3 style={featureTitleStyle}>📚 Share Materials</h3>
          <p style={{ color: '#666666' }}>
            Upload PDFs, documents, presentations and more. Share your knowledge with the community.
          </p>
        </div>

        <div style={featureCardStyle}>
          <h3 style={featureTitleStyle}>🔍 Discover Resources</h3>
          <p style={{ color: '#666666' }}>
            Find study materials by subject, department, or semester. Get access to curated educational content.
          </p>
        </div>

        <div style={featureCardStyle}>
          <h3 style={featureTitleStyle}>👥 Collaborate</h3>
          <p style={{ color: '#666666' }}>
            Connect with students and faculty. Build a comprehensive knowledge base for your college.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f5f5f5', borderRadius: '0.5rem' }}>
        <h3 style={{ color: '#000000', marginBottom: '1rem' }}>Why Join EduShare?</h3>
        <ul style={{ textAlign: 'left', color: '#000000', lineHeight: '1.8' }}>
          <li>Free access to educational resources</li>
          <li>Upload and share your study materials</li>
          <li>Organized by subject and department</li>
          <li>Admin-approved quality content</li>
          <li>Easy search and filtering</li>
          <li>Track your downloads and contributions</li>
        </ul>
      </div>
    </div>
  );
};

export default Landing;
