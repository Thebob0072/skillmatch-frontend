import api from './api';
import type { ProviderAnalytics, BookingStatistics } from '../types';

export const getProviderAnalytics = async () => {
  const response = await api.get<ProviderAnalytics>('/analytics/provider');
  return response.data;
};

export const getBookingStatistics = async (startDate: string, endDate: string) => {
  const response = await api.get<BookingStatistics[]>('/analytics/bookings', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};
