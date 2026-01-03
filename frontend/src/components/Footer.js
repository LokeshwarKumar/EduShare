import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#e5e5e5',
    color: '#333333',
    textAlign: 'center',
    padding: '2rem',
    marginTop: '2rem'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const linkStyle = {
    color: '#666666',
    textDecoration: 'none'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p>&copy; 2024 EduMat - College Material Sharing Platform</p>
        <p>
          Built with React & Spring Boot | 
          <a href="https://github.com" style={linkStyle} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
