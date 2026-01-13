import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface EarningStats {
  total_earnings: number;
  this_month_earnings: number;
  last_month_earnings: number;
  pending_withdrawals: number;
  available_balance: number;
  total_bookings: number;
  completed_bookings: number;
}

interface Transaction {
  transaction_id: number;
  booking_id: number;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
  description: string;
  client_username?: string;
}

interface Withdrawal {
  withdrawal_id: number;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
  rejection_reason?: string;
}

export const ProviderEarningsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<EarningStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdrawals'>('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const [walletRes, transactionsRes, withdrawalsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/transactions'),
        api.get('/withdrawals'),
      ]);

      setStats({
        total_earnings: walletRes.data.total_earnings || 0,
        this_month_earnings: walletRes.data.this_month_earnings || 0,
        last_month_earnings: walletRes.data.last_month_earnings || 0,
        pending_withdrawals: walletRes.data.pending_withdrawals || 0,
        available_balance: walletRes.data.available_balance || 0,
        total_bookings: walletRes.data.total_bookings || 0,
        completed_bookings: walletRes.data.completed_bookings || 0,
      });

      setTransactions(transactionsRes.data.transactions || []);
      setWithdrawals(withdrawalsRes.data.withdrawals || []);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch earnings');
      }
      setStats({
        total_earnings: 0,
        this_month_earnings: 0,
        last_month_earnings: 0,
        pending_withdrawals: 0,
        available_balance: 0,
        total_bookings: 0,
        completed_bookings: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      alert(t('earnings.invalid_amount', 'Please enter a valid amount'));
      return;
    }

    if (stats && amount > stats.available_balance) {
      alert(t('earnings.insufficient_balance', 'Insufficient balance'));
      return;
    }

    try {
      await api.post('/withdrawals', { amount });
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      await fetchEarningsData();
      alert(t('earnings.withdraw_success', 'Withdrawal request submitted'));
    } catch (err: unknown) {
      alert(err.response?.data?.error || 'Failed to request withdrawal');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← {t('common.back', 'Back')}
          </button>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              💰 {t('earnings.title', 'Earnings & Wallet')}
            </span>
          </h1>
          <p className="text-gray-400">{t('earnings.subtitle', 'Track your income and manage withdrawals')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
            <div className="text-green-400 text-sm font-semibold mb-1">{t('earnings.available', 'Available Balance')}</div>
            <div className="text-white text-3xl font-black">฿{stats?.available_balance.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="text-blue-400 text-sm font-semibold mb-1">{t('earnings.this_month', 'This Month')}</div>
            <div className="text-white text-3xl font-black">฿{stats?.this_month_earnings.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-purple-400 text-sm font-semibold mb-1">{t('earnings.total', 'Total Earnings')}</div>
            <div className="text-white text-3xl font-black">฿{stats?.total_earnings.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-6 border border-yellow-500/30">
            <div className="text-yellow-400 text-sm font-semibold mb-1">{t('earnings.pending', 'Pending')}</div>
            <div className="text-white text-3xl font-black">฿{stats?.pending_withdrawals.toLocaleString()}</div>
          </div>
        </div>

        {/* Withdraw Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={!stats || stats.available_balance <= 0}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-neon-pink/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 {t('earnings.withdraw', 'Request Withdrawal')}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['overview', 'transactions', 'withdrawals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {tab === 'overview' && t('earnings.tab_overview', 'Overview')}
              {tab === 'transactions' && t('earnings.tab_transactions', 'Transactions')}
              {tab === 'withdrawals' && t('earnings.tab_withdrawals', 'Withdrawals')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Booking Stats */}
            <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{t('earnings.booking_stats', 'Booking Statistics')}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">{t('earnings.total_bookings', 'Total Bookings')}</div>
                  <div className="text-white text-2xl font-bold">{stats?.total_bookings}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">{t('earnings.completed', 'Completed')}</div>
                  <div className="text-green-400 text-2xl font-bold">{stats?.completed_bookings}</div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">{t('earnings.recent_transactions', 'Recent Transactions')}</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">{t('earnings.no_transactions', 'No transactions yet')}</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(tx => (
                    <div key={tx.transaction_id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-700">
                      <div>
                        <p className="text-white font-semibold">{tx.description}</p>
                        <p className="text-gray-400 text-sm">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${tx.transaction_type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.transaction_type === 'credit' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center py-12">{t('earnings.no_transactions', 'No transactions yet')}</p>
            ) : (
              <div className="space-y-3">
                {transactions.map(tx => (
                  <div key={tx.transaction_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-700 gap-3">
                    <div className="flex-1">
                      <p className="text-white font-semibold mb-1">{tx.description}</p>
                      {tx.client_username && (
                        <p className="text-gray-400 text-sm">👤 {tx.client_username}</p>
                      )}
                      <p className="text-gray-500 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                      <div className={`text-xl font-bold ${tx.transaction_type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.transaction_type === 'credit' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="bg-black/40 rounded-2xl p-6 border border-gray-700">
            {withdrawals.length === 0 ? (
              <p className="text-gray-400 text-center py-12">{t('earnings.no_withdrawals', 'No withdrawal requests yet')}</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map(wd => (
                  <div key={wd.withdrawal_id} className="p-4 bg-black/40 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(wd.status)}`}>
                        {wd.status}
                      </span>
                      <div className="text-white text-xl font-bold">฿{wd.amount.toLocaleString()}</div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <div>{t('earnings.requested', 'Requested')}: {new Date(wd.created_at).toLocaleString()}</div>
                      {wd.processed_at && (
                        <div>{t('earnings.processed', 'Processed')}: {new Date(wd.processed_at).toLocaleString()}</div>
                      )}
                      {wd.rejection_reason && (
                        <div className="text-red-400 mt-2">{t('earnings.reason', 'Reason')}: {wd.rejection_reason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 sm:p-8 max-w-md w-full border border-neon-pink/30">
              <h2 className="text-2xl font-bold text-white mb-4">{t('earnings.withdraw_title', 'Request Withdrawal')}</h2>
              <div className="mb-4">
                <div className="text-gray-400 text-sm mb-1">{t('earnings.available', 'Available Balance')}</div>
                <div className="text-white text-3xl font-black">฿{stats?.available_balance.toLocaleString()}</div>
              </div>
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">{t('earnings.amount', 'Withdrawal Amount')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">฿</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    max={stats?.available_balance}
                    min="100"
                    step="100"
                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white text-lg font-semibold focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 outline-none"
                    placeholder="0"
                  />
                </div>
                <button
                  onClick={() => setWithdrawAmount(stats?.available_balance.toString() || '0')}
                  className="text-neon-pink text-sm mt-2 hover:underline"
                >
                  {t('earnings.withdraw_all', 'Withdraw all')}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWithdrawModal(false); setWithdrawAmount(''); }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-xl shadow-lg hover:shadow-neon-pink/50 transition disabled:opacity-50"
                >
                  {t('earnings.confirm', 'Confirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderEarningsPage;
