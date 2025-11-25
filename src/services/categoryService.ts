import api from './api';
import type { Category } from '../types';

export const getAllCategories = async () => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getCategoryById = async (categoryId: number) => {
  const response = await api.get<Category>(`/categories/${categoryId}`);
  return response.data;
};
