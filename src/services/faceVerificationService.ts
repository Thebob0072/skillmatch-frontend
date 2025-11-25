import api from './api';
import type { FaceVerificationRequest } from '../types';

export const submitFaceVerification = async (data: FaceVerificationRequest) => {
  const response = await api.post('/verification/face', data);
  return response.data;
};

export const getVerificationStatus = async () => {
  const response = await api.get('/verification/status');
  return response.data;
};
