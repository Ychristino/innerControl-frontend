// services/authService.js
import api from './api'; // seu axios configurado

const authService = {
  login: async (credenciais) => {
    const response = await api.post('/auth', credenciais);
    const token = response.data.token;
    localStorage.setItem('authToken', token);
    return token;
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  logout: () => {
    localStorage.removeItem('authToken');
  }
};

export default authService;
