import api from './api';
import type { AdminStats, PendingVerification, User, PaginatedResponse } from '../types';

// ============================================
// TYPES (Extend existing types as needed)
// ============================================

export interface WithdrawalApproval {
  withdrawal_id: number;
  provider_id: number;
  provider_username: string;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
}

// ============================================
// ADMIN SERVICE
// ============================================

export const adminService = {
  /**
   * Get admin dashboard statistics (GET /admin/stats)
   */
  getStats: async () => {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  },

  /**
   * Get pending face verifications (GET /admin/verifications/pending)
   */
  getPendingVerifications: async () => {
    const response = await api.get<PendingVerification[]>('/admin/verifications/pending');
    return response.data;
  },

  /**
   * Approve face verification (POST /admin/verifications/:userId/approve)
   */
  approveVerification: async (userId: number) => {
    await api.post(`/admin/verifications/${userId}/approve`);
  },

  /**
   * Reject face verification (POST /admin/verifications/:userId/reject)
   */
  rejectVerification: async (userId: number, reason: string) => {
    await api.post(`/admin/verifications/${userId}/reject`, { reason });
  },

  /**
   * Get all users with pagination (GET /admin/users)
   */
  getAllUsers: async (page: number = 1, limit: number = 20) => {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Ban user (POST /admin/users/:userId/ban)
   */
  banUser: async (userId: number, reason: string) => {
    await api.post(`/admin/users/${userId}/ban`, { reason });
  },

  /**
   * Unban user (POST /admin/users/:userId/unban)
   */
  unbanUser: async (userId: number) => {
    await api.post(`/admin/users/${userId}/unban`);
  },

  /**
   * Get pending withdrawal requests (GET /admin/withdrawals/pending)
   */
  getPendingWithdrawals: async (): Promise<WithdrawalApproval[]> => {
    const response = await api.get<{ withdrawals: WithdrawalApproval[] }>(
      '/admin/withdrawals/pending'
    );
    return response.data.withdrawals;
  },

  /**
   * Approve withdrawal request (POST /admin/withdrawals/:withdrawalId/approve)
   */
  approveWithdrawal: async (withdrawalId: number) => {
    const response = await api.post(`/admin/withdrawals/${withdrawalId}/approve`);
    return response.data;
  },

  /**
   * Reject withdrawal request (POST /admin/withdrawals/:withdrawalId/reject)
   */
  rejectWithdrawal: async (withdrawalId: number, reason: string) => {
    const response = await api.post(`/admin/withdrawals/${withdrawalId}/reject`, {
      reason,
    });
    return response.data;
  },

  /**
   * Mark withdrawal as completed (POST /admin/withdrawals/:withdrawalId/complete)
   */
  completeWithdrawal: async (withdrawalId: number) => {
    const response = await api.post(`/admin/withdrawals/${withdrawalId}/complete`);
    return response.data;
  },
};

export default adminService;

// Legacy exports for backward compatibility
export const getAdminStats = adminService.getStats;
export const getPendingVerifications = adminService.getPendingVerifications;
export const approveVerification = adminService.approveVerification;
export const rejectVerification = adminService.rejectVerification;
export const getAllUsers = adminService.getAllUsers;
export const banUser = adminService.banUser;
export const unbanUser = adminService.unbanUser;
