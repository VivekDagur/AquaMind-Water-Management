import axios from 'axios';

// Create axios instance with base configuration
// src/utils/api.ts (replace baseURL line)
export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://127.0.0.1:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const tankAPI = {
  getAllTanks: () => apiClient.get('/tanks'),
  getTank: (id: string) => apiClient.get(`/tanks/${id}`),
  updateTank: (id: string, data: Record<string, unknown>) =>
    apiClient.put(`/tanks/${id}`, data),
  refillTank: (id: string) => apiClient.post(`/tanks/${id}/refill`),
};

export const alertAPI = {
  getAllAlerts: () => apiClient.get('/alerts'),
  markAsResolved: (id: string) =>
    apiClient.patch(`/alerts/${id}`, { resolved: true }),
  createAlert: (data: Record<string, unknown>) =>
    apiClient.post('/alerts', data),
};

export const reportsAPI = {
  getConsumptionReport: (params: Record<string, string | number>) =>
    apiClient.get('/reports/consumption', { params }),
  exportCSV: (params: Record<string, string | number>) =>
    apiClient.get('/reports/export', { params }),
};

// AI API endpoints
// replace existing chatQuery with:
export const aiAPI = {
  getForecast: (tankId: string) => apiClient.get(`/ai/forecast/${tankId}`),
  getAnomalies: () => apiClient.get('/ai/anomalies'),
  getRecommendations: () => apiClient.get('/ai/recommendations'),
  chatQuery: (query: string, conversationId?: string|null, context?: Record<string, unknown>) =>
    apiClient.post('/ai/chat', { query, conversationId, context }),
  getConversation: (id: string) => apiClient.get(`/ai/conversations/${id}`),
};

