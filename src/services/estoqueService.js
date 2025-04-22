import api from './api';

const endpoint = '/estoque';

const estoqueService = {
  getAll: (nome = "", page = 0, size = 10) => api.get(endpoint, {
    params:{
      nome: nome,
      page: page,
      size: size,
    }
  }),

  compraProduto: (id, data) => api.put(`${endpoint}/comprar/${id}`, data),

  venderProduto: (id, data) => api.put(`${endpoint}/vender/${id}`, data),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),
};

export default estoqueService;
