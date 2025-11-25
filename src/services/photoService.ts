import api from './api';
import type { Photo } from '../types';

export const getMyPhotos = async () => {
  const response = await api.get<Photo[]>('/photos/my-photos');
  return response.data;
};

export const getUserPhotos = async (userId: number) => {
  const response = await api.get<Photo[]>(`/photos/user/${userId}`);
  return response.data;
};

export const uploadPhoto = async (file: File, caption?: string) => {
  const formData = new FormData();
  formData.append('photo', file);
  if (caption) formData.append('caption', caption);
  
  const response = await api.post<Photo>('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updatePhotoOrder = async (photoId: number, displayOrder: number) => {
  await api.patch(`/photos/${photoId}/order`, { display_order: displayOrder });
};

export const setProfilePicture = async (photoId: number) => {
  await api.post(`/photos/${photoId}/set-profile-picture`);
};

export const deletePhoto = async (photoId: number) => {
  await api.delete(`/photos/${photoId}`);
};
