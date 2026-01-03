import axios from 'axios';

const API_BASE_URL = '/api';

// Set up axios defaults
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response;
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Generic HTTP methods for admin operations
  get: async (url) => {
    const response = await axios.get(url);
    return response;
  },

  post: async (url, data) => {
    const response = await axios.post(url, data);
    return response;
  },

  delete: async (url) => {
    const response = await axios.delete(url);
    return response;
  }
};

export default authService;
