import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWallet, useTransactions, useBankAccounts } from '../../hooks';
import financialService from '../../services/financialService';
import type { TransactionType } from '../../types';

const WalletDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { wallet, loading: walletLoading, error: walletError, refetch } = useWallet();
  const { transactions, loading: transactionsLoading } = useTransactions(1, 10);
  const { accounts, loading: accountsLoading } = useBankAccounts();

  const [refreshing, setRefreshing] = useState(false);
  
  // Check if user has verified bank account
  const hasVerifiedAccount = accounts.some(acc => acc.is_verified);
  const hasAnyAccount = accounts.length > 0; 

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

  // Bank Account Setup Required Screen
  if (!accountsLoading && !hasAnyAccount) {
    return (
      <div className="glass-dark rounded-xl p-8 border border-yellow-500/30 shadow-glow-gold">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4 animate-bounce">🏦</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">
            {t('financial.wallet.bank_required_title')}
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            {t('financial.wallet.bank_required_desc')}
          </p>
          <div className="glass-dark rounded-lg p-6 mb-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">{t('financial.wallet.bank_info_needed')}</h3>
            <ul className="text-left space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-2xl">🏦</span>
                <span>{t('financial.bank.bank_name')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <span>{t('financial.bank.account_name')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🔢</span>
                <span>{t('financial.bank.account_number')}</span>
              </li>
            </ul>
          </div>
          <Link
            to="/financial?tab=bank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-lg transition-all shadow-glow-gold hover:shadow-glow-gold hover:scale-105"
          >
            <span>➕</span>
            <span>{t('financial.bank.add_account')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Bank Account Pending Verification Screen
  if (!accountsLoading && hasAnyAccount && !hasVerifiedAccount) {
    return (
      <div className="glass-dark rounded-xl p-8 border border-blue-500/30 shadow-glow-blue">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 mb-4">
            {t('financial.wallet.verification_pending')}
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            {t('financial.wallet.verification_pending_desc')}
          </p>
          <div className="glass-dark rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-lg font-bold text-blue-400 mb-4">{t('financial.wallet.your_accounts')}</h3>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.bank_account_id} className="flex items-center justify-between p-4 glass-dark rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏦</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-200">{account.bank_name}</p>
                      <p className="text-sm text-gray-400">{account.account_number}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    ⏳ {t('financial.bank.pending_badge')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { available_balance, pending_balance, total_earned, total_withdrawn } = wallet.wallet;

  return (
    <div className="space-y-6">
      {/* Header - Neon Theme */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 animate-neon-pulse">
            💰 {t('wallet.my_wallet')}
          </h2>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span className="animate-pulse">🏆</span>
            <span className="text-yellow-400 font-semibold">{t('wallet.trust_badge')}</span>
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 glass-dark border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all disabled:opacity-50 hover:shadow-glow-purple"
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

      {/* Security Features Section - Neon Purple Theme */}
      <div className="glass-dark rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all shadow-glow-purple">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl animate-pulse-slow">🔐</span>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {t('wallet.security.title')}
          </h3>
          <span className="ml-auto bg-purple-500/20 px-3 py-1 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30">
            {t('wallet.safe_secure')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🔒</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.encrypted_data')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">✅</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.secure_transactions')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🛡️</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.fraud_protection')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🔑</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.two_factor_auth')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">💰</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.protected_funds')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 hover:shadow-glow-purple transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">✓</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.security.verified_only')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Neon Pink/Gold Theme */}
      <div className="glass-dark rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all shadow-glow-pink">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl animate-pulse-slow">💎</span>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400">
            Premium Features
          </h3>
          <span className="ml-auto bg-pink-500/20 px-3 py-1 rounded-full text-sm font-medium text-pink-300 border border-pink-500/30">
            ⚡ Instant
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">⚡</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.instant_transfer')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">💸</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.low_fees')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🌍</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.multi_currency')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🤖</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.auto_withdraw')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.real_time_balance')}</p>
            </div>
          </div>
          <div className="glass-dark p-4 rounded-lg border border-pink-500/20 hover:border-pink-500/40 hover:shadow-glow-pink transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
              <p className="font-semibold text-sm text-gray-200">{t('wallet.features.transaction_notifications')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Type Badges - Neon Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-dark rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all shadow-glow-gold hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-float">💼</span>
            <div>
              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                {t('wallet.for_providers')}
              </h4>
              <p className="text-sm text-gray-300">รับเงินปลอดภัย ถอนได้ทันที</p>
            </div>
          </div>
        </div>
        <div className="glass-dark rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all shadow-glow-blue hover-lift">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-float">🛍️</span>
            <div>
              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400">
                {t('wallet.for_clients')}
              </h4>
              <p className="text-sm text-gray-300">เติมเงิน จ่ายง่าย ปลอดภัย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Cards - Neon Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="glass-dark rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 shadow-glow-green transition-all group hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">💵</span>
              <span>{t('financial.wallet.available_balance')}</span>
            </span>
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
            {financialService.formatCurrency(available_balance)}
          </div>
          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
            <span>✓</span>
            <span>{t('financial.wallet.can_withdraw_now')}</span>
          </p>
        </div>

        {/* Pending Balance */}
        <div className="glass-dark rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 shadow-glow-gold transition-all group hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">⏳</span>
              <span>{t('financial.wallet.pending_balance')}</span>
            </span>
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
            {financialService.formatCurrency(pending_balance)}
          </div>
          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
            <span>⌛</span>
            <span>{t('financial.wallet.wait_7_days')}</span>
          </p>
        </div>

        {/* Total Earned */}
        <div className="glass-dark rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 shadow-glow-purple transition-all group hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
              <span>{t('financial.wallet.total_earned')}</span>
            </span>
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400">
            {financialService.formatCurrency(total_earned)}
          </div>
          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
            <span>💎</span>
            <span>{t('financial.wallet.total_withdrawn')} {financialService.formatCurrency(total_withdrawn)}</span>
          </p>
        </div>
      </div>

      {/* Quick Stats - Neon Theme */}
      <div className="glass-dark rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-500/50 shadow-glow-blue transition-all">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          {t('financial.wallet.stats')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center glass-dark p-4 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">{t('financial.wallet.total_bookings')}</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">{wallet.stats.total_bookings}</p>
          </div>
          <div className="text-center glass-dark p-4 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">{t('financial.wallet.completed_bookings')}</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">{wallet.stats.completed_bookings}</p>
          </div>
          <div className="text-center glass-dark p-4 rounded-lg border border-gray-700/50 hover:border-yellow-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">{t('financial.wallet.pending_amount')}</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              {financialService.formatCurrency(wallet.stats.pending_amount)}
            </p>
          </div>
          <div className="text-center glass-dark p-4 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">{t('financial.wallet.available_amount')}</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              {financialService.formatCurrency(wallet.stats.available_amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions - Neon Theme */}
      <div className="glass-dark rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 shadow-glow-pink transition-all">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4 flex items-center gap-2">
          <span className="text-2xl">📜</span>
          {t('financial.wallet.recent_transactions')}
        </h3>
        
        {transactionsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{t('financial.wallet.no_transactions')}</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.transaction_id}
                className="flex items-center justify-between p-4 glass-dark rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all hover-lift"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                    transaction.type === 'provider_earning' ? 'bg-green-500/10 border-green-500/30' :
                    transaction.type === 'withdrawal' ? 'bg-blue-500/10 border-blue-500/30' :
                    'bg-purple-500/10 border-purple-500/30'
                  }`}>
                    {transaction.type === 'provider_earning' ? (
                      <span className="text-xl">💰</span>
                    ) : transaction.type === 'withdrawal' ? (
                      <span className="text-xl">💸</span>
                    ) : (
                      <span className="text-xl">🔄</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">
                      {transaction.type === 'provider_earning' ? t('financial.transaction.provider_earning') :
                       transaction.type === 'withdrawal' ? t('financial.transaction.withdrawal') :
                       transaction.description || t('financial.transaction.transaction')}
                    </p>
                    <p className="text-sm text-gray-400">
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
                  <p className={`font-bold text-lg ${
                    transaction.type === 'provider_earning' ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400' :
                    transaction.type === 'withdrawal' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400' :
                    'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400'
                  }`}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    {financialService.formatCurrency(Math.abs(transaction.net_amount))}
                  </p>
                  <p className="text-xs text-gray-400">
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
