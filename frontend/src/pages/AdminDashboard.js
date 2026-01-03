import React, { useState, useEffect } from 'react';
import materialService from '../services/materialService';
import authService from '../services/authService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await authService.get('/api/admin/dashboard');
      setStats(statsResponse.data);

      // Fetch pending materials
      const pendingResponse = await materialService.getPendingMaterials();
      setPendingMaterials(pendingResponse.data);

      // Fetch all materials
      const allResponse = await materialService.getAllMaterials();
      setAllMaterials(allResponse.data);

      // Fetch users
      const usersResponse = await authService.get('/api/admin/users');
      setUsers(usersResponse.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (materialId) => {
    try {
      await materialService.approveMaterial(materialId);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving material:', error);
    }
  };

  const handleReject = async (materialId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await materialService.rejectMaterial(materialId, rejectionReason);
      setRejectionReason('');
      setSelectedMaterial(null);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting material:', error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await materialService.deleteMaterial(materialId);
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authService.delete(`/api/admin/users/${userId}`);
        fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
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
                      {material.uploadedByFirstName} {material.uploadedByLastName}
                    </td>
                    <td style={tableCellStyle}>{formatDate(material.uploadDate)}</td>
                    <td style={tableCellStyle}>
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
                  <td style={tableCellStyle}>{material.approvalStatus}</td>
                  <td style={tableCellStyle}>
                    {material.uploadedByFirstName} {material.uploadedByLastName}
                  </td>
                  <td style={tableCellStyle}>{formatDate(material.uploadDate)}</td>
                  <td style={tableCellStyle}>
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
