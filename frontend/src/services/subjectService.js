import axios from 'axios';

const API_BASE_URL = '/api';

const subjectService = {
  // Get all subjects
  getAllSubjects: async () => {
    const response = await axios.get(`${API_BASE_URL}/subjects`);
    return response;
  },

  // Get all departments
  getAllDepartments: async () => {
    const response = await axios.get(`${API_BASE_URL}/subjects/departments`);
    return response;
  },

  // Get subjects by department
  getSubjectsByDepartment: async (department) => {
    const response = await axios.get(`${API_BASE_URL}/subjects/department/${department}`);
    return response;
  },

  // Create new subject (admin only)
  createSubject: async (subjectData) => {
    const response = await axios.post(`${API_BASE_URL}/subjects`, subjectData);
    return response;
  }
};

export default subjectService;
