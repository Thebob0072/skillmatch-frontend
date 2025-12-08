import api from './api';
import type {
  BankAccount,
  AddBankAccountRequest,
  BankAccountResponse,
  WalletSummary,
  WalletResponse,
  FinancialTransaction,
  TransactionHistoryResponse,
  TransactionType,
  FinancialWithdrawal,
  WithdrawalResponse,
  RequestWithdrawalRequest,
  ProcessWithdrawalRequest,
  FinancialSummary,
  FinancialSummaryResponse,
  ApiResponse,
} from '../types';

/**
 * Financial Service
 * Handles all financial operations including wallet, bank accounts, withdrawals, and transactions
 */
class FinancialService {
  // ============================================
  // BANK ACCOUNT ENDPOINTS
  // ============================================

  /**
   * Get all bank accounts for current user
   * GET /bank-accounts
   */
  async getMyBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    const response = await api.get('/bank-accounts');
    return response.data;
  }

  /**
   * Add a new bank account
   * POST /bank-accounts
   */
  async addBankAccount(data: AddBankAccountRequest): Promise<BankAccountResponse> {
    const response = await api.post('/bank-accounts', data);
    return response.data;
  }

  /**
   * Get bank account by ID
   * GET /bank-accounts/:id
   */
  async getBankAccountById(bankAccountId: number): Promise<BankAccountResponse> {
    const response = await api.get(`/bank-accounts/${bankAccountId}`);
    return response.data;
  }

  /**
   * Delete bank account
   * DELETE /bank-accounts/:id
   */
  async deleteBankAccount(bankAccountId: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/bank-accounts/${bankAccountId}`);
    return response.data;
  }

  /**
   * Set bank account as default
   * PUT /bank-accounts/:id/default
   */
  async setDefaultBankAccount(bankAccountId: number): Promise<BankAccountResponse> {
    const response = await api.put(`/bank-accounts/${bankAccountId}/default`);
    return response.data;
  }

  // ============================================
  // WALLET ENDPOINTS
  // ============================================

  /**
   * Get wallet information with recent transactions
   * GET /wallet
   */
  async getMyWallet(): Promise<WalletResponse> {
    const response = await api.get('/wallet');
    return response.data;
  }

  /**
   * Get wallet balance only
   * GET /wallet/balance
   */
  async getWalletBalance(): Promise<ApiResponse<{ available_balance: number; pending_balance: number }>> {
    const response = await api.get('/wallet/balance');
    return response.data;
  }

  // ============================================
  // TRANSACTION ENDPOINTS
  // ============================================

  /**
   * Get transaction history with pagination
   * GET /transactions
   */
  async getMyTransactions(
    page: number = 1,
    limit: number = 20,
    type?: TransactionType
  ): Promise<TransactionHistoryResponse> {
    const params: Record<string, any> = { page, limit };
    if (type) params.type = type;
    
    const response = await api.get('/transactions', { params });
    return response.data;
  }

  /**
   * Get transaction by ID
   * GET /transactions/:id
   */
  async getTransactionById(transactionId: number): Promise<ApiResponse<FinancialTransaction>> {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  }

  // ============================================
  // WITHDRAWAL ENDPOINTS (Provider)
  // ============================================

  /**
   * Request a withdrawal
   * POST /withdrawals
   */
  async requestWithdrawal(data: RequestWithdrawalRequest): Promise<WithdrawalResponse> {
    const response = await api.post('/withdrawals', data);
    return response.data;
  }

  /**
   * Get withdrawal history for current user
   * GET /withdrawals
   */
  async getMyWithdrawals(): Promise<ApiResponse<FinancialWithdrawal[]>> {
    const response = await api.get('/withdrawals');
    return response.data;
  }

  /**
   * Get withdrawal by ID
   * GET /withdrawals/:id
   */
  async getWithdrawalById(withdrawalId: number): Promise<WithdrawalResponse> {
    const response = await api.get(`/withdrawals/${withdrawalId}`);
    return response.data;
  }

  /**
   * Cancel pending withdrawal
   * DELETE /withdrawals/:id
   */
  async cancelWithdrawal(withdrawalId: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/withdrawals/${withdrawalId}`);
    return response.data;
  }

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Get all pending withdrawals (Admin/GOD only)
   * GET /admin/withdrawals/pending
   */
  async adminGetPendingWithdrawals(): Promise<ApiResponse<FinancialWithdrawal[]>> {
    const response = await api.get('/admin/withdrawals/pending');
    return response.data;
  }

  /**
   * Get all withdrawals with filters (Admin/GOD only)
   * GET /admin/withdrawals
   */
  async adminGetAllWithdrawals(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<ApiResponse<{
    items: FinancialWithdrawal[];
    total: number;
    page: number;
    limit: number;
  }>> {
    const params: Record<string, any> = { page, limit };
    if (status) params.status = status;
    
    const response = await api.get('/admin/withdrawals', { params });
    return response.data;
  }

  /**
   * Process withdrawal (approve, reject, complete)
   * PUT /admin/withdrawals/:id
   */
  async adminProcessWithdrawal(
    withdrawalId: number,
    data: ProcessWithdrawalRequest
  ): Promise<WithdrawalResponse> {
    const response = await api.put(`/admin/withdrawals/${withdrawalId}`, data);
    return response.data;
  }

  /**
   * Verify bank account (Admin only)
   * PUT /admin/bank-accounts/:id/verify
   */
  async adminVerifyBankAccount(bankAccountId: number): Promise<BankAccountResponse> {
    const response = await api.put(`/admin/bank-accounts/${bankAccountId}/verify`);
    return response.data;
  }

  /**
   * Get user's bank accounts (Admin only)
   * GET /admin/users/:userId/bank-accounts
   */
  async adminGetUserBankAccounts(userId: number): Promise<ApiResponse<BankAccount[]>> {
    const response = await api.get(`/admin/users/${userId}/bank-accounts`);
    return response.data;
  }

  /**
   * Get user's wallet (Admin only)
   * GET /admin/users/:userId/wallet
   */
  async adminGetUserWallet(userId: number): Promise<WalletResponse> {
    const response = await api.get(`/admin/users/${userId}/wallet`);
    return response.data;
  }

  /**
   * Get user's transactions (Admin only)
   * GET /admin/users/:userId/transactions
   */
  async adminGetUserTransactions(
    userId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<TransactionHistoryResponse> {
    const response = await api.get(`/admin/users/${userId}/transactions`, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get financial summary (GOD only)
   * GET /god/financial-summary
   */
  async adminGetFinancialSummary(): Promise<FinancialSummaryResponse> {
    const response = await api.get('/god/financial-summary');
    return response.data;
  }

  /**
   * Upload transfer slip (Admin only)
   * POST /admin/withdrawals/:id/transfer-slip
   */
  async adminUploadTransferSlip(
    withdrawalId: number,
    file: File,
    transferReference: string
  ): Promise<WithdrawalResponse> {
    const formData = new FormData();
    formData.append('transfer_slip', file);
    formData.append('transfer_reference', transferReference);

    const response = await api.post(
      `/admin/withdrawals/${withdrawalId}/transfer-slip`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Calculate withdrawal fee (10 THB flat fee)
   */
  calculateWithdrawalFee(amount: number): number {
    return 10; // Flat fee of 10 THB
  }

  /**
   * Calculate net withdrawal amount (amount - fee)
   */
  calculateNetWithdrawal(amount: number): number {
    return amount - this.calculateWithdrawalFee(amount);
  }

  /**
   * Calculate provider earnings from booking (87.25% of total)
   */
  calculateProviderEarnings(bookingAmount: number): number {
    return bookingAmount * 0.8725;
  }

  /**
   * Calculate platform commission (12.75% of total)
   */
  calculatePlatformCommission(bookingAmount: number): number {
    return bookingAmount * 0.1275;
  }

  /**
   * Format currency to Thai Baht
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  }
}

export default new FinancialService();
