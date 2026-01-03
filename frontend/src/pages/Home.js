import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const heroStyle = {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '1rem',
    marginBottom: '3rem'
  };

  const titleStyle = {
    fontSize: '3rem',
    color: '#333333',
    marginBottom: '1rem',
    fontWeight: 'bold'
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    color: '#666666',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const primaryButtonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  };

  const secondaryButtonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    display: 'inline-block',
    transition: 'background-color 0.3s'
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const featureIconStyle = {
    fontSize: '3rem',
    marginBottom: '1rem'
  };

  const featureTitleStyle = {
    fontSize: '1.5rem',
    color: '#333333',
    marginBottom: '1rem'
  };

  const featureDescriptionStyle = {
    color: '#666666',
    lineHeight: '1.6'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    backgroundColor: '#f5f5f5',
    padding: '2rem',
    borderRadius: '0.5rem',
    textAlign: 'center'
  };

  const statItemStyle = {
    padding: '1rem'
  };

  const statNumberStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    color: '#666666',
    fontSize: '1.1rem'
  };

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={titleStyle}>EduShare</h1>
        <p style={subtitleStyle}>
          Your comprehensive platform for sharing and accessing college study materials. 
          Connect, collaborate, and excel together.
        </p>
        
        <div style={buttonContainerStyle}>
          {isAuthenticated && (
            <>
              <Link to="/materials" style={primaryButtonStyle}>
                Browse Materials
              </Link>
              <Link to="/upload" style={secondaryButtonStyle}>
                Upload Material
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div style={featuresStyle}>
        <div style={featureCardStyle}>
          <div style={featureIconStyle}>📚</div>
          <h3 style={featureTitleStyle}>Rich Library</h3>
          <p style={featureDescriptionStyle}>
            Access a comprehensive collection of study materials including PDFs, 
            presentations, notes, and more across various subjects.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={featureIconStyle}>🔍</div>
          <h3 style={featureTitleStyle}>Easy Search</h3>
          <p style={featureDescriptionStyle}>
            Find exactly what you need with our powerful search and filtering system. 
            Search by subject, department, semester, or keywords.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={featureIconStyle}>✅</div>
          <h3 style={featureTitleStyle}>Quality Assured</h3>
          <p style={featureDescriptionStyle}>
            All materials go through admin approval to ensure quality and relevance. 
            Only the best content makes it to the platform.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={featureIconStyle}>👥</div>
          <h3 style={featureTitleStyle}>Community Driven</h3>
          <p style={featureDescriptionStyle}>
            Built by students, for students. Share your knowledge and help others 
            succeed in their academic journey.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={featureIconStyle}>📱</div>
          <h3 style={featureTitleStyle}>Accessible Anywhere</h3>
          <p style={featureDescriptionStyle}>
            Access materials anytime, anywhere. Download resources for offline study 
            and stay productive on the go.
          </p>
        </div>

        <div style={featureCardStyle}>
          <div style={featureIconStyle}>🎓</div>
          <h3 style={featureTitleStyle}>Multi-Discipline</h3>
          <p style={featureDescriptionStyle}>
            Supporting various departments and subjects. From engineering to arts, 
            find resources for every field of study.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={statNumberStyle}>1000+</div>
          <div style={statLabelStyle}>Study Materials</div>
        </div>
        <div style={statItemStyle}>
          <div style={statNumberStyle}>500+</div>
          <div style={statLabelStyle}>Active Users</div>
        </div>
        <div style={statItemStyle}>
          <div style={statNumberStyle}>50+</div>
          <div style={statLabelStyle}>Subjects</div>
        </div>
        <div style={statItemStyle}>
          <div style={statNumberStyle}>10+</div>
          <div style={statLabelStyle}>Departments</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
