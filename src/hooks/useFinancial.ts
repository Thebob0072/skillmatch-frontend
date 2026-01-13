import { useState, useEffect, useCallback } from 'react';
import financialService from '../services/financialService';
import type {
  WalletSummary,
  BankAccount,
  FinancialWithdrawal,
  AddBankAccountRequest,
  RequestWithdrawalRequest,
} from '../types';

// ============================================
// useWallet Hook
// ============================================

export function useWallet() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialService.getMyWallet();
      if (response.success && response.data) {
        setWallet(response.data);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch wallet');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching wallet');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return {
    wallet,
    loading,
    error,
    refetch: fetchWallet,
  };
}

// ============================================
// useBankAccounts Hook
// ============================================

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialService.getMyBankAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch bank accounts');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching bank accounts');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (data: AddBankAccountRequest) => {
    try {
      const response = await financialService.addBankAccount(data);
      if (response.success) {
        await fetchAccounts();
        return response.data;
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to add bank account');
    }
  }, [fetchAccounts]);

  const deleteAccount = useCallback(async (bankAccountId: number) => {
    try {
      const response = await financialService.deleteBankAccount(bankAccountId);
      if (response.success) {
        await fetchAccounts();
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to delete bank account');
    }
  }, [fetchAccounts]);

  const setDefaultAccount = useCallback(async (bankAccountId: number) => {
    try {
      const response = await financialService.setDefaultBankAccount(bankAccountId);
      if (response.success) {
        await fetchAccounts();
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to set default account');
    }
  }, [fetchAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    addAccount,
    deleteAccount,
    setDefaultAccount,
    refetch: fetchAccounts,
  };
}

// ============================================
// useWithdrawals Hook
// ============================================

export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<FinancialWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialService.getMyWithdrawals();
      if (response.success && response.data) {
        setWithdrawals(response.data);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch withdrawals');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching withdrawals');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const requestWithdrawal = useCallback(async (data: RequestWithdrawalRequest) => {
    try {
      const response = await financialService.requestWithdrawal(data);
      if (response.success) {
        await fetchWithdrawals();
        return response.data;
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to request withdrawal');
    }
  }, [fetchWithdrawals]);

  const cancelWithdrawal = useCallback(async (withdrawalId: number) => {
    try {
      const response = await financialService.cancelWithdrawal(withdrawalId);
      if (response.success) {
        await fetchWithdrawals();
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to cancel withdrawal');
    }
  }, [fetchWithdrawals]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    loading,
    error,
    requestWithdrawal,
    cancelWithdrawal,
    refetch: fetchWithdrawals,
  };
}

// ============================================
// useTransactions Hook
// ============================================

export function useTransactions(page: number = 1, limit: number = 20) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialService.getMyTransactions(page, limit);
      if (response.success && response.data) {
        setTransactions(response.data.items);
        setTotal(response.data.total);
        setHasMore(response.data.has_more);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching transactions');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    total,
    hasMore,
    loading,
    error,
    refetch: fetchTransactions,
  };
}

// ============================================
// useAdminWithdrawals Hook (Admin/GOD)
// ============================================

export function useAdminWithdrawals(status?: string) {
  const [withdrawals, setWithdrawals] = useState<FinancialWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = status === 'pending' 
        ? await financialService.adminGetPendingWithdrawals()
        : await financialService.adminGetAllWithdrawals(1, 100, status);
      
      if (response.success && response.data) {
        const items = Array.isArray(response.data) ? response.data : response.data.items;
        setWithdrawals(items);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch withdrawals');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching admin withdrawals');
      }
    } finally {
      setLoading(false);
    }
  }, [status]);

  const processWithdrawal = useCallback(async (
    withdrawalId: number,
    action: 'approve' | 'reject' | 'complete',
    data?: { rejection_reason?: string; transfer_reference?: string; transfer_slip_url?: string }
  ) => {
    try {
      const response = await financialService.adminProcessWithdrawal(withdrawalId, {
        action,
        ...data,
      });
      if (response.success) {
        await fetchWithdrawals();
        return response.data;
      }
    } catch (err: unknown) {
      throw new Error(err.response?.data?.message || 'Failed to process withdrawal');
    }
  }, [fetchWithdrawals]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    loading,
    error,
    processWithdrawal,
    refetch: fetchWithdrawals,
  };
}

// ============================================
// useFinancialSummary Hook (GOD)
// ============================================

export function useFinancialSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financialService.adminGetFinancialSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (err: unknown) {
      setError(err.response?.data?.message || 'Failed to fetch financial summary');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching financial summary');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
}
