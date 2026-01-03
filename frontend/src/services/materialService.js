import axios from 'axios';

const API_BASE_URL = '/api';

const materialService = {
  // Get all approved materials with optional filters
  getApprovedMaterials: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.subjectId) params.append('subjectId', filters.subjectId);
    if (filters.department) params.append('department', filters.department);
    if (filters.semester) params.append('semester', filters.semester);
    
    const response = await axios.get(`${API_BASE_URL}/materials/public?${params}`);
    return response;
  },

  // Get current user's materials
  getMyMaterials: async () => {
    const response = await axios.get(`${API_BASE_URL}/materials/my`);
    return response;
  },

  // Get material by ID
  getMaterialById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/materials/${id}`);
    return response;
  },

  // Upload material
  uploadMaterial: async (materialData, file) => {
    const formData = new FormData();
    
    // Add material data as JSON string
    formData.append('material', new Blob([JSON.stringify(materialData)], {
      type: 'application/json'
    }));
    
    // Add file
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/materials/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  },

  // Download material
  downloadMaterial: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/materials/download/${id}`, {
      responseType: 'blob'
    });
    return response;
  },

  // Admin: Get pending materials
  getPendingMaterials: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/materials/pending`);
    return response;
  },

  // Admin: Get all materials
  getAllMaterials: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/materials/all`);
    return response;
  },

  // Admin: Approve material
  approveMaterial: async (id) => {
    const response = await axios.post(`${API_BASE_URL}/admin/materials/${id}/approve`);
    return response;
  },

  // Admin: Reject material
  rejectMaterial: async (id, reason) => {
    const response = await axios.post(`${API_BASE_URL}/admin/materials/${id}/reject`, {
      reason
    });
    return response;
  },

  // Admin: Delete material
  deleteMaterial: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/materials/${id}`);
    return response;
  }
};

export default materialService;
