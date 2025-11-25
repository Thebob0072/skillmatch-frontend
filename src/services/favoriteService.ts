import api from './api';
import type { Favorite, PaginatedResponse } from '../types';

export const getFavorites = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedResponse<Favorite>>('/favorites', {
    params: { page, limit },
  });
  return response.data;
};

export const addFavorite = async (providerId: number) => {
  const response = await api.post('/favorites', { provider_id: providerId });
  return response.data;
};

export const removeFavorite = async (providerId: number) => {
  await api.delete(`/favorites/${providerId}`);
};
