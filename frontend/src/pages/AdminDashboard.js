import React, { useState, useEffect } from 'react';
import materialService from '../services/materialService';
import authService from '../services/authService';

/**
 * Admin Dashboard Component
 * 
 * Provides administrative interface for managing the EduShare platform:
 * - Dashboard statistics overview
 * - Pending material approvals
 * - All materials management
 * - User management
 * - Material preview functionality
 * 
 * @author EduShare Team
 * @version 1.0.0
 */
const AdminDashboard = () => {
  // ==================== STATE MANAGEMENT ====================
  
  /** Dashboard statistics (users, materials, approvals) */
  const [stats, setStats] = useState({});
  
  /** List of materials pending approval */
  const [pendingMaterials, setPendingMaterials] = useState([]);
  
  /** List of all materials in the system */
  const [allMaterials, setAllMaterials] = useState([]);
  
  /** List of all registered users */
  const [users, setUsers] = useState([]);
  
  /** Currently active tab in the dashboard */
  const [activeTab, setActiveTab] = useState('dashboard');
  
  /** Loading state for async operations */
  const [loading, setLoading] = useState(true);
  
  /** Rejection reason for material rejection modal */
  const [rejectionReason, setRejectionReason] = useState('');
  
  /** Currently selected material for rejection */
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // ==================== LIFECYCLE HOOKS ====================
  
  /**
   * Fetch dashboard data on component mount
   */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==================== DATA FETCHING ====================
  
  /**
   * Fetches all dashboard data from API
   * - Dashboard statistics
   * - Pending materials
   * - All materials
   * - User list
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await authService.get('/api/admin/dashboard');
      setStats(statsResponse.data);

      // Fetch materials pending approval
      const pendingResponse = await materialService.getPendingMaterials();
      setPendingMaterials(pendingResponse.data);

      // Fetch all materials
      const allResponse = await materialService.getAllMaterials();
      setAllMaterials(allResponse.data);

      // Fetch all users
      const usersResponse = await authService.get('/api/admin/users');
      setUsers(usersResponse.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== MATERIAL MANAGEMENT ====================
  
  /**
   * Approves a material and refreshes dashboard data
   * @param {number} materialId - ID of material to approve
   */
  const handleApprove = async (materialId) => {
    try {
      await materialService.approveMaterial(materialId);
      fetchDashboardData(); // Refresh all data
    } catch (error) {
      console.error('Error approving material:', error);
    }
  };

  /**
   * Rejects a material with provided reason and refreshes dashboard
   * @param {number} materialId - ID of material to reject
   */
  const handleReject = async (materialId) => {
    // Validate rejection reason is provided
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await materialService.rejectMaterial(materialId, rejectionReason);
      // Reset rejection form
      setRejectionReason('');
      setSelectedMaterial(null);
      fetchDashboardData(); // Refresh all data
    } catch (error) {
      console.error('Error rejecting material:', error);
    }
  };

  /**
   * Deletes a material after confirmation and refreshes dashboard
   * @param {number} materialId - ID of material to delete
   */
  const handleDeleteMaterial = async (materialId) => {
    // Confirm deletion with user
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.deleteMaterial(materialId);
        fetchDashboardData(); // Refresh all data
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  // ==================== USER MANAGEMENT ====================
  
  /**
   * Deletes a user after confirmation and refreshes dashboard
   * @param {number} userId - ID of user to delete
   */
  const handleDeleteUser = async (userId) => {
    // Confirm deletion with user
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authService.delete(`/api/admin/users/${userId}`);
        fetchDashboardData(); // Refresh all data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // ==================== FILE PREVIEW ====================
  
  /**
   * Opens material file in new window for admin preview
   * Handles authentication and file loading
   * @param {number} materialId - ID of material to preview
   */
  const handleViewMaterial = async (materialId) => {
    try {
      const token = authService.getToken();
      const viewUrl = `/api/admin/materials/${materialId}/view`;
      
      // Fetch material view information
      const response = await fetch(viewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Open Cloudinary URL directly in new window
        if (data.viewUrl) {
          const newWindow = window.open(data.viewUrl, '_blank');
          if (!newWindow) {
            alert('Please allow popups to view the file');
          }
        } else {
          alert('No file URL available for this material');
        }
      } else {
        alert('Failed to load file for preview');
      }
    } catch (error) {
      console.error('Error viewing material:', error);
      alert('Error loading file for preview');
    }
  };

  // ==================== UTILITY FUNCTIONS ====================
  
  /**
   * Formats file size in bytes to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size (e.g., "1.5 MB")
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Formats date string to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "Jan 3, 2026")
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#333333',
    marginBottom: '1rem'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #d4d4d4'
  };

  const tabStyle = (isActive) => ({
    padding: '1rem 1.5rem',
    backgroundColor: isActive ? '#d4d4d4' : 'transparent',
    color: isActive ? '#333333' : '#666666',
    border: isActive ? '1px solid #d4d4d4' : '1px solid #d4d4d4',
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    fontSize: '1rem'
  });

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #d4d4d4',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '0.5rem'
  };

  const statLabelStyle = {
    color: '#666666',
    fontSize: '1rem'
  };

  const tableStyle = {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #d4d4d4'
  };

  const tableHeaderStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333333',
    borderBottom: '1px solid #d4d4d4'
  };

  const tableCellStyle = {
    padding: '1rem',
    borderBottom: '1px solid #d4d4d4'
  };

  const buttonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    border: '1px solid #d4d4d4',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const dangerButtonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    border: '1px solid #d4d4d4',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const warningButtonStyle = {
    backgroundColor: '#d4d4d4',
    color: '#333333',
    border: '1px solid #d4d4d4',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginRight: '0.5rem'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#666666'
  };

  const modalStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '500px',
    width: '90%'
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d4d4d4',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
    marginBottom: '1rem',
    backgroundColor: 'white'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading admin dashboard...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
      </div>

      <div style={tabsStyle}>
        <button
          style={tabStyle(activeTab === 'dashboard')}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          style={tabStyle(activeTab === 'pending')}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approvals ({pendingMaterials.length})
        </button>
        <button
          style={tabStyle(activeTab === 'materials')}
          onClick={() => setActiveTab('materials')}
        >
          All Materials
        </button>
        <button
          style={tabStyle(activeTab === 'users')}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <div style={statsGridStyle}>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{stats.totalUsers}</div>
              <div style={statLabelStyle}>Total Users</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{stats.totalMaterials}</div>
              <div style={statLabelStyle}>Total Materials</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{stats.pendingApprovals}</div>
              <div style={statLabelStyle}>Pending Approvals</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{stats.approvedMaterials}</div>
              <div style={statLabelStyle}>Approved Materials</div>
            </div>
            <div style={statCardStyle}>
              <div style={statNumberStyle}>{stats.rejectedMaterials}</div>
              <div style={statLabelStyle}>Rejected Materials</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>Pending Approvals</h2>
          {pendingMaterials.length === 0 ? (
            <p>No pending materials to review.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Title</th>
                  <th style={tableHeaderStyle}>Subject</th>
                  <th style={tableHeaderStyle}>File Type</th>
                  <th style={tableHeaderStyle}>Uploaded By</th>
                  <th style={tableHeaderStyle}>Upload Date</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingMaterials.map(material => (
                  <tr key={material.id}>
                    <td style={tableCellStyle}>{material.title}</td>
                    <td style={tableCellStyle}>{material.subjectName}</td>
                    <td style={tableCellStyle}>
                      <span style={{ 
                        backgroundColor: '#f0f0f0', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase'
                      }}>
                        {material.fileType || 'Unknown'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      {material.uploadedByFirstName} {material.uploadedByLastName}
                    </td>
                    <td style={tableCellStyle}>{formatDate(material.uploadDate)}</td>
                    <td style={tableCellStyle}>
                      <button
                        style={{ ...buttonStyle, backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        onClick={() => handleViewMaterial(material.id)}
                      >
                        View
                      </button>
                      <button
                        style={buttonStyle}
                        onClick={() => handleApprove(material.id)}
                      >
                        Approve
                      </button>
                      <button
                        style={warningButtonStyle}
                        onClick={() => setSelectedMaterial(material)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'materials' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>All Materials</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Title</th>
                <th style={tableHeaderStyle}>Subject</th>
                <th style={tableHeaderStyle}>File Type</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Uploaded By</th>
                <th style={tableHeaderStyle}>Upload Date</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allMaterials.map(material => (
                <tr key={material.id}>
                  <td style={tableCellStyle}>{material.title}</td>
                  <td style={tableCellStyle}>{material.subjectName}</td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f0f0f0', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase'
                    }}>
                      {material.fileType || 'Unknown'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      backgroundColor: material.approvalStatus === 'APPROVED' ? '#e8f5e8' : 
                                       material.approvalStatus === 'REJECTED' ? '#ffe8e8' : '#fff3cd',
                      color: material.approvalStatus === 'APPROVED' ? '#2e7d32' : 
                             material.approvalStatus === 'REJECTED' ? '#c62828' : '#f57c00',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {material.approvalStatus}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {material.uploadedByFirstName} {material.uploadedByLastName}
                  </td>
                  <td style={tableCellStyle}>{formatDate(material.uploadDate)}</td>
                  <td style={tableCellStyle}>
                    <button
                      style={{ ...buttonStyle, backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      onClick={() => handleViewMaterial(material.id)}
                    >
                      View
                    </button>
                    <button
                      style={dangerButtonStyle}
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 style={{ marginBottom: '1rem' }}>All Users</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Username</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Department</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={tableCellStyle}>{user.username}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={tableCellStyle}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={tableCellStyle}>{user.department || 'N/A'}</td>
                  <td style={tableCellStyle}>
                    <button
                      style={dangerButtonStyle}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedMaterial && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Reject Material</h3>
            <p><strong>Material:</strong> {selectedMaterial.title}</p>
            <textarea
              style={textareaStyle}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div>
              <button
                style={dangerButtonStyle}
                onClick={() => handleReject(selectedMaterial.id)}
              >
                Reject
              </button>
              <button
                style={{ ...buttonStyle, backgroundColor: '#d4d4d4' }}
                onClick={() => {
                  setSelectedMaterial(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
