import api from './api';
import type { BlockedUser, PaginatedResponse } from '../types';

export const getBlockedUsers = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedResponse<BlockedUser>>('/blocks', {
    params: { page, limit },
  });
  return response.data;
};

export const blockUser = async (userId: number, reason?: string) => {
  const response = await api.post('/blocks', { blocked_id: userId, reason });
  return response.data;
};

export const unblockUser = async (userId: number) => {
  await api.delete(`/blocks/${userId}`);
};
