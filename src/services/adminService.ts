import api from './api';
import type { AdminStats, PendingVerification, User, PaginatedResponse } from '../types';

export const getAdminStats = async () => {
  const response = await api.get<AdminStats>('/admin/stats');
  return response.data;
};

export const getPendingVerifications = async () => {
  const response = await api.get<PendingVerification[]>('/admin/verifications/pending');
  return response.data;
};

export const approveVerification = async (userId: number) => {
  await api.post(`/admin/verifications/${userId}/approve`);
};

export const rejectVerification = async (userId: number, reason: string) => {
  await api.post(`/admin/verifications/${userId}/reject`, { reason });
};

export const getAllUsers = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedResponse<User>>('/admin/users', {
    params: { page, limit },
  });
  return response.data;
};

export const banUser = async (userId: number, reason: string) => {
  await api.post(`/admin/users/${userId}/ban`, { reason });
};

export const unbanUser = async (userId: number) => {
  await api.post(`/admin/users/${userId}/unban`);
};
