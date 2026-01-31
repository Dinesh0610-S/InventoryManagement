import api from './api';

export const inventoryService = {
  getLogs: async (params = {}) => {
    const response = await api.get('/inventory/logs', { params });
    return response.data;
  },

  getReport: async (period = 'month') => {
    const response = await api.get('/inventory/report', { params: { period } });
    return response.data;
  },
};
