import api from './api';
import type { Message, Conversation, SendMessageRequest, PaginatedResponse } from '../types';

export const getConversations = async () => {
  const response = await api.get<Conversation[]>('/messages/conversations');
  return response.data;
};

export const getMessages = async (otherUserId: number, page = 1, limit = 50) => {
  const response = await api.get<PaginatedResponse<Message>>(`/messages/${otherUserId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const sendMessage = async (data: SendMessageRequest) => {
  const response = await api.post<Message>('/messages', data);
  return response.data;
};

export const markAsRead = async (messageId: number) => {
  await api.patch(`/messages/${messageId}/read`);
};
