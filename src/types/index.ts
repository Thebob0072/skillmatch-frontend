// User and Authentication Types
export interface User {
  user_id: number;
  email: string;
  username: string;
  full_name: string | null;
  profile_picture_url: string | null;
  role: 'client' | 'provider' | 'admin';
  tier_id: number | null;
  tier_name: string | null;
  google_id: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  location_province: string | null;
  location_district: string | null;
  latitude: number | null;
  longitude: number | null;
  bio: string | null;
  language_preference: 'th' | 'en' | 'zh';
  is_email_verified: boolean;
  is_age_verified: boolean;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  full_name?: string;
  role: 'client' | 'provider';
  language_preference?: 'th' | 'en' | 'zh';
}

export interface GoogleAuthRequest {
  token: string;
  role: 'client' | 'provider';
}

// Provider Types
export interface Provider {
  user_id: number;
  username: string;
  full_name: string | null;
  profile_picture_url: string | null;
  tier_id: number | null;
  tier_name: string | null;
  location_province: string | null;
  location_district: string | null;
  latitude: number | null;
  longitude: number | null;
  bio: string | null;
  average_rating: number | null;
  total_reviews: number;
  total_bookings: number;
  distance_km: number | null;
  categories: ProviderCategory[];
  is_favorited?: boolean;
}

export interface ProviderCategory {
  category_id: number;
  category_name: string;
  experience_years: number | null;
  description: string | null;
}

export interface ProviderProfile extends Provider {
  phone_number: string | null;
  email: string;
  is_email_verified: boolean;
  is_age_verified: boolean;
  created_at: string;
  verification_status: 'pending' | 'approved' | 'rejected' | null;
  rejection_reason: string | null;
}

// Category Types
export interface Category {
  category_id: number;
  category_name: string;
  description: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_at: string;
}

// Package Types
export interface Package {
  package_id: number;
  provider_id: number;
  package_name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  provider_username?: string;
  provider_profile_picture?: string | null;
}

// Booking Types
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface Booking {
  booking_id: number;
  client_id: number;
  provider_id: number;
  package_id: number | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_price: number;
  status: BookingStatus;
  location_address: string | null;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  client_username: string;
  provider_username: string;
  package_name: string | null;
  client_profile_picture?: string | null;
  provider_profile_picture?: string | null;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface CreateBookingRequest {
  provider_id: number;
  package_id?: number;
  booking_date: string;
  start_time: string;
  duration_minutes: number;
  total_price: number;
  location_address?: string;
  special_requests?: string;
}

// Review Types
export interface Review {
  review_id: number;
  booking_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  reviewer_username: string;
  reviewer_profile_picture: string | null;
  booking_date?: string;
}

export interface CreateReviewRequest {
  booking_id: number;
  rating: number;
  comment?: string;
}

// Message Types
export interface Message {
  message_id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_username: string;
  sender_profile_picture: string | null;
  receiver_username: string;
  receiver_profile_picture: string | null;
}

export interface Conversation {
  other_user_id: number;
  other_user_username: string;
  other_user_profile_picture: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

export interface SendMessageRequest {
  receiver_id: number;
  content: string;
}

// Notification Types
export type NotificationType = 
  | 'booking_request' 
  | 'booking_confirmed' 
  | 'booking_cancelled' 
  | 'new_message' 
  | 'new_review' 
  | 'payment_received'
  | 'verification_status'
  | 'system_announcement';

export interface Notification {
  notification_id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  related_id: number | null;
  created_at: string;
}

// Photo Types
export interface Photo {
  photo_id: number;
  user_id: number;
  photo_url: string;
  caption: string | null;
  display_order: number;
  is_profile_picture: boolean;
  created_at: string;
  updated_at: string;
}

// Favorite Types
export interface Favorite {
  favorite_id: number;
  client_id: number;
  provider_id: number;
  created_at: string;
  provider: Provider;
}

// Payment Types
export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentIntentRequest {
  booking_id: number;
  amount: number;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

// Schedule Types
export interface Schedule {
  schedule_id: number;
  provider_id: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

// Verification Types
export interface VerificationDocument {
  document_id: number;
  user_id: number;
  document_type: 'national_id' | 'passport' | 'face_verification' | 'other';
  document_url: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface FaceVerificationRequest {
  selfie_image: string; // Base64 encoded
  id_card_image: string; // Base64 encoded
}

// Block Types
export interface BlockedUser {
  block_id: number;
  blocker_id: number;
  blocked_id: number;
  reason: string | null;
  created_at: string;
  blocked_username: string;
  blocked_profile_picture: string | null;
}

// Report Types
export interface Report {
  report_id: number;
  reporter_id: number;
  reported_user_id: number;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface CreateReportRequest {
  reported_user_id: number;
  reason: string;
  description?: string;
}

// Analytics Types
export interface ProviderAnalytics {
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  average_rating: number;
  total_reviews: number;
  profile_views: number;
  favorite_count: number;
}

export interface BookingStatistics {
  date: string;
  count: number;
  revenue: number;
}

// Admin Types
export interface AdminStats {
  total_users: number;
  total_providers: number;
  total_clients: number;
  total_bookings: number;
  total_revenue: number;
  pending_verifications: number;
  active_disputes: number;
}

export interface PendingVerification {
  user_id: number;
  username: string;
  email: string;
  role: string;
  submitted_at: string;
  document_count: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Search and Filter Types
export interface SearchParams extends PaginationParams {
  query?: string;
  category_id?: number;
  province?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  radius_km?: number;
  min_rating?: number;
  tier_id?: number;
  sort_by?: 'rating' | 'distance' | 'price' | 'reviews';
  sort_order?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface ProfileUpdateRequest {
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  bio?: string;
  location_province?: string;
  location_district?: string;
  latitude?: number;
  longitude?: number;
  language_preference?: 'th' | 'en' | 'zh';
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'notification' | 'message' | 'booking_update' | 'system';
  data: any;
  timestamp: string;
}

// Tier Types
export interface Tier {
  tier_id: number;
  tier_name: string;
  description: string | null;
  monthly_price: number;
  max_photos: number;
  priority_support: boolean;
  featured_listing: boolean;
  analytics_access: boolean;
  custom_badge: boolean;
  created_at: string;
}
