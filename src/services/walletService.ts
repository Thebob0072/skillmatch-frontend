import api from './api';

// ============================================
// TYPES
// ============================================

export interface WalletBalance {
  pending_balance: number;
  available_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

export interface Transaction {
  transaction_id: number;
  booking_id?: number;
  type: 'booking_payment' | 'booking_refund' | 'withdrawal' | 'adjustment';
  amount: number;
  commission_amount: number;
  net_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  completed_at?: string;
  description?: string;
}

export interface WithdrawalRequest {
  amount: number;
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
}

export interface Withdrawal {
  withdrawal_id: number;
  provider_id: number;
  amount: number;
  bank_name: string;
  bank_account_number: string;
  account_holder_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: number;
  completed_at?: string;
  rejection_reason?: string;
}

// ============================================
// WALLET SERVICE
// ============================================

export const walletService = {
  /**
   * Get wallet balance (GET /wallet/balance)
   * Returns pending, available, total earned, and total withdrawn amounts
   */
  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get<WalletBalance>('/wallet/balance');
    return response.data;
  },

  /**
   * Get transaction history (GET /wallet/transactions)
   * @param limit - Number of transactions to fetch (default: 20)
   * @param offset - Offset for pagination (default: 0)
   */
  getTransactions: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<Transaction[]> => {
    const response = await api.get<{ transactions: Transaction[] }>(
      `/wallet/transactions`,
      { params: { limit, offset } }
    );
    return response.data.transactions;
  },

  /**
   * Request withdrawal (POST /wallet/withdraw)
   * @param data - Withdrawal request details (amount, bank info)
   * @returns Withdrawal confirmation
   */
  requestWithdrawal: async (data: WithdrawalRequest) => {
    const response = await api.post('/wallet/withdraw', data);
    return response.data;
  },

  /**
   * Get withdrawal history (GET /wallet/withdrawals)
   * Returns list of all withdrawal requests and their statuses
   */
  getWithdrawals: async (): Promise<Withdrawal[]> => {
    const response = await api.get<{ withdrawals: Withdrawal[] }>(
      '/wallet/withdrawals'
    );
    return response.data.withdrawals;
  },

  /**
   * Get single withdrawal details (GET /wallet/withdrawals/:id)
   * @param withdrawalId - ID of the withdrawal request
   */
  getWithdrawalById: async (withdrawalId: number): Promise<Withdrawal> => {
    const response = await api.get<Withdrawal>(
      `/wallet/withdrawals/${withdrawalId}`
    );
    return response.data;
  },
};

export default walletService;
