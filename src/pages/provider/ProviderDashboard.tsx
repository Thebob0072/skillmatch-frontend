import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  completed_bookings: number;
  total_earnings: number;
  this_month_earnings: number;
  profile_views: number;
  rating: number;
  review_count: number;
}

interface RecentBooking {
  booking_id: number;
  client_username: string;
  service_name: string;
  booking_date: string;
  status: string;
  amount: number;
}

export const ProviderDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/provider/stats'),
        api.get('/provider/bookings/recent'),
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data || []);
      
      // Check profile completeness
      const profileRes = await api.get('/provider/profile');
      setProfileComplete(profileRes.data?.is_complete || false);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch dashboard data');
      }
      setStats({
        total_bookings: 0,
        pending_bookings: 0,
        completed_bookings: 0,
        total_earnings: 0,
        this_month_earnings: 0,
        profile_views: 0,
        rating: 0,
        review_count: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
                👋 {t('providerDashboard.welcome')}, {user?.username}!
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400">{t('providerDashboard.subtitle')}</p>
          </div>
          <Link
            to="/provider/profile"
            className="px-6 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(255,16,240,0.5)] transition-all"
          >
            👁️ {t('providerDashboard.viewProfile')}
          </Link>
        </div>

        {/* Profile Incomplete Warning */}
        {!profileComplete && (
          <div className="mb-8 p-6 bg-gradient-to-r from-neon-gold/20 to-orange-500/20 border-2 border-neon-gold rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-neon-gold font-bold text-xl mb-2">
                  {t('providerDashboard.completeProfile')}
                </h3>
                <p className="text-gray-300 mb-4">
                  {t('providerDashboard.completeProfileDesc')}
                </p>
                <Link
                  to="/provider/onboarding"
                  className="inline-block px-6 py-2 bg-neon-gold text-black rounded-lg font-bold hover:bg-neon-gold/80 transition-all"
                >
                  🚀 {t('providerDashboard.completeNow')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-neon-pink/30 p-6">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-3xl font-bold text-white">{stats?.total_bookings || 0}</div>
            <div className="text-gray-400 text-sm">{t('providerDashboard.totalBookings')}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-yellow-400">{stats?.pending_bookings || 0}</div>
            <div className="text-gray-400 text-sm">{t('providerDashboard.pending')}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-neon-green/30 p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-neon-green">฿{(stats?.this_month_earnings || 0).toLocaleString()}</div>
            <div className="text-gray-400 text-sm">{t('providerDashboard.thisMonth')}</div>
          </div>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-neon-gold/30 p-6">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-neon-gold">{stats?.rating?.toFixed(1) || '0.0'}</div>
            <div className="text-gray-400 text-sm">{stats?.review_count || 0} {t('providerDashboard.reviews')}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/provider/services"
            className="bg-black/30 hover:bg-black/50 border border-gray-700 hover:border-neon-purple rounded-xl p-6 text-center transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💼</div>
            <div className="text-white font-bold">{t('providerDashboard.manageServices')}</div>
          </Link>
          <Link
            to="/provider/photos"
            className="bg-black/30 hover:bg-black/50 border border-gray-700 hover:border-neon-pink rounded-xl p-6 text-center transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📸</div>
            <div className="text-white font-bold">{t('providerDashboard.managePhotos')}</div>
          </Link>
          <Link
            to="/schedule"
            className="bg-black/30 hover:bg-black/50 border border-gray-700 hover:border-neon-green rounded-xl p-6 text-center transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
            <div className="text-white font-bold">{t('providerDashboard.manageSchedule')}</div>
          </Link>
          <Link
            to="/financial"
            className="bg-black/30 hover:bg-black/50 border border-gray-700 hover:border-neon-gold rounded-xl p-6 text-center transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💳</div>
            <div className="text-white font-bold">{t('providerDashboard.financials')}</div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-black/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">📋 {t('providerDashboard.recentBookings')}</h2>
              <Link to="/bookings" className="text-neon-purple hover:text-neon-pink text-sm">
                {t('providerDashboard.viewAll')} →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">📭</span>
                <p className="text-gray-400">{t('providerDashboard.noBookings')}</p>
                <p className="text-gray-500 text-sm mt-2">{t('providerDashboard.noBookingsHint')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map(booking => (
                  <div
                    key={booking.booking_id}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center text-white font-bold">
                        {booking.client_username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{booking.client_username}</div>
                        <div className="text-gray-400 text-sm">{booking.service_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-neon-gold font-bold">฿{booking.amount?.toLocaleString()}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety & Settings */}
          <div className="space-y-6">
            {/* Safety Features */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6">
              <h2 className="text-xl font-bold text-white mb-4">🛡️ {t('providerDashboard.safety')}</h2>
              <div className="space-y-3">
                <Link
                  to="/safety/trusted-contacts"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-red-500/10 transition-all"
                >
                  <span className="text-gray-300">👥 {t('providerDashboard.trustedContacts')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
                <Link
                  to="/safety/sos"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-red-500/10 transition-all"
                >
                  <span className="text-gray-300">🆘 {t('providerDashboard.sosSettings')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
                <Link
                  to="/safety/checkin"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-red-500/10 transition-all"
                >
                  <span className="text-gray-300">⏰ {t('providerDashboard.checkIn')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
              </div>
            </div>

            {/* Promotion Tools */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-neon-gold/30 p-6">
              <h2 className="text-xl font-bold text-white mb-4">📈 {t('providerDashboard.promotion')}</h2>
              <div className="space-y-3">
                <Link
                  to="/provider/boost"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-neon-gold/10 transition-all"
                >
                  <span className="text-gray-300">🚀 {t('providerDashboard.boostProfile')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
                <Link
                  to="/provider/coupons"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-neon-gold/10 transition-all"
                >
                  <span className="text-gray-300">🎟️ {t('providerDashboard.coupons')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
                <Link
                  to="/provider/private-gallery"
                  className="flex items-center justify-between p-3 bg-black/30 rounded-xl hover:bg-neon-gold/10 transition-all"
                >
                  <span className="text-gray-300">🔐 {t('providerDashboard.privateGallery')}</span>
                  <span className="text-gray-500">→</span>
                </Link>
              </div>
            </div>

            {/* Profile Views */}
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-neon-blue/30 p-6">
              <h2 className="text-lg font-bold text-white mb-2">👁️ {t('providerDashboard.profileViews')}</h2>
              <div className="text-4xl font-bold text-neon-blue mb-2">
                {stats?.profile_views || 0}
              </div>
              <p className="text-gray-400 text-sm">{t('providerDashboard.last30Days')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
