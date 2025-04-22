import api from './api';

const endpoint = '/paises';

const paisService = {
  
  getAll: (page = 0, size = 50) =>
    api.get(endpoint, {
      params: { page, size },
  }),

  getAllNoPaginated: () => api.get(`${endpoint}/nopaginated`),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),
};

export default paisService;
