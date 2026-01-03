import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import materialService from '../services/materialService';

const MaterialDetails = () => {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const response = await materialService.getMaterialById(id);
      setMaterial(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Material not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await materialService.downloadMaterial(id);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download file');
    } finally {
      setDownloading(false);
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const headerStyle = {
    backgroundColor: '#f5f5f5',
    padding: '2rem',
    borderBottom: '1px solid #d4d4d4'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333333',
    marginBottom: '1rem',
    fontWeight: 'bold'
  };

  const metaStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem'
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '0.25rem',
    fontSize: '0.9rem'
  };

  const statusStyle = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.8rem'
  };

  const bodyStyle = {
    padding: '2rem'
  };

  const sectionStyle = {
    marginBottom: '2rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '1rem'
  };

  const descriptionStyle = {
    lineHeight: '1.6',
    color: '#666666'
  };

  const buttonStyle = {
    backgroundColor: '#999999',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: downloading ? 'not-allowed' : 'pointer',
    marginRight: '1rem',
    opacity: downloading ? 0.7 : 1
  };

  const secondaryButtonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const errorStyle = {
    backgroundColor: '#f5f5f5',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '0.25rem',
    marginBottom: '1rem',
    border: '1px solid #d4d4d4'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#666666'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading material details...</div>;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          {error}
        </div>
        <Link to="/materials" style={secondaryButtonStyle}>
          ← Back to Materials
        </Link>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{material.title}</h1>
          
          <div style={metaStyle}>
            <div style={metaItemStyle}>
              <strong>Subject:</strong> {material.subjectName}
            </div>
            {material.department && (
              <div style={metaItemStyle}>
                <strong>Department:</strong> {material.department}
              </div>
            )}
            {material.semester && (
              <div style={metaItemStyle}>
                <strong>Semester:</strong> {material.semester}
              </div>
            )}
            <div style={metaItemStyle}>
              <strong>Downloads:</strong> {material.downloadCount}
            </div>
          </div>

          <div style={{ 
            ...statusStyle,
            backgroundColor: getStatusColor(material.approvalStatus)
          }}>
            {material.approvalStatus}
          </div>
        </div>

        <div style={bodyStyle}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Description</h2>
            <p style={descriptionStyle}>
              {material.description || 'No description provided.'}
            </p>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>File Information</h2>
            <div style={metaStyle}>
              <div style={metaItemStyle}>
                <strong>File Name:</strong> {material.fileName}
              </div>
              <div style={metaItemStyle}>
                <strong>File Type:</strong> {material.fileType?.toUpperCase()}
              </div>
              <div style={metaItemStyle}>
                <strong>File Size:</strong> {formatFileSize(material.fileSize)}
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Upload Information</h2>
            <div style={metaStyle}>
              <div style={metaItemStyle}>
                <strong>Uploaded by:</strong> {material.uploadedByFirstName} {material.uploadedByLastName}
              </div>
              <div style={metaItemStyle}>
                <strong>Username:</strong> {material.uploadedByUsername}
              </div>
              <div style={metaItemStyle}>
                <strong>Upload Date:</strong> {formatDate(material.uploadDate)}
              </div>
              {material.approvalDate && (
                <div style={metaItemStyle}>
                  <strong>Approval Date:</strong> {formatDate(material.approvalDate)}
                </div>
              )}
            </div>
          </div>

          {material.rejectionReason && (
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Rejection Reason</h2>
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#dc2626', 
                padding: '1rem', 
                borderRadius: '0.25rem',
                border: '1px solid #d4d4d4'
              }}>
                {material.rejectionReason}
              </div>
            </div>
          )}

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Actions</h2>
            {material.approvalStatus === 'APPROVED' ? (
              <button 
                onClick={handleDownload} 
                style={buttonStyle} 
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download File'}
              </button>
            ) : (
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#dc2626', 
                padding: '1rem', 
                borderRadius: '0.25rem',
                border: '1px solid #d4d4d4'
              }}>
                This material is {material.approvalStatus.toLowerCase()} and cannot be downloaded.
              </div>
            )}
            
            <Link to="/materials" style={secondaryButtonStyle}>
              ← Back to Materials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
