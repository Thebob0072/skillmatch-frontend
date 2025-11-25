import api from './api';
import type { Package } from '../types';

export const getProviderPackages = async (providerId: number) => {
  const response = await api.get<Package[]>(`/packages/provider/${providerId}`);
  return response.data;
};

export const getMyPackages = async () => {
  const response = await api.get<Package[]>('/packages/my-packages');
  return response.data;
};

export const createPackage = async (data: Omit<Package, 'package_id' | 'provider_id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post<Package>('/packages', data);
  return response.data;
};

export const updatePackage = async (packageId: number, data: Partial<Package>) => {
  const response = await api.put<Package>(`/packages/${packageId}`, data);
  return response.data;
};

export const deletePackage = async (packageId: number) => {
  await api.delete(`/packages/${packageId}`);
};
