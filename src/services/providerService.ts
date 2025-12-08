import api from './api';

// ============================================
// TYPES
// ============================================

export interface ProviderRegistrationData {
  // Basic user fields
  username: string;
  email: string;
  password: string;
  gender_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  otp: string;

  // Provider-specific fields
  category_ids: number[]; // Max 5 categories
  service_type: 'Incall' | 'Outcall' | 'Both';
  bio: string;
  province?: string;
  district?: string;
  sub_district?: string;
  postal_code?: string;
  address_line1?: string;
  latitude?: number;
  longitude?: number;
}

export interface ProviderDocument {
  document_id: number;
  user_id: number;
  document_type: string;
  file_url: string;
  file_name?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  verified_at?: string;
  verified_by?: number;
  rejection_reason?: string;
}

export interface ProviderTier {
  user_id: number;
  username: string;
  current_tier_id: number;
  current_tier_name: string;
  tier_points: number;
  next_tier_id?: number;
  next_tier_name?: string;
  points_to_next_tier?: number;
  points_breakdown: {
    rating_points: number;
    booking_points: number;
    review_points: number;
    response_rate_points: number;
    acceptance_rate_points: number;
  };
  stats: {
    average_rating: number;
    completed_bookings: number;
    total_reviews: number;
    response_rate: number;
    acceptance_rate: number;
  };
}

export interface ProviderCategory {
  category_id: number;
  name: string;
  name_thai: string;
  description?: string;
  icon?: string;
  is_adult: boolean;
  is_primary?: boolean;
}

export interface TierHistory {
  history_id: number;
  user_id: number;
  old_tier_id: number;
  old_tier_name: string;
  new_tier_id: number;
  new_tier_name: string;
  change_type: 'auto' | 'manual' | 'subscription';
  reason: string;
  changed_at: string;
}

// ============================================
// PROVIDER SERVICE
// ============================================

export const providerService = {
  /**
   * Register as provider (POST /register/provider)
   */
  register: async (data: ProviderRegistrationData) => {
    const response = await api.post('/register/provider', data);
    return response.data;
  },

  /**
   * Upload provider document (POST /provider/documents)
   * @param documentType - 'national_id', 'health_certificate', 'business_license', etc.
   * @param fileUrl - GCS/S3 URL of uploaded file
   * @param fileName - Optional filename
   */
  uploadDocument: async (
    documentType: string,
    fileUrl: string,
    fileName?: string
  ) => {
    const response = await api.post('/provider/documents', {
      document_type: documentType,
      file_url: fileUrl,
      file_name: fileName,
    });
    return response.data;
  },

  /**
   * Get my provider documents (GET /provider/documents)
   */
  getMyDocuments: async (): Promise<ProviderDocument[]> => {
    const response = await api.get<{ documents: ProviderDocument[] }>(
      '/provider/documents'
    );
    return response.data.documents;
  },

  /**
   * Get my provider tier (GET /provider/my-tier)
   */
  getMyTier: async (): Promise<ProviderTier> => {
    const response = await api.get<ProviderTier>('/provider/my-tier');
    return response.data;
  },

  /**
   * Get tier history (GET /provider/tier-history)
   */
  getTierHistory: async (): Promise<TierHistory[]> => {
    const response = await api.get<{ history: TierHistory[] }>(
      '/provider/tier-history'
    );
    return response.data.history;
  },

  /**
   * Get my provider categories (GET /provider/categories/me)
   */
  getMyCategories: async (): Promise<ProviderCategory[]> => {
    const response = await api.get<{ categories: ProviderCategory[] }>(
      '/provider/categories/me'
    );
    return response.data.categories;
  },

  /**
   * Update my provider categories (PUT /provider/me/categories)
   * @param categoryIds - Array of category IDs (max 5)
   */
  updateCategories: async (categoryIds: number[]) => {
    if (categoryIds.length > 5) {
      throw new Error('Cannot select more than 5 categories');
    }
    const response = await api.put('/provider/me/categories', {
      category_ids: categoryIds,
    });
    return response.data;
  },

  /**
   * Get provider public profile (GET /provider/:userId/public)
   * No authentication required - limited data
   */
  getPublicProfile: async (userId: number) => {
    const response = await api.get(`/provider/${userId}/public`);
    return response.data;
  },

  /**
   * Get provider full profile (GET /provider/:userId)
   * Authentication required - full data including age, height, service_type
   */
  getFullProfile: async (userId: number) => {
    const response = await api.get(`/provider/${userId}`);
    return response.data;
  },

  /**
   * Get provider photos (GET /provider/:userId/photos)
   */
  getProviderPhotos: async (userId: number) => {
    const response = await api.get(`/provider/${userId}/photos`);
    return response.data;
  },
};

export default providerService;
