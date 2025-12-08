import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet, useTransactions } from '../../hooks';
import financialService from '../../services/financialService';
import type { TransactionType } from '../../types';

const WalletDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { wallet, loading: walletLoading, error: walletError, refetch } = useWallet();
  const { transactions, loading: transactionsLoading } = useTransactions(1, 10);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (walletLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{t('financial.wallet.error')}: {walletError}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          {t('financial.wallet.try_again')}
        </button>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800">{t('financial.wallet.no_wallet')}</p>
      </div>
    );
  }

  const { available_balance, pending_balance, total_earned, total_withdrawn } = wallet.wallet;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('financial.wallet.title')}</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {t('financial.wallet.refresh')}
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">{t('financial.wallet.available_balance')}</span>
            <svg className="w-8 h-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(available_balance)}
          </div>
          <p className="text-green-100 text-xs mt-2">{t('financial.wallet.can_withdraw_now')}</p>
        </div>

        {/* Pending Balance */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-100 text-sm font-medium">{t('financial.wallet.pending_balance')}</span>
            <svg className="w-8 h-8 text-yellow-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(pending_balance)}
          </div>
          <p className="text-yellow-100 text-xs mt-2">{t('financial.wallet.wait_7_days')}</p>
        </div>

        {/* Total Earned */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">{t('financial.wallet.total_earned')}</span>
            <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {financialService.formatCurrency(total_earned)}
          </div>
          <p className="text-blue-100 text-xs mt-2">{t('financial.wallet.total_withdrawn')} {financialService.formatCurrency(total_withdrawn)}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('financial.wallet.stats')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">{t('financial.wallet.total_bookings')}</p>
            <p className="text-2xl font-bold text-gray-800">{wallet.stats.total_bookings}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">{t('financial.wallet.completed_bookings')}</p>
            <p className="text-2xl font-bold text-green-600">{wallet.stats.completed_bookings}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">{t('financial.wallet.pending_amount')}</p>
            <p className="text-2xl font-bold text-yellow-600">
              {financialService.formatCurrency(wallet.stats.pending_amount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">{t('financial.wallet.available_amount')}</p>
            <p className="text-2xl font-bold text-green-600">
              {financialService.formatCurrency(wallet.stats.available_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('financial.wallet.recent_transactions')}</h3>
        
        {transactionsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('financial.wallet.no_transactions')}</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.transaction_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'provider_earning' ? 'bg-green-100' :
                    transaction.type === 'withdrawal' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {transaction.type === 'provider_earning' ? (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : transaction.type === 'withdrawal' ? (
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.type === 'provider_earning' ? t('financial.transaction.provider_earning') :
                       transaction.type === 'withdrawal' ? t('financial.transaction.withdrawal') :
                       transaction.description || t('financial.transaction.transaction')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'provider_earning' ? 'text-green-600' :
                    transaction.type === 'withdrawal' ? 'text-blue-600' :
                    'text-gray-800'
                  }`}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    {financialService.formatCurrency(Math.abs(transaction.net_amount))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.status === 'completed' ? t('financial.transaction.status_completed') :
                     transaction.status === 'pending' ? t('financial.transaction.status_pending') :
                     transaction.status === 'failed' ? t('financial.transaction.status_failed') :
                     transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
