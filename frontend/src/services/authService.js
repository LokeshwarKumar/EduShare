import axios from 'axios';

/**
 * Base URL for all API endpoints
 */
const API_BASE_URL = '/api';

// ==================== AXIOS CONFIGURATION ====================

/**
 * Set up default authorization header if token exists
 * This runs on application load
 */
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Response interceptor to handle authentication errors
 * Automatically redirects to login on 401 responses
 */
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication Service
 * 
 * Provides methods for user authentication and authorization:
 * - User login and registration
 * - Token management
 * - Current user information
 * - Generic HTTP methods for admin operations
 * 
 * @author EduShare Team
 * @version 1.0.0
 */
const authService = {
  // ==================== AUTHENTICATION METHODS ====================
  
  /**
   * Authenticates user with credentials
   * @param {Object} credentials - { username, password }
   * @returns {Promise} Response with JWT token and user details
   */
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, credentials);
    
    // Store token and update axios headers
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response;
  },

  /**
   * Registers new user account
   * @param {Object} userData - User registration details
   * @returns {Promise} Response with registration status
   */
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response;
  },

  /**
   * Gets current authenticated user information
   * @returns {Promise} Response with user details and roles
   */
  getCurrentUser: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response;
  },

  // ==================== TOKEN MANAGEMENT ====================
  
  /**
   * Logs out user and clears authentication data
   */
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  /**
   * Retrieves stored JWT token
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Checks if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // ==================== GENERIC HTTP METHODS ====================
  
  /**
   * Makes authenticated GET request
   * @param {string} url - API endpoint URL
   * @returns {Promise} Response data
   */
  get: async (url) => {
    const response = await axios.get(url);
    return response;
  },

  /**
   * Makes authenticated POST request
   * @param {string} url - API endpoint URL
   * @param {Object} data - Request payload
   * @returns {Promise} Response data
   */
  post: async (url, data) => {
    const response = await axios.post(url, data);
    return response;
  },

  /**
   * Makes authenticated DELETE request
   * @param {string} url - API endpoint URL
   * @returns {Promise} Response data
   */
  delete: async (url) => {
    const response = await axios.delete(url);
    return response;
  }
};

export default authService;
