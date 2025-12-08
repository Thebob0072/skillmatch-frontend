import api from './api';
import type { Provider, SearchParams, PaginatedResponse } from '../types';

export const searchProviders = async (params: SearchParams) => {
  const response = await api.get<PaginatedResponse<Provider>>('/browse/search', { params });
  return response.data;
};

export const getProviderProfile = async (userId: number) => {
  const response = await api.get<Provider>(`/browse/providers/${userId}`);
  return response.data;
};
