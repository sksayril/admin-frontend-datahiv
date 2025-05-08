import axios from 'axios';

const BASE_URL = 'https://api.datahive.co.in/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is due to authentication (401)
    if (error.response && error.response.status === 401) {
      // Clear the local storage tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const response = await api.get('/admin/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCategory = async (categoryData: { name: string; description: string }) => {
  try {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Leads API
export const getLeads = async () => {
  try {
    const response = await api.get('/admin/leads');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Dashboard API
export const getDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addLead = async (leadData: {
  customerName: string;
  customerAddress: string;
  customerContact: string;
  customerEmail: string;
  website: string;
  category: string;
}) => {
  try {
    const response = await api.post('/admin/leads', leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadLeadsCSV = async (file: File, categoryId: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', categoryId);

    const response = await axios.post(`${BASE_URL}/admin/leads/upload-csv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;