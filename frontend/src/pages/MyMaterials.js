import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import materialService from '../services/materialService';

const MyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMaterials();
  }, []);

  const fetchMyMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialService.getMyMaterials();
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching my materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'REJECTED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'APPROVED':
        return '#d1fae5';
      case 'PENDING':
        return '#fed7aa';
      case 'REJECTED':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333333'
  };

  const buttonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    fontSize: '1rem'
  };

  const materialsGridStyle = {
    display: 'grid',
    gap: '1.5rem'
  };

  const materialCardStyle = {
    backgroundColor: 'white',
    border: '1px solid #d4d4d4',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const materialHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  };

  const materialTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333333',
    textDecoration: 'none',
    flex: 1
  };

  const statusBadgeStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.25rem',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  };

  const materialMetaStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  };

  const metaItemStyle = {
    fontSize: '0.9rem',
    color: '#666666'
  };

  const descriptionStyle = {
    color: '#666666',
    marginBottom: '1rem',
    lineHeight: '1.5'
  };

  const linkStyle = {
    color: '#666666',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#666666'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '0.5rem',
    color: '#666666'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Materials</h1>
        <Link to="/upload" style={buttonStyle}>
          Upload New Material
        </Link>
      </div>

      {loading ? (
        <div style={loadingStyle}>Loading your materials...</div>
      ) : materials.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3>No materials uploaded yet</h3>
          <p>Start sharing your knowledge by uploading your first material.</p>
          <Link to="/upload" style={buttonStyle}>
            Upload Material
          </Link>
        </div>
      ) : (
        <div style={materialsGridStyle}>
          {materials.map(material => (
            <div key={material.id} style={materialCardStyle}>
              <div style={materialHeaderStyle}>
                <Link to={`/materials/${material.id}`} style={materialTitleStyle}>
                  {material.title}
                </Link>
                <div style={{
                  ...statusBadgeStyle,
                  backgroundColor: getStatusBg(material.approvalStatus),
                  color: getStatusColor(material.approvalStatus)
                }}>
                  {material.approvalStatus}
                </div>
              </div>
              
              <div style={materialMetaStyle}>
                <div style={metaItemStyle}>
                  <strong>Subject:</strong> {material.subjectName}
                </div>
                <div style={metaItemStyle}>
                  <strong>Department:</strong> {material.department || 'N/A'}
                </div>
                <div style={metaItemStyle}>
                  <strong>Semester:</strong> {material.semester || 'N/A'}
                </div>
                <div style={metaItemStyle}>
                  <strong>Upload Date:</strong> {formatDate(material.uploadDate)}
                </div>
                <div style={metaItemStyle}>
                  <strong>File:</strong> {material.fileName}
                </div>
                <div style={metaItemStyle}>
                  <strong>Size:</strong> {formatFileSize(material.fileSize)}
                </div>
                {material.approvalStatus === 'APPROVED' && (
                  <div style={metaItemStyle}>
                    <strong>Downloads:</strong> {material.downloadCount}
                  </div>
                )}
              </div>

              {material.description && (
                <div style={descriptionStyle}>
                  {material.description.length > 200 
                    ? material.description.substring(0, 200) + '...' 
                    : material.description}
                </div>
              )}

              {material.rejectionReason && (
                <div style={{
                  backgroundColor: '#f5f5f5',
                  color: '#dc2626',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  border: '1px solid #d4d4d4'
                }}>
                  <strong>Rejection Reason:</strong> {material.rejectionReason}
                </div>
              )}

              <Link to={`/materials/${material.id}`} style={linkStyle}>
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMaterials;
