// Environment configuration with fallback values
export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const CLOUD_STORAGE_BASE_URL = import.meta.env.VITE_CLOUD_STORAGE_BASE_URL || '';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// WebSocket URL (derived from API_URL)
export const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// File upload limits
export const MAX_PHOTO_SIZE_MB = 10;
export const MAX_PHOTOS_PER_UPLOAD = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Geolocation defaults
export const DEFAULT_SEARCH_RADIUS_KM = 50;
export const DEFAULT_LOCATION = {
  lat: 13.7563,
  lng: 100.5018,
  province: 'Bangkok',
  district: 'Pathum Wan',
};
