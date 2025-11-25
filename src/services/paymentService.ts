import api from './api';
import type { CreatePaymentIntentRequest, CreatePaymentIntentResponse, Payment } from '../types';

export const createPaymentIntent = async (data: CreatePaymentIntentRequest) => {
  const response = await api.post<CreatePaymentIntentResponse>('/payments/create-intent', data);
  return response.data;
};

export const confirmPayment = async (paymentIntentId: string) => {
  const response = await api.post('/payments/confirm', { payment_intent_id: paymentIntentId });
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get<Payment[]>('/payments/history');
  return response.data;
};
