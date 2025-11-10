import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Credit Types API
export const creditTypesAPI = {
  getAll: () => api.get('/creditTypes'),
  getById: (id) => api.get(`/creditTypes/${id}`)
};

// Employment Types API
export const employmentTypesAPI = {
  getAll: () => api.get('/employmentTypes')
};

// Jobs API
export const jobsAPI = {
  getAll: () => api.get('/jobs')
};

// Simulations API
export const simulationsAPI = {
  create: (data) => api.post('/simulations', data),
  getAll: () => api.get('/simulations'),
  getById: (id) => api.get(`/simulations/${id}`)
};

// Applications API
export const applicationsAPI = {
  create: (data) => api.post('/applications', data),
  getAll: (params = {}) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  update: (id, data) => api.patch(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`)
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsSeen: (id) => api.patch(`/notifications/${id}`, { seen: true }),
  markAllAsSeen: async () => {
    try {
      const { data } = await api.get('/notifications?seen=false');
      return Promise.all(
        data.map(notif => api.patch(`/notifications/${notif.id}`, { seen: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  login: async (email, password) => {
    const { data } = await api.get('/admins');
    const admin = data.find(a => a.email === email && a.password === password);
    if (!admin) {
      throw new Error('Identifiants invalides');
    }
    // Mock JWT token
    const token = btoa(`${admin.id}:${Date.now()}`);
    localStorage.setItem('adminToken', token);
    return { token, admin };
  },
  logout: () => {
    localStorage.removeItem('adminToken');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  }
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings')
};

export default api;