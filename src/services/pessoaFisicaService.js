import api from './api';

const endpoint = '/pessoas';

const pessoaService = {
  getAll: () => api.get(endpoint),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),

  getPaginated: (page = 1, size = 10) =>
    api.get(`${endpoint}`, {
      params: {
        page,
        size,
      },
    }),
};

export default pessoaService;
