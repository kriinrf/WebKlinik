import axios from 'axios';

// Base URL for PHP backend API
// Sesuaikan dengan URL XAMPP/WAMP Anda
const API_BASE = 'http://localhost/WebKlinik/backend/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================
// Patients API
// =============================================
export const patientsApi = {
  getAll: (search = '') =>
    api.get(`/patients.php${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getById: (id) =>
    api.get(`/patients.php?id=${id}`),

  create: (data) =>
    api.post('/patients.php', data),

  update: (id, data) =>
    api.put(`/patients.php?id=${id}`, data),

  delete: (id) =>
    api.delete(`/patients.php?id=${id}`),
};

// =============================================
// Visits API
// =============================================
export const visitsApi = {
  getAll: (search = '') =>
    api.get(`/visits.php${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getById: (id) =>
    api.get(`/visits.php?id=${id}`),

  create: (data) =>
    api.post('/visits.php', data),

  update: (id, data) =>
    api.put(`/visits.php?id=${id}`, data),

  delete: (id) =>
    api.delete(`/visits.php?id=${id}`),
};

// =============================================
// Dashboard API
// =============================================
export const dashboardApi = {
  getSummary: (groupBy = 'month', year = new Date().getFullYear()) =>
    api.get(`/dashboard.php?group_by=${groupBy}&year=${year}`),
};

export default api;
