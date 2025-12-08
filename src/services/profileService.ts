import api from './api';
import type { User, ProfileUpdateRequest, PasswordChangeRequest } from '../types';

export const getProfile = async () => {
  const response = await api.get<User>('/profile');
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/profile/me');
  return response.data;
};

export const updateProfile = async (data: ProfileUpdateRequest) => {
  const response = await api.put<User>('/profile', data);
  return response.data;
};

export const changePassword = async (data: PasswordChangeRequest) => {
  await api.post('/profile/change-password', data);
};

export const deleteAccount = async () => {
  await api.delete('/profile');
};
