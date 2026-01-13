import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet, useBankAccounts, useWithdrawals } from '../../hooks';
import financialService from '../../services/financialService';
import type { RequestWithdrawalRequest } from '../../types';

const WithdrawalRequest: React.FC = () => {
  const { t } = useTranslation();
  const { wallet, loading: walletLoading } = useWallet();
  const { accounts, loading: accountsLoading } = useBankAccounts();
  const { withdrawals, requestWithdrawal, refetch } = useWithdrawals();

  const [selectedBankAccountId, setSelectedBankAccountId] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-select default bank account
  useEffect(() => {
    const defaultAccount = accounts.find(acc => acc.is_default && acc.is_verified);
    if (defaultAccount && !selectedBankAccountId) {
      setSelectedBankAccountId(defaultAccount.bank_account_id);
    }
  }, [accounts, selectedBankAccountId]);

  const verifiedAccounts = accounts.filter(acc => acc.is_verified && acc.is_active);
  const availableBalance = wallet?.wallet.available_balance || 0;
  const parsedAmount = parseFloat(amount) || 0;
  const fee = parsedAmount > 0 ? financialService.calculateWithdrawalFee(parsedAmount) : 0;
  const netAmount = parsedAmount > 0 ? financialService.calculateNetWithdrawal(parsedAmount) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!selectedBankAccountId) {
      setError(t('financial.withdrawal.select_account_error'));
      return;
    }

    if (parsedAmount < 100) {
      setError(t('financial.withdrawal.min_amount_error'));
      return;
    }

    if (parsedAmount > availableBalance) {
      setError(t('financial.withdrawal.insufficient_balance'));
      return;
    }

    setLoading(true);

    try {
      const data: RequestWithdrawalRequest = {
        bank_account_id: selectedBankAccountId,
        amount: parsedAmount,
        notes: notes.trim() || undefined,
      };

      await requestWithdrawal(data);
      
      // Reset form
      setAmount('');
      setNotes('');
      setShowSuccess(true);
      
      // Refetch withdrawals
      await refetch();

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err.message || t('financial.withdrawal.error'));
    } finally {
      setLoading(false);
    }
  };

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending' || w.status === 'approved');
  const hasPendingWithdrawal = pendingWithdrawals.length > 0;

  if (walletLoading || accountsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{t('financial.withdrawal.title')}</h2>
        <p className="text-gray-600 mt-1">{t('financial.withdrawal.subtitle')}</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-green-800">{t('financial.withdrawal.request_success')}</p>
            <p className="text-sm text-green-600">{t('financial.withdrawal.wait_approval')}</p>
          </div>
        </div>
      )}

      {/* Available Balance Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-green-100 text-sm mb-2">{t('financial.wallet.available_balance')}</p>
        <p className="text-4xl font-bold">{financialService.formatCurrency(availableBalance)}</p>
        <p className="text-green-100 text-sm mt-2">
          {t('financial.wallet.pending_balance')}: {financialService.formatCurrency(wallet?.wallet.pending_balance || 0)}
        </p>
      </div>

      {/* Warning for No Verified Accounts */}
      {verifiedAccounts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-medium text-yellow-800">{t('financial.withdrawal.no_verified_accounts')}</p>
              <p className="text-sm text-yellow-600 mt-1">
                {t('financial.withdrawal.add_account_first')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Withdrawals Warning */}
      {hasPendingWithdrawal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-blue-800">{t('financial.withdrawal.pending_withdrawals')}</p>
              <p className="text-sm text-blue-600 mt-1">
                {t('financial.withdrawal.pending_count', { count: pendingWithdrawals.length })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Form */}
      <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('financial.withdrawal.form_title')}</h3>

        {error && (
          <div className="glass-dark border border-red-500/30 rounded-lg p-3 mb-4 shadow-glow-red">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Account Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('financial.bank.title')} <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedBankAccountId || ''}
              onChange={(e) => setSelectedBankAccountId(Number(e.target.value))}
              required
              disabled={verifiedAccounts.length === 0}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t('financial.withdrawal.select_account')}</option>
              {verifiedAccounts.map(account => (
                <option key={account.bank_account_id} value={account.bank_account_id}>
                  {account.bank_name} - {account.account_number.replace(/(\d{3})(\d{1})(\d{5})(\d{1})/, '$1-$2-$3-$4')} 
                  {account.is_default && ' (หลัก)'}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('financial.withdrawal.amount')} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="100"
              max={availableBalance}
              step="1"
              placeholder="0.00"
              disabled={verifiedAccounts.length === 0 || availableBalance < 100}
              className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 placeholder-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              {t('financial.withdrawal.min_max', { max: financialService.formatCurrency(availableBalance) })}
            </p>
          </div>

          {/* Fee Breakdown */}
          {parsedAmount >= 100 && (
            <div className="glass-dark border border-purple-500/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('financial.withdrawal.requested_amount')}</span>
                <span className="font-medium text-white">{financialService.formatCurrency(parsedAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('financial.withdrawal.fee')}</span>
                <span className="font-medium text-red-600">-{financialService.formatCurrency(fee)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-semibold text-gray-800">{t('financial.withdrawal.net_amount')}</span>
                <span className="font-bold text-green-600 text-lg">{financialService.formatCurrency(netAmount)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('financial.withdrawal.notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t('financial.withdrawal.notes_placeholder')}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{notes.length}/500 {t('financial.withdrawal.char_limit')}</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || verifiedAccounts.length === 0 || availableBalance < 100 || parsedAmount < 100}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? t('financial.withdrawal.sending') : t('financial.withdrawal.confirm')}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div className="glass-dark rounded-xl border border-purple-500/30 shadow-glow-purple p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{t('financial.withdrawal.history')}</h3>
          <div className="space-y-3">
            {withdrawals.slice(0, 5).map(withdrawal => (
              <div
                key={withdrawal.withdrawal_id}
                className="flex items-center justify-between p-4 glass-dark border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all"
              >
                <div>
                  <p className="font-medium text-white">
                    {financialService.formatCurrency(withdrawal.requested_amount)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(withdrawal.requested_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  withdrawal.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  withdrawal.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {withdrawal.status === 'completed' ? t('financial.withdrawal.status_completed') :
                   withdrawal.status === 'approved' ? t('financial.withdrawal.status_approved') :
                   withdrawal.status === 'pending' ? t('financial.withdrawal.status_pending') :
                   withdrawal.status === 'rejected' ? t('financial.withdrawal.status_rejected') :
                   withdrawal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">📝 {t('financial.withdrawal.info_title')}</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• {t('financial.withdrawal.info_fee')}</li>
          <li>• {t('financial.withdrawal.info_min')}</li>
          <li>• {t('financial.withdrawal.info_duration')}</li>
          <li>• {t('financial.withdrawal.info_slip')}</li>
          <li>• {t('financial.withdrawal.info_status')}</li>
        </ul>
      </div>
    </div>
  );
};

export default WithdrawalRequest;
