import api from './api';

// ============================================
// TYPES
// ============================================

export interface GodStats {
  total_users: number;
  total_providers: number;
  total_clients: number;
  total_admins: number;
  pending_verification: number;
  total_bookings: number;
  total_revenue: number;
  active_users_24h: number;
  new_users_today: number;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  is_admin?: boolean;
  verification_status?: 'unverified' | 'pending' | 'verified' | 'approved' | 'rejected';
  search?: string;
}

export interface UserListResponse {
  users: Array<{
    user_id: number;
    username: string;
    email: string;
    gender_id: number;
    subscription_tier_id: number;
    is_admin: boolean;
    verification_status: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    registration_date: string;
    profile_image_url?: string;
    age?: number;
    tier_name: string;
  }>;
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface UpdateUserPayload {
  user_id: number;
  is_admin?: boolean;
  tier_id?: number;
  verification_status?: string;
}

export interface CreateAdminPayload {
  username: string;
  email: string;
  password: string;
  gender_id: number;
  admin_type?: string;
  tier_id?: number;
}

export interface AdminListItem {
  user_id: number;
  username: string;
  email: string;
  is_admin: boolean;
  tier_id: number;
  tier_name: string;
  admin_type: string;
  created_at: string;
}

export type ViewMode = 'user' | 'provider' | 'admin' | 'god';

export interface ViewModeResponse {
  message: string;
  current_mode: ViewMode;
  note?: string;
  actual_role: {
    is_admin: boolean;
    tier_id: number;
  };
}

export interface CurrentViewMode {
  current_mode: ViewMode;
  actual_role: {
    is_admin: boolean;
    tier_id: number;
  };
  available_modes: ViewMode[];
}

// ============================================
// GOD SERVICE (Super Admin - Tier 5 Only)
// ============================================
// ⚠️ SECURITY NOTE:
// - GOD role (tier_id = 5) can ONLY be created directly in database
// - NO API endpoint exists to create GOD accounts
// - GOD accounts cannot be created via UI (CreateUserPage)
// - Only existing GOD accounts can use these endpoints
// - GOD tier provides full system access and cannot be revoked via UI
// ============================================

export const godService = {
  /**
   * Get GOD dashboard statistics (GET /admin/stats/god)
   * Only accessible by super admin (tier_id = 5)
   */
  getStats: async (): Promise<GodStats> => {
    const response = await api.get<GodStats>('/admin/stats/god');
    return response.data;
  },

  /**
   * List all users with filters (GET /admin/users)
   * @param params - Pagination and filter parameters
   */
  listUsers: async (params?: UserListParams): Promise<UserListResponse> => {
    const response = await api.get<UserListResponse>('/admin/users', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 50,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Update user role, tier, or status (POST /god/update-user)
   * @param payload - User update data (all fields optional)
   * ⚠️ SECURITY: Backend must prevent tier_id = 5 (GOD) from being set via this endpoint
   * GOD tier can only be set by direct database modification
   */
  updateUser: async (payload: UpdateUserPayload) => {
    const response = await api.post('/god/update-user', payload);
    return response.data;
  },

  /**
   * Delete any user (DELETE /admin/users/:userId)
   * ⚠️ WARNING: Cannot delete super admin accounts
   * @param userId - ID of user to delete
   */
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Ban a user (POST /admin/users/:userId/ban)
   * @param payload - Ban details including user_id, reason, and optional duration_days
   */
  banUser: async (payload: { user_id: number; reason: string; duration_days?: number }) => {
    const response = await api.post(`/admin/users/${payload.user_id}/ban`, {
      reason: payload.reason,
      duration_days: payload.duration_days,
    });
    return response.data;
  },

  /**
   * Unban a user (POST /admin/users/:userId/unban)
   * @param userId - ID of user to unban
   */
  unbanUser: async (userId: number) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  /**
   * Create new admin (POST /admin/admins)
   * @param payload - Admin creation data
   */
  createAdmin: async (payload: CreateAdminPayload) => {
    const response = await api.post('/admin/admins', payload);
    return response.data;
  },

  /**
   * List all admins (GET /admin/admins)
   */
  listAdmins: async (): Promise<{ admins: AdminListItem[]; total: number }> => {
    const response = await api.get<{ admins: AdminListItem[]; total: number }>(
      '/admin/admins'
    );
    return response.data;
  },

  /**
   * Delete admin (DELETE /admin/admins/:userId)
   * ⚠️ WARNING: Cannot delete super admin accounts
   * @param userId - ID of admin to delete
   */
  deleteAdmin: async (userId: number) => {
    const response = await api.delete(`/admin/admins/${userId}`);
    return response.data;
  },

  /**
   * Switch GOD view mode (POST /god/view-mode)
   * Change UI display mode without changing actual role
   * @param mode - View mode: 'user', 'provider', 'admin', or 'god'
   */
  setViewMode: async (mode: ViewMode): Promise<ViewModeResponse> => {
    const response = await api.post<ViewModeResponse>('/god/view-mode', { mode });
    return response.data;
  },

  /**
   * Get current view mode (GET /god/view-mode)
   */
  getViewMode: async (): Promise<CurrentViewMode> => {
    const response = await api.get<CurrentViewMode>('/god/view-mode');
    return response.data;
  },
};

export default godService;
