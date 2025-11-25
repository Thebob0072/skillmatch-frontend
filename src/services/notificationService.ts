import api from './api';
import type { Notification, PaginatedResponse } from '../types';

export const getNotifications = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedResponse<Notification>>('/notifications', {
    params: { page, limit },
  });
  return response.data;
};

export const markAsRead = async (notificationId: number) => {
  await api.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async () => {
  await api.post('/notifications/mark-all-read');
};

export const deleteNotification = async (notificationId: number) => {
  await api.delete(`/notifications/${notificationId}`);
};
