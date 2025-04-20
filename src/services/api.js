// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // ajuste conforme necessário
});

// Intercepta cada requisição e injeta o token, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
