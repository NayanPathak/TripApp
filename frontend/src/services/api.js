import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 for Android emulator to reach host machine's localhost
const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  createUser: (email, password, name) =>
    api.post('/users', { email, password, name }),
  getAllUsers: () => api.get('/users'),
};

export const packageAPI = {
  create: (data) => api.post('/packages', data),
  uploadImages: (formData) =>
    api.post('/packages/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/packages'),
  getById: (id) => api.get(`/packages/${id}`),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

export const assignmentAPI = {
  assign: (userId, packageId) =>
    api.post('/assignments', { userId, packageId }),
  getByPackage: (packageId) =>
    api.get(`/assignments/package/${packageId}`),
  getMyPackages: () => api.get('/assignments/my-packages'),
};

export default api;
