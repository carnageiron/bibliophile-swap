
import axios from 'axios';

// The backend URL - use the absolute URL in development to ensure correct connection
const API_URL = 'http://localhost:3001/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Added timeout to prevent hanging requests
  timeout: 10000
});

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  console.log('Registering user:', userData.email);
  try {
    const response = await api.post('/auth/register', userData);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data?.message || error.message || 'Failed to connect to server');
    throw error;
  }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  console.log('Logging in user:', credentials.email);
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data?.message || error.message || 'Failed to connect to server');
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Book API calls
export const getBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export default api;
