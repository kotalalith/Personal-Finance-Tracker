import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://personal-finance-tracker-8ezy.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth API
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password }); // now valid ✅

// ✅ Transaction API
export const getTransactions = (filters = {}) =>
  api.get('/transactions', { params: filters });
export const getTransaction = (id) => api.get(`/transactions/${id}`);
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

// ✅ Budget API
export const getBudgets = (filters = {}) => api.get('/budgets', { params: filters });
export const createBudget = (data) => api.post('/budgets', data);
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// ✅ Report API
export const getMonthlyReport = (month, year) =>
  api.get('/reports/monthly', { params: { month, year } });
export const exportCSV = (startDate, endDate) =>
  api.get('/reports/export/csv', { params: { startDate, endDate } });
export const exportPDF = (month, year) =>
  api.get('/reports/export/pdf', { params: { month, year } });

// ✅ Insight API
export const getInsights = (month, year) =>
  api.get('/insights', { params: { month, year } });

export default api;
