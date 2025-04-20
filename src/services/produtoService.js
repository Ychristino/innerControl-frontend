import api from './api';

const endpoint = '/produtos';

const produtoService = {
  getAll: () => api.get(endpoint),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),
};

export default produtoService;
