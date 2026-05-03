import axios from 'axios';

// In production, always use same-origin API path on Vercel.
const baseURL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// Attach JWT for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hsh_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hsh_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
