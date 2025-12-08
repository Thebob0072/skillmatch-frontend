import api from './api';

// ================================
// Types
// ================================

export interface TrustedContact {
  contact_id: number;
  user_id: number;
  name: string;
  phone_number: string;
  relationship: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_notified?: string;
}

export interface SOSAlert {
  alert_id: number;
  user_id: number;
  username: string;
  phone?: string;
  booking_id?: number;
  latitude: number;
  longitude: number;
  location_text?: string;
  status: 'active' | 'resolved' | 'cancelled';
  created_at: string;
}

export interface CheckIn {
  check_in_id: number;
  booking_id: number;
  provider_id: number;
  provider_name: string;
  client_id: number;
  client_name: string;
  checked_in_at: string;
  expected_end_time: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'completed' | 'overdue' | 'emergency';
  is_overdue: boolean;
}

export interface PrivateGallerySettings {
  setting_id?: number;
  user_id: number;
  is_enabled: boolean;
  monthly_price?: number;
  one_time_price?: number;
  allow_one_time: boolean;
}

export interface PrivatePhoto {
  photo_id: number;
  photo_url?: string;
  thumbnail_url?: string;
  sort_order: number;
  price?: number;
  uploaded_at: string;
}

export interface PrivateGalleryResponse {
  has_access: boolean;
  photos: PrivatePhoto[];
  monthly_price?: number;
  one_time_price?: number;
  allow_one_time: boolean;
}

// ================================
// Trusted Contacts API
// ================================

export const addTrustedContact = async (data: {
  name: string;
  phone_number: string;
  relationship: string;
}) => {
  const response = await api.post('/safety/trusted-contacts', data);
  return response.data;
};

export const getTrustedContacts = async (): Promise<TrustedContact[]> => {
  const response = await api.get('/safety/trusted-contacts');
  return response.data;
};

export const deleteTrustedContact = async (contactId: number) => {
  const response = await api.delete(`/safety/trusted-contacts/${contactId}`);
  return response.data;
};

// ================================
// SOS API
// ================================

export const triggerSOS = async (data: {
  latitude: number;
  longitude: number;
  location_text?: string;
  booking_id?: number;
}) => {
  const response = await api.post('/safety/sos', data);
  return response.data;
};

export const getActiveSOSAlerts = async (): Promise<SOSAlert[]> => {
  const response = await api.get('/admin/sos/active');
  return response.data;
};

export const resolveSOS = async (alertId: number, resolutionNote?: string) => {
  const response = await api.patch(`/admin/sos/${alertId}/resolve`, {
    resolution_note: resolutionNote,
  });
  return response.data;
};

// ================================
// Check-in/Check-out API
// ================================

export const checkIn = async (data: {
  booking_id: number;
  latitude?: number;
  longitude?: number;
  notes?: string;
}) => {
  const response = await api.post('/safety/check-in', data);
  return response.data;
};

export const checkOut = async (data: {
  booking_id: number;
  notes?: string;
}) => {
  const response = await api.post('/safety/check-out', data);
  return response.data;
};

export const getActiveCheckIns = async (): Promise<CheckIn[]> => {
  const response = await api.get('/admin/check-ins/active');
  return response.data;
};

// ================================
// Private Gallery API
// ================================

export const getPrivateGallerySettings = async (): Promise<PrivateGallerySettings> => {
  const response = await api.get('/gallery/private/settings');
  return response.data;
};

export const updatePrivateGallerySettings = async (
  settings: Partial<PrivateGallerySettings>
) => {
  const response = await api.put('/gallery/private/settings', settings);
  return response.data;
};

export const uploadPrivatePhoto = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/gallery/private/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getPrivateGallery = async (userId: number): Promise<PrivateGalleryResponse> => {
  const response = await api.get(`/gallery/private/${userId}`);
  return response.data;
};

export const purchaseGalleryAccess = async (data: {
  provider_id: number;
  access_type: 'subscription' | 'one_time';
}) => {
  const response = await api.post('/gallery/private/purchase', data);
  return response.data;
};

export default {
  // Trusted Contacts
  addTrustedContact,
  getTrustedContacts,
  deleteTrustedContact,
  // SOS
  triggerSOS,
  getActiveSOSAlerts,
  resolveSOS,
  // Check-in/Check-out
  checkIn,
  checkOut,
  getActiveCheckIns,
  // Private Gallery
  getPrivateGallerySettings,
  updatePrivateGallerySettings,
  uploadPrivatePhoto,
  getPrivateGallery,
  purchaseGalleryAccess,
};
