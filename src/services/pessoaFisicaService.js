import api from './api';

const endpoint = '/pessoas';

const pessoaService = {
  getAll: (nome = "", page = 0, size = 10) => api.get(endpoint, {
    params:{
      nome: nome,
      page: page,
      size: size,
    }
  }),

  getAllNoPaginated: () => api.get(`${endpoint}/nopaginated`),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),

};

export default pessoaService;
