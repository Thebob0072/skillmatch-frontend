import api from './api';
import type { Review, CreateReviewRequest, PaginatedResponse } from '../types';

export const getProviderReviews = async (providerId: number, page = 1, limit = 10) => {
  const response = await api.get<PaginatedResponse<Review>>(`/reviews/provider/${providerId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const createReview = async (data: CreateReviewRequest) => {
  const response = await api.post<Review>('/reviews', data);
  return response.data;
};

export const getMyReviews = async (role: 'reviewer' | 'reviewee') => {
  const response = await api.get<Review[]>(`/reviews/my-reviews`, {
    params: { role },
  });
  return response.data;
};
