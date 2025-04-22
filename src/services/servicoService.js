import api from './api';

const endpoint = '/servicos';

const servicoService = {
  getAll: (nome = "", dataEntrada = "", dataEntrega = "", page = 0, size = 10) => {
    const params = {
      page,
      size,
    };
  
    if (nome) params.nome = nome;
    if (dataEntrada) params.dataEntrada = dataEntrada;
    if (dataEntrega) params.dataEntrega = dataEntrega;
  
    return api.get(endpoint, { params });
  },

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),
};

export default servicoService;
