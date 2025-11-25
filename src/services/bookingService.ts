import api from './api';
import type { Booking, CreateBookingRequest, PaginatedResponse } from '../types';

export const getMyBookings = async (role: 'client' | 'provider', page = 1, limit = 20) => {
  const response = await api.get<PaginatedResponse<Booking>>(`/bookings/my-bookings`, {
    params: { role, page, limit },
  });
  return response.data;
};

export const getBookingById = async (bookingId: number) => {
  const response = await api.get<Booking>(`/bookings/${bookingId}`);
  return response.data;
};

export const createBooking = async (data: CreateBookingRequest) => {
  const response = await api.post<Booking>('/bookings', data);
  return response.data;
};

export const updateBookingStatus = async (bookingId: number, status: string) => {
  const response = await api.patch<Booking>(`/bookings/${bookingId}/status`, { status });
  return response.data;
};

export const cancelBooking = async (bookingId: number, reason?: string) => {
  const response = await api.post(`/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};
