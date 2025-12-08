import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthRequest } from '../types';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data);
  return response.data;
};

export const googleAuth = async (request: GoogleAuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', request);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh');
  return response.data;
};

export const verifyEmail = async (token: string): Promise<void> => {
  await api.get(`/auth/verify-email?token=${token}`);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await api.post('/auth/reset-password', { token, new_password: newPassword });
};
