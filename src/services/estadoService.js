import api from './api';

const endpoint = '/estados';

const estadoService = {
  getAll: () => api.get(endpoint),

  getAllFromSpecificCountry: (countryId) => api.get(`${endpoint}/from/${countryId}`),

  getAllFromSpecificCountryNoPaginated: (countryId) => api.get(`${endpoint}/from/${countryId}/nopaginated`),

  getById: (id) => api.get(`${endpoint}/${id}`),

  create: (data) => api.post(endpoint, data),

  update: (id, data) => api.put(`${endpoint}/${id}`, data),

  remove: (id) => api.delete(`${endpoint}/${id}`),
};

export default estadoService;
